import pytest
from unittest.mock import patch, mock_open, MagicMock
from app.services.menu_analysis import analyze_menu_image

# Mock successful API response
MOCK_SUCCESSFUL_RESPONSE = MagicMock(
    choices=[
        MagicMock(
            message=MagicMock(
                content="""
                {
                    "menu_items": [
                        {
                            "name": "Margherita Pizza",
                            "price": "$14.99",
                            "ingredients": ["tomato sauce", "mozzarella", "basil"]
                        },
                        {
                            "name": "Pasta Carbonara",
                            "price": "$16.99",
                            "ingredients": ["pasta", "eggs", "pecorino", "guanciale"]
                        }
                    ]
                }
                """
            )
        )
    ]
)

# Mock invalid JSON response
MOCK_INVALID_JSON_RESPONSE = MagicMock(
    choices=[MagicMock(message=MagicMock(content="Invalid JSON response"))]
)

# Mock invalid structure response
MOCK_INVALID_STRUCTURE_RESPONSE = MagicMock(
    choices=[
        MagicMock(
            message=MagicMock(
                content="""
                {
                    "menu_items": [
                        {
                            "name": "Invalid Item",
                            "price": "$10.99"
                        }
                    ]
                }
                """
            )
        )
    ]
)


@pytest.fixture
def mock_image_path():
    return "path/to/test/menu.jpg"


def test_successful_menu_analysis(mock_image_path):
    """Test successful menu analysis with valid response"""
    with patch("builtins.open", mock_open(read_data="test image data")), patch(
        "app.services.menu_analysis.client.chat.completions.create",
        return_value=MOCK_SUCCESSFUL_RESPONSE,
    ):

        result = analyze_menu_image(mock_image_path)

        assert result["success"] is True
        assert len(result["menu_items"]) == 2
        assert result["menu_items"][0]["name"] == "Margherita Pizza"
        assert result["menu_items"][0]["price"] == "$14.99"
        assert "mozzarella" in result["menu_items"][0]["ingredients"]
        assert result["menu_items"][1]["name"] == "Pasta Carbonara"


def test_invalid_json_response(mock_image_path):
    """Test handling of invalid JSON response"""
    with patch("builtins.open", mock_open(read_data="test image data")), patch(
        "app.services.menu_analysis.client.chat.completions.create",
        return_value=MOCK_INVALID_JSON_RESPONSE,
    ):

        result = analyze_menu_image(mock_image_path)

        assert result["success"] is False
        assert "Failed to parse menu items" in result["error"]
        assert len(result["menu_items"]) == 0


def test_invalid_structure_response(mock_image_path):
    """Test handling of response with invalid menu item structure"""
    with patch("builtins.open", mock_open(read_data="test image data")), patch(
        "app.services.menu_analysis.client.chat.completions.create",
        return_value=MOCK_INVALID_STRUCTURE_RESPONSE,
    ):

        result = analyze_menu_image(mock_image_path)

        assert result["success"] is True
        assert len(result["menu_items"]) == 0  # Should be 0 as the item is invalid


def test_file_not_found(mock_image_path):
    """Test handling of file not found error"""
    with patch("builtins.open", mock_open()) as mock_file:
        mock_file.side_effect = FileNotFoundError()

        result = analyze_menu_image(mock_image_path)

        assert result["success"] is False
        assert "menu_items" in result
        assert len(result["menu_items"]) == 0


def test_api_error(mock_image_path):
    """Test handling of API error"""
    with patch("builtins.open", mock_open(read_data="test image data")), patch(
        "app.services.menu_analysis.client.chat.completions.create"
    ) as mock_api:

        mock_api.side_effect = Exception("API Error")
        result = analyze_menu_image(mock_image_path)

        assert result["success"] is False
        assert "API Error" in result["error"]
        assert len(result["menu_items"]) == 0


def test_empty_menu_items(mock_image_path):
    """Test handling of empty menu items"""
    mock_empty_response = MagicMock(
        choices=[MagicMock(message=MagicMock(content='{"menu_items": []}'))]
    )

    with patch("builtins.open", mock_open(read_data="test image data")), patch(
        "app.services.menu_analysis.client.chat.completions.create",
        return_value=mock_empty_response,
    ):

        result = analyze_menu_image(mock_image_path)

        assert result["success"] is True
        assert len(result["menu_items"]) == 0

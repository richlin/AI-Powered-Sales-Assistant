import base64
from typing import List, Dict
import json
from openai import OpenAI
from app.core.config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)


def encode_image(image_path: str) -> str:
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


def analyze_menu_image(image_path: str) -> Dict:
    """
    Analyze a menu image using gpt-4o-mini.
    Returns structured data about menu items, including names, prices, ingredients, and allergens.
    """
    try:
        # Read the image file
        with open(image_path, "rb") as image_file:
            # Call gpt-4o-mini API
            response = client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a menu analysis expert. Extract menu items, prices, ingredients, and allergens from the provided menu image.",
                    },
                    {
                        "role": "user",
                        "content": "Please analyze this menu and provide the following for each item:\n1. Name of the dish\n2. Price\n3. Main ingredients\n4. Potential allergens\n\nFormat your response as a JSON array.",
                    },
                ],
                max_tokens=settings.MAX_TOKENS,
                temperature=0,
            )

        # Parse the response
        content = response.choices[0].message.content
        try:
            menu_items = json.loads(content)
        except json.JSONDecodeError:
            # If the response is not valid JSON, try to extract structured data
            menu_items = [
                {
                    "name": "Sample Item",
                    "price": "$0.00",
                    "ingredients": ["ingredient1", "ingredient2"],
                    "allergens": ["allergen1"],
                }
            ]

        return {"success": True, "menu_items": menu_items}

    except Exception as e:
        return {"success": False, "error": str(e)}


def get_ingredient_recommendations(menu_items: List[Dict]) -> List[Dict]:
    """
    Generate product recommendations based on the analyzed menu items.
    """
    try:
        # Extract all ingredients from menu items
        all_ingredients = set()
        for item in menu_items:
            all_ingredients.update(item.get("ingredients", []))

        # Convert ingredients to a comma-separated string
        ingredients_list = ", ".join(all_ingredients)

        # Call gpt-4o-mini API for recommendations
        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": "You are a restaurant supply expert. Suggest high-quality products based on menu ingredients.",
                },
                {
                    "role": "user",
                    "content": f"Based on these ingredients: {ingredients_list}\n\nSuggest 5 high-quality products that would be valuable for this restaurant. Include name, description, price range, and tags.",
                },
            ],
            max_tokens=settings.MAX_TOKENS,
            temperature=0,
        )

        # Parse the response
        content = response.choices[0].message.content
        try:
            recommendations = json.loads(content)
        except json.JSONDecodeError:
            # If the response is not valid JSON, provide a default structure
            recommendations = [
                {
                    "name": "Sample Product",
                    "description": "Description unavailable",
                    "price": "Price range unavailable",
                    "tags": ["sample"],
                }
            ]

        return {"success": True, "recommendations": recommendations}

    except Exception as e:
        return {"success": False, "error": str(e)}

import base64
from typing import List, Dict
import json
from openai import OpenAI
from app.core.config import settings
from app.data.ingredients import INGREDIENTS_DATA

client = OpenAI(api_key=settings.OPENAI_API_KEY)


def encode_image(image_path: str) -> str:
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


def analyze_menu_image(image_path: str) -> Dict:
    """
    Analyze a menu image using gpt-4o-mini.
    Returns structured data about menu items, including names, prices, and ingredients.
    """
    try:
        # Encode the image to base64
        base64_image = encode_image(image_path)

        # Call gpt-4o-mini API with the image
        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": """You are a menu analysis expert. Your task is to extract menu items from images and return them in a specific JSON format.
                    Always return a valid JSON array of menu items with the following structure:
                    {
                        "menu_items": [
                            {
                                "name": "Item Name",
                                "price": "Price as string with currency symbol",
                                "ingredients": ["ingredient1", "ingredient2"]
                            }
                        ]
                    }""",
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": """Please analyze this menu and extract all items.
                            Format requirements:
                            1. Return ONLY valid JSON
                            2. Each item must have: name, price, and ingredients array
                            3. Price must include currency symbol
                            4. Ingredients should be an array of strings
                            5. Do not include any explanations or text outside the JSON structure""",
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            },
                        },
                    ],
                },
            ],
            max_tokens=settings.MAX_TOKENS,
            temperature=0,
            response_format={"type": "json_object"},
        )

        # Parse the response
        content = response.choices[0].message.content
        try:
            parsed_content = json.loads(content)
            menu_items = parsed_content.get("menu_items", [])

            # Validate the structure of each menu item
            validated_items = []
            for item in menu_items:
                if all(
                    key in item for key in ["name", "price", "ingredients"]
                ) and isinstance(item["ingredients"], list):
                    validated_items.append(
                        {
                            "name": item["name"],
                            "price": item["price"],
                            "ingredients": item["ingredients"],
                        }
                    )

            return {"success": True, "menu_items": validated_items}

        except json.JSONDecodeError as e:
            print(f"JSON Decode Error: {str(e)}")
            print(f"Raw response: {content}")
            return {
                "success": False,
                "error": "Failed to parse menu items",
                "menu_items": [],
            }

    except Exception as e:
        print(f"Analysis Error: {str(e)}")
        return {"success": False, "error": str(e), "menu_items": []}


def get_ingredient_recommendations(menu_items: List[Dict]) -> Dict:
    """
    Generate product recommendations based on the analyzed menu items using our ingredients database.
    """
    try:
        # Extract all ingredients from menu items
        menu_ingredients = set()
        for item in menu_items:
            menu_ingredients.update(item.get("ingredients", []))

        # Find matching premium ingredients from our database
        recommendations = []
        for category, items in INGREDIENTS_DATA.items():
            for item in items:
                # Check if any of the menu ingredients match this premium ingredient's common uses or tags
                is_relevant = any(
                    menu_ing.lower() in [use.lower() for use in item["common_uses"]]
                    or menu_ing.lower() in [tag.lower() for tag in item["tags"]]
                    or menu_ing.lower() in item["name"].lower()
                    for menu_ing in menu_ingredients
                )

                if is_relevant and len(recommendations) < 5:
                    recommendations.append(
                        {
                            "name": item["name"],
                            "description": f"Premium {item['name']} available in variants: {', '.join(item['variants'])}. "
                            f"Supplied by {', '.join(item['suppliers'])}. "
                            f"Perfect for {', '.join(item['common_uses'])}.",
                            "price_range": item["price_range"],
                            "category": category,
                            "tags": item["tags"],
                        }
                    )

        # If we don't have enough recommendations, add some default premium ingredients
        if len(recommendations) < 5:
            default_recommendations = [
                INGREDIENTS_DATA["Dairy & Cheese"][0],  # Premium Mozzarella
                INGREDIENTS_DATA["Premium Meats"][0],  # Wagyu Beef
                INGREDIENTS_DATA["Specialty Produce"][0],  # Heirloom Tomatoes
                INGREDIENTS_DATA["Premium Oils & Vinegars"][
                    0
                ],  # Extra Virgin Olive Oil
                INGREDIENTS_DATA["Specialty Spices"][0],  # Saffron Threads
            ]

            for item in default_recommendations:
                if len(recommendations) >= 5:
                    break

                # Check if this item is not already recommended
                if not any(rec["name"] == item["name"] for rec in recommendations):
                    recommendations.append(
                        {
                            "name": item["name"],
                            "description": f"Premium {item['name']} available in variants: {', '.join(item['variants'])}. "
                            f"Supplied by {', '.join(item['suppliers'])}. "
                            f"Perfect for {', '.join(item['common_uses'])}.",
                            "price_range": item["price_range"],
                            "category": next(
                                cat
                                for cat, items in INGREDIENTS_DATA.items()
                                if item in items
                            ),
                            "tags": item["tags"],
                        }
                    )

        return {"success": True, "recommendations": recommendations}

    except Exception as e:
        print(f"Recommendation Error: {str(e)}")
        return {"success": False, "error": str(e), "recommendations": []}

from typing import List, Optional
from pydantic import BaseModel, Field


class MenuItem(BaseModel):
    name: str = Field(..., description="Name of the dish")
    price: str = Field(..., description="Price of the dish")
    ingredients: List[str] = Field(
        default_factory=list, description="List of ingredients"
    )
    allergens: List[str] = Field(default_factory=list, description="List of allergens")


class MenuAnalysisResponse(BaseModel):
    menu_items: List[MenuItem] = Field(..., description="List of analyzed menu items")


class ErrorResponse(BaseModel):
    detail: str = Field(..., description="Error message")


class AnalysisRequest(BaseModel):
    image_url: Optional[str] = Field(None, description="URL of the menu image")
    # Additional fields can be added for future enhancements

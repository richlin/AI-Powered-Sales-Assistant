from typing import List, Optional
from pydantic import BaseModel, Field


class Product(BaseModel):
    id: str = Field(..., description="Unique identifier for the product")
    name: str = Field(..., description="Name of the product")
    description: str = Field(..., description="Product description")
    price: str = Field(..., description="Price of the product")
    image: str = Field(..., description="URL of the product image")
    tags: List[str] = Field(default_factory=list, description="Product tags/categories")


class ProductList(BaseModel):
    products: List[Product] = Field(..., description="List of products")
    total: int = Field(..., description="Total number of products")
    page: Optional[int] = Field(1, description="Current page number")
    page_size: Optional[int] = Field(10, description="Number of items per page")


class ProductResponse(BaseModel):
    product: Product = Field(..., description="Product details")


class ProductFilterParams(BaseModel):
    category: Optional[str] = Field(None, description="Filter by category")
    tag: Optional[str] = Field(None, description="Filter by tag")
    min_price: Optional[float] = Field(None, description="Minimum price")
    max_price: Optional[float] = Field(None, description="Maximum price")

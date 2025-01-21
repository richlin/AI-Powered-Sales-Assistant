from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional
from app.schemas.product import (
    Product,
    ProductList,
    ProductResponse,
    ProductFilterParams,
)
from app.schemas.menu import ErrorResponse

router = APIRouter()

# Mock data for demonstration
mock_recommendations = [
    {
        "id": "1",
        "name": "Premium Mozzarella",
        "description": "High-quality Italian mozzarella cheese",
        "price": "$24.99/kg",
        "image": "https://images.unsplash.com/photo-1618164436241-4473940d1f5c",
        "tags": ["Dairy", "Italian", "Premium"],
    },
    {
        "id": "2",
        "name": "Organic Tomato Sauce",
        "description": "Fresh organic tomato sauce",
        "price": "$8.99/jar",
        "image": "https://images.unsplash.com/photo-1612251485013-41e6e269c783",
        "tags": ["Organic", "Sauce", "Vegetarian"],
    },
]


@router.get(
    "/products",
    response_model=ProductList,
    summary="Get product recommendations",
    description="Get product recommendations with optional filtering by category and tags",
)
async def get_products(
    category: Optional[str] = Query(None, description="Filter by category"),
    tag: Optional[str] = Query(None, description="Filter by tag"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
) -> ProductList:
    filtered_products = mock_recommendations

    if category:
        filtered_products = [
            p
            for p in filtered_products
            if category.lower() in [t.lower() for t in p["tags"]]
        ]

    if tag:
        filtered_products = [
            p
            for p in filtered_products
            if tag.lower() in [t.lower() for t in p["tags"]]
        ]

    # Convert to Product models
    products = [Product(**p) for p in filtered_products]

    # Calculate pagination
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    paginated_products = products[start_idx:end_idx]

    return ProductList(
        products=paginated_products, total=len(products), page=page, page_size=page_size
    )


@router.get(
    "/products/{product_id}",
    response_model=ProductResponse,
    responses={404: {"model": ErrorResponse}},
    summary="Get product details",
    description="Get detailed information about a specific product",
)
async def get_product(product_id: str) -> ProductResponse:
    product = next((p for p in mock_recommendations if p["id"] == product_id), None)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
        )
    return ProductResponse(product=Product(**product))


@router.post(
    "/products/filter",
    response_model=ProductList,
    summary="Filter products",
    description="Filter products using multiple criteria",
)
async def filter_products(
    filters: ProductFilterParams,
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
) -> ProductList:
    filtered_products = mock_recommendations

    if filters.category:
        filtered_products = [
            p
            for p in filtered_products
            if filters.category.lower() in [t.lower() for t in p["tags"]]
        ]

    if filters.tag:
        filtered_products = [
            p
            for p in filtered_products
            if filters.tag.lower() in [t.lower() for t in p["tags"]]
        ]

    # Convert to Product models
    products = [Product(**p) for p in filtered_products]

    # Calculate pagination
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    paginated_products = products[start_idx:end_idx]

    return ProductList(
        products=paginated_products, total=len(products), page=page, page_size=page_size
    )

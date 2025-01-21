from fastapi import APIRouter, HTTPException, Query, status, Depends
from typing import List, Optional
from app.schemas.product import (
    Product,
    ProductList,
    ProductResponse,
    ProductFilterParams,
)
from app.schemas.menu import ErrorResponse, MenuItem
from app.services.menu_analysis import get_ingredient_recommendations

router = APIRouter()

# Store analyzed menu items in memory (in a real app, this would be in a database)
current_menu_items = []


def get_current_menu_items():
    return current_menu_items


def update_menu_items(items: List[dict]):
    global current_menu_items
    current_menu_items = items


@router.get(
    "/products",
    response_model=ProductList,
    summary="Get product recommendations",
    description="Get product recommendations based on menu analysis with optional filtering",
)
async def get_products(
    category: Optional[str] = Query(None, description="Filter by category"),
    tag: Optional[str] = Query(None, description="Filter by tag"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    menu_items: List[dict] = Depends(get_current_menu_items),
) -> ProductList:
    # Get recommendations based on menu items
    recommendations = get_ingredient_recommendations(menu_items)

    if not recommendations["success"]:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=recommendations.get("error", "Failed to get recommendations"),
        )

    # Convert recommendations to Product models
    products = []
    for rec in recommendations["recommendations"]:
        product = Product(
            id=str(len(products) + 1),
            name=rec["name"],
            description=rec["description"],
            price=rec["price_range"],
            image="https://images.unsplash.com/photo-1618164436241-4473940d1f5c",
            tags=[*rec["tags"], rec["category"]],
        )
        products.append(product)

    # Apply filters
    filtered_products = products
    if category:
        filtered_products = [
            p
            for p in filtered_products
            if category.lower() in [t.lower() for t in p.tags]
        ]

    if tag:
        filtered_products = [
            p for p in filtered_products if tag.lower() in [t.lower() for t in p.tags]
        ]

    # Calculate pagination
    total = len(filtered_products)
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    paginated_products = filtered_products[start_idx:end_idx]

    return ProductList(
        products=paginated_products, total=total, page=page, page_size=page_size
    )


@router.get(
    "/products/{product_id}",
    response_model=ProductResponse,
    responses={404: {"model": ErrorResponse}},
    summary="Get product details",
    description="Get detailed information about a specific product",
)
async def get_product(
    product_id: str, menu_items: List[dict] = Depends(get_current_menu_items)
) -> ProductResponse:
    # Get recommendations based on menu items
    recommendations = get_ingredient_recommendations(menu_items)
    if not recommendations["success"]:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=recommendations.get("error", "Failed to get recommendations"),
        )

    # Find the product with the matching ID
    try:
        rec = recommendations["recommendations"][int(product_id) - 1]
        product = Product(
            id=product_id,
            name=rec["name"],
            description=rec["description"],
            price=rec["price_range"],
            image="https://images.unsplash.com/photo-1618164436241-4473940d1f5c",
            tags=[*rec["tags"], rec["category"]],
        )
        return ProductResponse(product=product)
    except (IndexError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
        )


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
    menu_items: List[dict] = Depends(get_current_menu_items),
) -> ProductList:
    # Get recommendations based on menu items
    recommendations = get_ingredient_recommendations(menu_items)
    if not recommendations["success"]:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=recommendations.get("error", "Failed to get recommendations"),
        )

    # Convert recommendations to products
    products = [
        Product(
            id=str(i + 1),
            name=rec["name"],
            description=rec["description"],
            price=rec["price_range"],
            image="https://images.unsplash.com/photo-1618164436241-4473940d1f5c",
            tags=[*rec["tags"], rec["category"]],
        )
        for i, rec in enumerate(recommendations["recommendations"])
    ]

    # Apply filters
    filtered_products = products
    if filters.category:
        filtered_products = [
            p
            for p in filtered_products
            if filters.category.lower() in [t.lower() for t in p.tags]
        ]

    if filters.tag:
        filtered_products = [
            p
            for p in filtered_products
            if filters.tag.lower() in [t.lower() for t in p.tags]
        ]

    # Calculate pagination
    total = len(filtered_products)
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    paginated_products = filtered_products[start_idx:end_idx]

    return ProductList(
        products=paginated_products, total=total, page=page, page_size=page_size
    )

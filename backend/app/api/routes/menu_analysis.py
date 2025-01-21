import os
import uuid
from typing import List
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from fastapi.responses import JSONResponse
from app.services.menu_analysis import (
    analyze_menu_image,
    get_ingredient_recommendations,
)
from app.core.config import settings
from app.schemas.menu import MenuAnalysisResponse, ErrorResponse, MenuItem
from app.schemas.product import ProductList, Product
from .recommendations import update_menu_items

router = APIRouter()


@router.post(
    "/analyze-menu",
    response_model=MenuAnalysisResponse,
    responses={400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
    summary="Analyze menu image",
    description="Upload and analyze a menu image to extract items and ingredients",
)
async def analyze_menu(file: UploadFile = File(...)) -> MenuAnalysisResponse:
    """
    Upload and analyze a menu image.
    Returns structured data about menu items and recommendations.
    """
    # Validate file extension
    file_ext = file.filename.split(".")[-1].lower()
    if file_ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed types: {settings.ALLOWED_EXTENSIONS}",
        )

    # Generate a unique filename
    unique_filename = f"{uuid.uuid4()}.{file_ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)

    try:
        # Ensure upload directory exists
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

        # Read file content
        content = await file.read()
        if len(content) > settings.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File size exceeds maximum limit of {settings.MAX_FILE_SIZE // (1024 * 1024)}MB",
            )

        # Save the file
        with open(file_path, "wb") as buffer:
            buffer.write(content)

        # Analyze the menu image
        analysis_result = analyze_menu_image(file_path)

        if not analysis_result["success"]:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error analyzing menu: {analysis_result.get('error', 'Unknown error')}",
            )

        # Store menu items for recommendations
        update_menu_items(analysis_result["menu_items"])

        # Convert the response to proper schema
        try:
            menu_items = [MenuItem(**item) for item in analysis_result["menu_items"]]
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error formatting response: {str(e)}",
            )

        return MenuAnalysisResponse(menu_items=menu_items)

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing menu: {str(e)}",
        )
    finally:
        # Clean up uploaded file
        if os.path.exists(file_path):
            os.remove(file_path)


@router.get(
    "/analysis/{analysis_id}",
    response_model=MenuAnalysisResponse,
    responses={404: {"model": ErrorResponse}},
    summary="Get analysis results",
    description="Retrieve the results of a previous menu analysis",
)
async def get_analysis(analysis_id: str) -> MenuAnalysisResponse:
    """
    Get product recommendations for a specific menu.
    This is a placeholder endpoint for future implementation with database storage.
    """
    # TODO: Implement database storage and retrieval
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="This endpoint is not implemented yet",
    )

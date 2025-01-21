from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from app.api.routes import menu_analysis, recommendations
from app.core.config import settings

# Create the main application
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="""
    AI-Powered Sales Assistant API provides menu analysis and product recommendations.
    
    ## Features
    * Menu image analysis using GPT-4 Vision
    * Ingredient extraction and categorization
    * Product recommendations
    * RESTful API endpoints
    
    ## Authentication
    All API endpoints are currently open for testing. Authentication will be added in future versions.
    """,
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create API router with version prefix
api_router = APIRouter(prefix="/api/v1")

# Include route modules
api_router.include_router(menu_analysis.router, prefix="/menu", tags=["Menu Analysis"])
api_router.include_router(
    recommendations.router, prefix="/recommendations", tags=["Product Recommendations"]
)

# Include API router in main app
app.include_router(api_router)


# Customize OpenAPI schema
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=settings.PROJECT_NAME,
        version="1.0.0",
        description=app.description,
        routes=app.routes,
    )

    # Add API server URLs
    openapi_schema["servers"] = [
        {"url": "http://localhost:8000", "description": "Development server"},
    ]

    # Add security schemes if needed
    # openapi_schema["components"]["securitySchemes"] = {...}

    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi


@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint providing API information and links to documentation.
    """
    return {
        "name": settings.PROJECT_NAME,
        "version": "1.0.0",
        "description": "AI-Powered Sales Assistant API",
        "docs_url": "/api/docs",
        "redoc_url": "/api/redoc",
        "openapi_url": "/api/openapi.json",
    }

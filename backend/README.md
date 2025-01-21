# AI-Powered Sales Assistant Backend

This is the backend service for the AI-Powered Sales Assistant, built with FastAPI and OpenAI's GPT-4 Vision API.

## Features

- Menu image analysis using GPT-4 Vision
- Ingredient extraction and categorization
- Product recommendations based on menu analysis
- RESTful API endpoints
- CORS support for frontend integration

## Prerequisites

- Python 3.8 or higher
- OpenAI API key
- Virtual environment (recommended)

## Setup

1. Clone the repository and navigate to the backend directory:
```bash
cd backend
```

2. Run the setup script:
```bash
./setup.sh
```

3. Update the OpenAI API key in the `.dev` file:
```
OPENAI_API_KEY=your_api_key_here
```

## Running the Server

1. Activate the virtual environment:
```bash
source venv/bin/activate
```

2. Start the server:
```bash
python run.py
```

The server will start at `http://localhost:8000`

## API Documentation

Once the server is running, you can access the API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Menu Analysis

- `POST /api/v1/analyze-menu`
  - Upload and analyze a menu image
  - Returns structured data about menu items and recommendations

### Product Recommendations

- `GET /api/v1/products`
  - Get product recommendations with optional filtering
  - Query parameters: category, tag

- `GET /api/v1/products/{product_id}`
  - Get detailed information about a specific product

## Development

The project structure follows a modular approach:
```
backend/
├── app/
│   ├── api/
│   │   └── routes/
│   │       ├── menu_analysis.py
│   │       └── recommendations.py
│   ├── core/
│   │   └── config.py
│   └── services/
│       └── menu_analysis.py
├── uploads/
├── requirements.txt
├── run.py
└── setup.sh
```

## Error Handling

The API includes comprehensive error handling for:
- Invalid file types
- File size limits
- API errors
- Processing failures

## Security

- CORS configuration for frontend access
- File type validation
- Automatic file cleanup after processing 
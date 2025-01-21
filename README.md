# AI-Powered Sales Assistant

An intelligent sales assistant that helps sales representatives analyze restaurant menus and provide targeted product recommendations using AI.

## Features

- 📸 Menu Image Analysis
  - Upload and analyze menu images
  - Extract menu items, prices, and ingredients
  - Identify potential allergens
  - Structured JSON output

- 🎯 Smart Product Recommendations
  - AI-powered product suggestions based on menu analysis
  - Tailored recommendations for restaurant needs
  - Detailed product descriptions and pricing
  - Categorized by tags for easy filtering

- 💼 Modern User Interface
  - Clean, responsive dashboard
  - Real-time analysis results
  - Interactive product grid
  - Easy-to-use upload interface

## Tech Stack

### Frontend
- Next.js 14 with TypeScript
- Shadcn UI components
- Tailwind CSS for styling
- Lucide icons

### Backend
- FastAPI (Python)
- OpenAI GPT-4o-mini for AI analysis
- Pydantic for data validation
- CORS support for API security

## Getting Started

### Prerequisites
- Node.js 18 or higher
- Python 3.8 or higher
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/AI-Powered-Sales-Assistant.git
cd AI-Powered-Sales-Assistant
```

2. Set up the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

3. Configure environment variables:
Create a `.dev` file in the backend directory:
```env
OPENAI_API_KEY=your_api_key_here
```

4. Set up the frontend:
```bash
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd backend
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
python run.py
```
The backend will be available at `http://localhost:8000`

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```
The frontend will be available at `http://localhost:3000`

## Usage

1. Open the application in your browser at `http://localhost:3000`
2. Upload a menu image using the upload button
3. View the analyzed menu items and extracted information
4. Browse AI-generated product recommendations
5. Use the clear button to reset the analysis and start over

## API Documentation

The backend API documentation is available at:
- Swagger UI: `http://localhost:8000/api/docs`
- ReDoc: `http://localhost:8000/api/redoc`

### Key Endpoints

- `POST /api/v1/menu/analyze-menu` - Upload and analyze menu images
- `GET /api/v1/recommendations/products` - Get product recommendations
- `GET /api/v1/recommendations/products/{product_id}` - Get specific product details

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for providing the GPT-4o-mini model
- Shadcn UI for the beautiful component library
- FastAPI for the efficient backend framework
# AI-Powered Sales Assistant - Project Requirements Document

## 1. Project Overview
Develop an AI-powered sales assistant that integrates with existing CRM systems to provide real-time insights, recommendations, and support to sales representatives during client interactions. 

Imagine a sales representative visiting a restaurant owner. Sales representatives can take a photo of the menu from restaurant. The AI assistant analyzes the ingredients from the menu, and having analyzed the restaurant's past order history, proactively suggests ingredients that align with the restaurant's menu. It also alerts the representative that certain ingredients are not purchased from the company and suggests alternative options.

**Tech Stack:**
- NextJS 14
- Shadcn UI
- Tailwind CSS
- Lucid
- OpenAI

## 2. Core Functionalities

### 2.1 User-Friendly Interface

#### 2.1.1 Menu Upload & Results Display

**uploadMenuImage(imageFile: File) → void**
- Purpose: Provide simple menu photo upload interface
- Inputs: imageFile - Selected image file
- Outputs: None (triggers image analysis workflow)
- Process:
  - Validate file format and size
  - Send to backend for analysis
  - Display progress and results

**displayAnalysisResults(menuAnalysis: MenuAnalysisResult) → void**
- Purpose: Show recognized menu items and insights
- Inputs: menuAnalysis - Detailed menu breakdown
- Outputs: UI rendering of results
- Process:
  - Convert data to user-readable format
  - Provide interactive selection elements

#### 2.1.2 Recommended Products & Alternatives UI

**displayRecommendations(recommendationList: RecommendationList) → void**
- Purpose: Present recommendations clearly
- Inputs: recommendationList - Recommended items with metadata
- Outputs: Visual/textual product list with details
- Process:
  - Sort/filter for relevance
  - Show costs and availability
  - Enable cart/notes functionality


### 2.2 Menu Image Recognition & Analysis

#### 2.2.1. Image Processing

**analyzeMenuImage(imageData: Image) → MenuAnalysisResult**
- Purpose: Analyze the photo of a menu to identify dishes and/or ingredients OpenAI GPT-4o mini model
- Inputs:
  - imageData: The raw image file or processed image data
- Outputs:
  - MenuAnalysisResult: A structured result containing recognized dishes 
- Process:
  - Use OpenAI GPT-4o mini model to detect text
  - Parse text to extract dish names, prices, keywords, and potential ingredients
  - Return structured data for the next analysis step 

#### 2.2.2. Menu Data Extraction

**extractIngredientsFromText(text: string) → IngredientList**
- Purpose: Identify ingredient names from MenuAnalysisResult
- Inputs:
  - text: MenuAnalysisResult
- Outputs:
  - IngredientList: A list of identified ingredient objects or strings
- Process:
  - Use OpenAI GPT-4o mini model to identify the ingredients used for each dish 
  - Return a refined list of dishes and their recognized ingredients
  - Show this result in the UI 


## 3. Documentation of packages and libraries used

### Front-End: Next.js
1. **Next.js**
   - Package: `next`
   - Usage: SPA + SSR, routing, serverless/static exports

2. **React**
   - Packages: `react`, `react-dom`
   - Usage: UI component building

3. **TypeScript**
   - Package: `typescript`
   - Usage: Type safety and tooling

4. **UI & Styling**
    - Tailwind CSS (`tailwindcss`)


### Back-End: Python

#### Python Web Framework
- **FastAPI**
  - Package: `fastapi`
  - Usage: RESTful endpoints, OpenAPI docs
  - Run with: `uvicorn main:app --reload`

#### Image Handling
- **pytesseract**: gpt-4o mini  
- **Pillow**: Image preprocessing


## 4. File structure
├── README.md
├── .gitignore
├── docker-compose.yml       # (Optional) 
│
├── frontend/                # Next.js front-end app
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── public/
│   │   └── images/
│   ├── styles/              # Global or Tailwind CSS styles
│   │   └── globals.css
│   ├── pages/
│   │   ├── _app.tsx
│   │   ├── index.tsx        # Home page
│   │   └── sales-assistant/
│   │       └── index.tsx    # Main sales assistant UI
│   ├── components/
│   │   ├── MenuUpload.tsx
│   │   ├── Recommendations.tsx
│   │   └── ...
│   └── utils/               # Helper functions or fetch wrappers
│       └── fetchClient.ts
│
└── backend/                 # Python FastAPI backend
    ├── requirements.txt     # Python dependencies (FastAPI, Pillow, pytesseract, etc.)
    ├── main.py              # Entry point for FastAPI ("uvicorn main:app --reload")
    ├── app/
    │   ├── __init__.py
    │   ├── config.py        # Config variables, DB connections, etc. (if needed)
    │   ├── routes/
    │   │   ├── ocr.py       # Endpoint for menu image upload & 
    │   │   └── __init__.py
    │   ├── services/
    │   │   ├── ocr_service.py       # Contains the OCR logic w/ pytesseract
    │   └── utils/
    │       └── image_processing.py  # If you need specialized image preprocessing
    └── data/                        # Mock data files or local DB
        ├── product_catalog.json
        └── ...
#!/bin/bash

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create necessary directories
mkdir -p uploads

# Create .dev file if it doesn't exist
if [ ! -f .dev ]; then
    echo "Creating .dev file..."
    echo "OPENAI_API_KEY=your_api_key_here" > .dev
    echo "Please update the OPENAI_API_KEY in .dev file"
fi

echo "Setup complete! Run 'source venv/bin/activate' to activate the virtual environment"
echo "Then run 'python run.py' to start the server" 
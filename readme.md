# Nova AI – Python AI Chatbot

Nova AI is a web-based conversational chatbot built using Python,
Flask, Ollama, and Llama 3.

It allows users to interact with a locally running language model
through a simple and responsive chat interface.

## Features

- AI-generated conversational responses
- Local AI inference using Ollama
- Conversation context and follow-up questions
- Modern, responsive chat interface
- Suggested prompts
- Typing indicator
- Start a new conversation
- Error handling for connection problems

## Technologies Used

- Python
- Flask
- Ollama
- Llama 3
- HTML5
- CSS3
- JavaScript

## Project Structure

    Python-AI-Chatbot/
    ├── app.py
    ├── chatbot.py
    ├── requirements.txt
    ├── README.md
    ├── .gitignore
    ├── templates/
    │   └── index.html
    └── static/
        ├── style.css
        └── script.js

## Prerequisites

- Python 3.10 or later
- Ollama
- Llama 3 model

## Installation

### 1. Clone the repository

    git clone YOUR_GITHUB_REPOSITORY_URL

    cd Python-AI-Chatbot

### 2. Create a virtual environment

    python -m venv venv

Activate it on Windows:

    venv\Scripts\activate

### 3. Install dependencies

    pip install -r requirements.txt

### 4. Install Ollama

Download Ollama from:

https://ollama.com/

### 5. Download the model

    ollama pull llama3

### 6. Start Ollama

Ensure the Ollama application or service is running.

Test the model:

    ollama run llama3

### 7. Start the Flask application

    python app.py

### 8. Open the chatbot

Visit:

http://127.0.0.1:5000

## How It Works

1. The user enters a message in the browser.
2. JavaScript sends the message to the Flask backend.
3. Flask forwards it to the chatbot module.
4. The chatbot sends the conversation to Ollama.
5. Llama 3 generates a response locally.
6. The response is returned to the browser.

## Privacy

Model inference runs locally through Ollama. The application does
not intentionally send chat messages to an external AI API.

However, the application has not been independently audited for
security or privacy. Review the code and dependencies before using
it with sensitive information.

## Future Improvements

- Markdown-formatted AI responses
- Streaming responses
- Persistent conversation history
- User authentication
- Database integration
- Conversation export
- Unit and integration tests

## License

MIT License

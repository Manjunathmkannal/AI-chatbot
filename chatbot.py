import requests
from typing import Dict, List

OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL_NAME = "llama3"


class Chatbot:
    def __init__(self):
        self.conversations: Dict[str, List[dict]] = {}

        self.system_prompt = """
        You are Nova, a friendly and intelligent AI assistant.

        Your responsibilities:
        1. Answer questions clearly and accurately.
        2. Explain programming concepts in simple language.
        3. Help users learn Python, AI, machine learning, and technology.
        4. Provide code examples when useful.
        5. Remember the context of the current conversation.
        6. Admit when you are uncertain about something.
        7. Be polite, supportive, and professional.
        8. Use readable formatting in your responses.
        """

    def get_response(self, session_id: str, user_message: str) -> str:
        if session_id not in self.conversations:
            self.conversations[session_id] = []

        history = self.conversations[session_id]

        history.append({
            "role": "user",
            "content": user_message
        })

        messages = [
            {
                "role": "system",
                "content": self.system_prompt
            }
        ] + history

        payload = {
            "model": MODEL_NAME,
            "messages": messages,
            "stream": False
        }

        try:
            response = requests.post(
                OLLAMA_URL,
                json=payload,
                timeout=180
            )

            response.raise_for_status()

            data = response.json()

            bot_reply = data["message"]["content"]

            history.append({
                "role": "assistant",
                "content": bot_reply
            })

            # Keep recent conversation history manageable.
            self.conversations[session_id] = history[-20:]

            return bot_reply

        except requests.exceptions.ConnectionError:
            history.pop()

            return (
                "I couldn't connect to Ollama. "
                "Please make sure Ollama is running on your computer."
            )

        except requests.exceptions.Timeout:
            history.pop()

            return (
                "The AI model took too long to respond. "
                "Please try again."
            )

        except requests.exceptions.RequestException:
            history.pop()

            return (
                "I encountered a connection error. "
                "Please check your Ollama installation."
            )

        except (KeyError, ValueError):
            history.pop()

            return (
                "I received an unexpected response from the AI model. "
                "Please try again."
            )

    def clear_conversation(self, session_id: str) -> None:
        self.conversations.pop(session_id, None)
import uuid

from flask import Flask, render_template, request, jsonify, session
from chatbot import Chatbot

app = Flask(__name__)

# Change this to a random secret stored in an environment variable
# before deploying the application.
app.secret_key = "change-this-to-a-random-secret-key"

chatbot = Chatbot()


@app.route("/")
def home():
    if "chat_id" not in session:
        session["chat_id"] = str(uuid.uuid4())

    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}

    user_message = data.get("message", "")

    if not isinstance(user_message, str):
        return jsonify({
            "error": "Message must be text."
        }), 400

    user_message = user_message.strip()

    if not user_message:
        return jsonify({
            "error": "Please enter a message."
        }), 400

    if len(user_message) > 4000:
        return jsonify({
            "error": "Your message is too long. Please use fewer than 4000 characters."
        }), 400

    if "chat_id" not in session:
        session["chat_id"] = str(uuid.uuid4())

    session_id = session["chat_id"]

    bot_reply = chatbot.get_response(
        session_id,
        user_message
    )

    return jsonify({
        "reply": bot_reply
    })


@app.route("/clear", methods=["POST"])
def clear_chat():
    session_id = session.get("chat_id")

    if session_id:
        chatbot.clear_conversation(session_id)

    session["chat_id"] = str(uuid.uuid4())

    return jsonify({
        "message": "Conversation cleared successfully."
    })


@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "error": "The requested page was not found."
    }), 404


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=False
    )
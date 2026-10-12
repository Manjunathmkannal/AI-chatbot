const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message-input");
const messagesContainer = document.getElementById("messages");
const welcomeScreen = document.getElementById("welcome-screen");
const typingIndicator = document.getElementById("typing-indicator");
const sendButton = document.getElementById("send-btn");
const newChatButton = document.getElementById("new-chat-btn");

let isSending = false;


// Automatically resize the input box.
messageInput.addEventListener("input", () => {
    messageInput.style.height = "auto";

    messageInput.style.height =
        Math.min(messageInput.scrollHeight, 150) + "px";
});


// Add a message to the chat window.
function addMessage(text, sender) {
    const row = document.createElement("div");

    row.className = `message-row ${sender}`;

    const avatar = document.createElement("div");
    avatar.className =
        `avatar ${sender === "user" ? "user-avatar" : "bot-avatar"}`;

    avatar.textContent = sender === "user" ? "Y" : "N";

    const content = document.createElement("div");
    content.className = "message-content";

    const name = document.createElement("span");
    name.className = "message-name";
    name.textContent = sender === "user" ? "You" : "Nova";

    const bubble = document.createElement("div");
    bubble.className = "message-bubble";

    // Display plain text safely.
    bubble.textContent = text;

    content.appendChild(name);
    content.appendChild(bubble);

    if (sender === "user") {
        row.appendChild(content);
        row.appendChild(avatar);
    } else {
        row.appendChild(avatar);
        row.appendChild(content);
    }

    messagesContainer.appendChild(row);

    scrollToBottom();
}


// Keep the latest messages visible.
function scrollToBottom() {
    const chatContainer = document.getElementById("chat-container");

    chatContainer.scrollTop = chatContainer.scrollHeight;
}


// Display or hide the typing indicator.
function showTyping(show) {
    typingIndicator.classList.toggle("hidden", !show);

    if (show) {
        scrollToBottom();
    }
}


// Send a message to the Flask backend.
async function sendMessage(message) {
    if (isSending || !message.trim()) {
        return;
    }

    isSending = true;
    sendButton.disabled = true;

    welcomeScreen.classList.add("hidden");

    addMessage(message, "user");

    showTyping(true);

    try {
        const response = await fetch("/chat", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "The server could not process your message."
            );
        }

        addMessage(data.reply, "bot");

    } catch (error) {
        addMessage(
            "Sorry, I couldn't process your message. " +
            error.message +
            " Please check whether Flask and Ollama are running.",
            "bot"
        );

    } finally {
        showTyping(false);

        isSending = false;
        sendButton.disabled = false;

        messageInput.focus();
    }
}


// Handle form submission.
chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = messageInput.value.trim();

    if (!message || isSending) {
        return;
    }

    messageInput.value = "";
    messageInput.style.height = "auto";

    await sendMessage(message);
});


// Enter sends a message; Shift + Enter inserts a new line.
messageInput.addEventListener("keydown", (event) => {
    if (
        event.key === "Enter" &&
        !event.shiftKey &&
        !event.isComposing
    ) {
        event.preventDefault();

        chatForm.requestSubmit();
    }
});


// Handle the suggested prompts on the welcome screen.
document.querySelectorAll(".suggestion-card").forEach((button) => {
    button.addEventListener("click", () => {
        const prompt = button.dataset.prompt;

        if (!isSending) {
            sendMessage(prompt);
        }
    });
});


// Start a fresh conversation.
newChatButton.addEventListener("click", async () => {
    if (isSending) {
        return;
    }

    try {
        const response = await fetch("/clear", {
            method: "POST"
        });

        if (!response.ok) {
            throw new Error("Could not clear the conversation.");
        }

        messagesContainer.replaceChildren();

        welcomeScreen.classList.remove("hidden");

        messageInput.value = "";
        messageInput.style.height = "auto";

        messageInput.focus();

    } catch (error) {
        alert(
            "Unable to start a new conversation. " +
            "Please refresh the page and try again."
        );
    }
});
import { useState } from "react";
import api from "../services/api";

function AIAssistant() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim() || loading) {
      return;
    }

    const userMessage = message.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/ai/ask", null, {
        params: {
          message: userMessage,
        },
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.data.response,
        },
      ]);
    } catch (error) {
      console.error("AI ERROR:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error.response?.data?.detail ||
            "Sorry, I could not process your request.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const useSuggestion = (text) => {
    setMessage(text);
  };

  return (
    <div className="ai-page">

      <div className="ai-header">
        <h1>AI School Assistant</h1>
        <p>Your intelligent school companion</p>
      </div>

      <div className="chat-container">

        <div className="chat-messages">

          {messages.length === 0 && (
            <div className="empty-chat">

              <div className="empty-icon">
                ✨
              </div>

              <h2>
                How can I help you?
              </h2>

              <p>
                Ask me about attendance,
                academics, or school information.
              </p>

              <div className="suggestions">

                <button
                  onClick={() =>
                    useSuggestion(
                      "What is my attendance?"
                    )
                  }
                >
                  📊 My attendance
                </button>

                <button
                  onClick={() =>
                    useSuggestion(
                      "How can I improve my attendance?"
                    )
                  }
                >
                  📈 Improve attendance
                </button>

                <button
                  onClick={() =>
                    useSuggestion(
                      "Give me some study tips."
                    )
                  }
                >
                  📚 Study tips
                </button>

              </div>

            </div>
          )}

          {messages.map((item, index) => (
            <div
              key={index}
              className={`message ${
                item.role === "user"
                  ? "user-message"
                  : "assistant-message"
              }`}
            >

              <div className="message-label">
                {item.role === "user"
                  ? "You"
                  : "XYZ AI"}
              </div>

              <div className="message-content">
                {item.content}
              </div>

            </div>
          ))}

          {loading && (
            <div className="message assistant-message">

              <div className="message-label">
                XYZ AI
              </div>

              <div className="message-content">
                Thinking...
              </div>

            </div>
          )}

        </div>

        <form
          className="chat-input"
          onSubmit={sendMessage}
        >

          <input
            type="text"
            placeholder="Ask XYZ AI something..."
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
          />

          <button
            type="submit"
            disabled={
              loading || !message.trim()
            }
          >
            {loading ? "..." : "Send"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default AIAssistant;
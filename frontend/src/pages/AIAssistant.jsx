import { useState, useEffect, useRef } from "react";
import api from "../services/api";

function AIAssistant() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");
  const shouldSendRef = useRef(false);

  // =====================================================
  // SETUP SPEECH RECOGNITION
  // =====================================================

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    console.log("SpeechRecognition:", SpeechRecognition);

    if (!SpeechRecognition) {
      console.error(
        "Speech Recognition NOT supported in this browser."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log("MICROPHONE STARTED");

      setListening(true);

      transcriptRef.current = "";
      shouldSendRef.current = false;
    };

    recognition.onresult = (event) => {
      console.log("SPEECH RESULT RECEIVED");

      let text = "";

      for (
        let i = 0;
        i < event.results.length;
        i++
      ) {
        text +=
          event.results[i][0].transcript + " ";
      }

      text = text.trim();

      console.log("RECOGNIZED:", text);

      if (text) {
        transcriptRef.current = text;
        setMessage(text);
      }
    };

    recognition.onerror = (event) => {
      console.error(
        "SPEECH ERROR:",
        event.error
      );

      setListening(false);

      if (event.error === "not-allowed") {
        alert(
          "Microphone permission denied. Please allow microphone access for localhost."
        );
      }

      if (event.error === "audio-capture") {
        alert(
          "No microphone was detected. Check your microphone."
        );
      }

      if (event.error === "network") {
        alert(
          "Speech recognition network error. Check your internet connection."
        );
      }
    };

    recognition.onend = () => {
      console.log(
        "SPEECH RECOGNITION ENDED"
      );

      setListening(false);

      if (shouldSendRef.current) {
        const spokenText =
          transcriptRef.current.trim();

        console.log(
          "FINAL VOICE TEXT:",
          spokenText
        );

        shouldSendRef.current = false;

        if (spokenText) {
          setMessage("");
          sendToAI(spokenText);
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.abort();
      } catch (error) {
        console.log(error);
      }
    };
  }, []);

  // =====================================================
  // MICROPHONE
  // =====================================================

  const toggleVoice = () => {
    const recognition =
      recognitionRef.current;

    if (!recognition) {
      alert(
        "Speech recognition is not supported. Please use Google Chrome."
      );
      return;
    }

    if (loading) {
      return;
    }

    if (listening) {
      console.log("STOP MICROPHONE");

      shouldSendRef.current = true;

      try {
        recognition.stop();
      } catch (error) {
        console.error(error);
      }

      return;
    }

    console.log("START MICROPHONE");

    transcriptRef.current = "";
    shouldSendRef.current = false;

    setMessage("");

    try {
      recognition.start();
    } catch (error) {
      console.error(
        "START ERROR:",
        error
      );
    }
  };

  // =====================================================
  // AI VOICE RESPONSE
  // =====================================================

  const speakResponse = (text) => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(text);

    speech.lang = "en-IN";
    speech.rate = 0.95;
    speech.pitch = 1;

    speech.onstart = () => {
      setSpeaking(true);
    };

    speech.onend = () => {
      setSpeaking(false);
    };

    speech.onerror = () => {
      setSpeaking(false);
    };

    window.speechSynthesis.speak(speech);
  };

  // =====================================================
  // TEXT MESSAGE
  // =====================================================

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim() || loading) {
      return;
    }

    const text = message.trim();

    setMessage("");

    await sendToAI(text);
  };

  // =====================================================
  // AI REQUEST
  // =====================================================

  const sendToAI = async (text) => {
    if (!text.trim()) {
      return;
    }

    console.log(
      "SENDING TO AI:",
      text
    );

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: text,
      },
    ]);

    setLoading(true);

    try {
      const response = await api.post(
        "/ai/ask",
        null,
        {
          params: {
            message: text,
          },
        }
      );

      console.log(
        "AI RESPONSE:",
        response.data
      );

      const answer =
        response.data?.response ||
        "I could not generate a response.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: answer,
        },
      ]);

      speakResponse(answer);

    } catch (error) {
      console.error(
        "AI ERROR:",
        error
      );

      const detail =
        error.response?.data?.detail;

      const errorMessage =
        typeof detail === "string"
          ? detail
          : "Sorry, I could not process your request.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorMessage,
        },
      ]);

      speakResponse(errorMessage);

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SUGGESTIONS
  // =====================================================

  const useSuggestion = (text) => {
    setMessage(text);
  };

  // =====================================================
  // AVATAR STATE
  // =====================================================

  const avatarActive =
    loading || speaking;

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="ai-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="ai-header">

        <div className="ai-title">

          {/* AI AVATAR */}

          <div
            className={`ai-avatar ${
              avatarActive
                ? "avatar-active"
                : ""
            } ${
              speaking
                ? "avatar-speaking"
                : ""
            }`}
          >

            <div className="avatar-face">

              <div className="avatar-eyes">

                <span></span>
                <span></span>

              </div>

              <div className="avatar-mouth">
                {speaking ? "◡" : "•"}
              </div>

            </div>

          </div>

          <div>

            <h1>XYZ AI</h1>

            <p>
              Your intelligent school companion
            </p>

          </div>

        </div>

      </div>


      {/* =================================================
          CHAT
      ================================================= */}

      <div className="chat-container">

        <div className="chat-messages">

          {/* EMPTY CHAT */}

          {messages.length === 0 && (
            <div className="empty-chat">

              {/* LARGE AI AVATAR */}

              <div
                className={`ai-avatar-large ${
                  avatarActive
                    ? "avatar-active"
                    : ""
                } ${
                  speaking
                    ? "avatar-speaking"
                    : ""
                }`}
              >

                <div className="avatar-face">

                  <div className="avatar-eyes">

                    <span></span>
                    <span></span>

                  </div>

                  <div className="avatar-mouth">
                    {speaking ? "◡" : "•"}
                  </div>

                </div>

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


          {/* MESSAGES */}

          {messages.map(
            (item, index) => (
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
            )
          )}


          {/* THINKING */}

          {loading && (
            <div className="message assistant-message">

              <div className="message-label">
                XYZ AI
              </div>

              <div className="message-content">

                <div className="thinking-avatar">

                  <div className="mini-avatar">

                    <div className="mini-eyes">
                      <span></span>
                      <span></span>
                    </div>

                    <div className="mini-mouth">
                      •
                    </div>

                  </div>

                  <span>
                    XYZ AI is thinking...
                  </span>

                </div>

              </div>

            </div>
          )}

        </div>


        {/* =================================================
            INPUT
        ================================================= */}

        <form
          className="chat-input"
          onSubmit={sendMessage}
        >

          <input
            type="text"
            placeholder={
              listening
                ? "🎤 Listening... speak now"
                : "Ask XYZ AI something..."
            }
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            disabled={loading}
          />


          {/* MICROPHONE */}

          <button
            type="button"
            className={`voice-button ${
              listening
                ? "voice-active"
                : ""
            }`}
            onClick={toggleVoice}
            disabled={loading}
            title={
              listening
                ? "Stop listening"
                : "Speak to XYZ AI"
            }
          >

            {listening
              ? "🔴"
              : "🎤"}

          </button>


          {/* SEND */}

          <button
            type="submit"
            disabled={
              loading ||
              !message.trim()
            }
          >

            {loading
              ? "..."
              : "Send"}

          </button>

        </form>


        <div className="ai-disclaimer">

          XYZ AI can make mistakes. Please
          verify important information.

        </div>

      </div>

    </div>
  );
}

export default AIAssistant;
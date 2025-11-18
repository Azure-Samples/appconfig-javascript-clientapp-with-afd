// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useState, useRef, useEffect, useContext } from "react";
import appConfigIcon from "../assets/azure-app-configuration-icon.svg";
import type { ChatMessage, ChatRequest, ChatResponse } from "../types";
import { AppContext } from "./appContext";
import { trackEvent } from "@microsoft/feature-management-applicationinsights-browser";

function Home() {
  const [messageHistory, setMessageHistory] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [likedMessages, setLikedMessages] = useState<Set<number>>(new Set());
  const [modelName, setModel] = useState<string>("gpt-4o");
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const ctx = useContext(AppContext);
  const { appInsights, featureManager, currentUser } = ctx || {};

  useEffect(() => {
    const getModel = async () => {
      if (featureManager && currentUser) {
        try {
          const variant = await featureManager.getVariant("OpenAI/newmodel", { userId: currentUser });
          if (variant?.name) {
            setModel(variant.configuration as string);
          }
        } catch (error) {
          console.error("Error fetching variant:", error);
        }
      }
    };
    getModel();
  }, [featureManager, currentUser]);

  // Clear message history when user logs in or out
  useEffect(() => {
    setMessageHistory([]);
    setInputMessage("");
    setLikedMessages(new Set());
  }, [currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messageHistory, isWaitingForResponse]);

  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const message = inputMessage.trim();
    if (!message || isWaitingForResponse) return;

    // Clear input
    setInputMessage("");
    setIsWaitingForResponse(true);

    // Add user message to history
    const newUserMessage: ChatMessage = {
      role: "user",
      content: message,
      timestamp: new Date()
    };

    setMessageHistory((prev) => [...prev, newUserMessage]);

    try {
      const request: ChatRequest = {
        message,
        history: messageHistory,
        model: modelName
      };

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();

      // Update message history with the complete history from response
      const historyWithTimestamps = data.history.map(msg => ({
        ...msg,
        timestamp: new Date(),
        // Ensure assistant messages carry the model name so we can display it
        model: msg.role === "assistant" ? modelName : msg.model
      }));
      setMessageHistory(historyWithTimestamps);

    } catch (error) {
      console.error("Error sending message:", error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again later.",
        timestamp: new Date(),
        model: modelName
      };
      setMessageHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsWaitingForResponse(false);
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleLike = (index: number) => {
    setLikedMessages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
        // Track like event to App Insights
        if (appInsights && currentUser) {
          trackEvent(appInsights, currentUser, { name: "Like" });
        }
      }
      return newSet;
    });
  };

  return (
    <div className="chat-page">
      <main className="chat-main">
        <div className="chat-header">
          <div className="chat-header-title">Azure App Configuration AI Chat</div>
          <div className="chat-header-model">
            <span className="chat-header-model-label">Current model</span>
            <span className="chat-header-model-badge">{modelName}</span>
          </div>
        </div>
        <div ref={chatMessagesRef} className="chat-messages-container">
          {messageHistory.length === 0 ? (
            <div className="chat-welcome">
              <img src={appConfigIcon} alt="Azure App Configuration Logo" className="chat-welcome-icon" />
              <h2 className="chat-welcome-title">Welcome to Azure App Configuration AI Chat</h2>
              <p className="chat-welcome-description">
                I'm your AI assistant powered by Azure App Configuration. Ask me anything and I'll do my best to help you.
              </p>
            </div>
          ) : (
            <>
              {messageHistory.map((msg, index) => (
                <div key={index} className={`chat-message ${msg.role}`}>
                  <div className="chat-message-bubble">
                    {msg.content}
                  </div>
                  <div className="chat-message-footer">
                    <span className="chat-message-timestamp">
                      {formatTime(msg.timestamp)}
                    </span>
                    {msg.role === "assistant" && (
                      <button
                        className={`chat-like-button ${likedMessages.has(index) ? "liked" : ""}`}
                        onClick={() => handleLike(index)}
                        title={likedMessages.has(index) ? "Unlike" : "Like"}
                      >
                        {likedMessages.has(index) ? "❤️" : "🤍"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {isWaitingForResponse && (
                <div className="chat-typing-indicator">
                  <div className="chat-typing-bubble">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="chat-input-area">
          <form onSubmit={handleSendMessage} className="chat-input-form">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={isWaitingForResponse}
              autoComplete="off"
              className="chat-input"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isWaitingForResponse}
              className="chat-send-button"
            >
              Send
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Home;

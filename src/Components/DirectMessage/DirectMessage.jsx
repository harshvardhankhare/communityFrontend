import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  FaSearch,
  FaPaperclip,
  FaSmile,
  FaTimes,
  FaEllipsisV,
  FaCheckDouble,
} from "react-icons/fa";
import "./DirectMessage.css";

export default function DirectMessage() {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    fetchConversations();
    getCurrentUser();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/auth/getconvo", { withCredentials: true });
      
      setConversations(res.data);
    } catch (err) {
      console.error("Failed loading conversations:", err);
    }
  };
   const getCurrentUser = async () => {
  try {
    const res = await axios.get("http://localhost:5000/auth/me", { withCredentials: true });
    setCurrentUserId(res.data._id)
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};

  const startOrSelectConversation = (conv) => {
    // Initiate or select existing
    if (conv._id) {
      selectConversation(conv._id);
    } else {
      axios
        .post("http://localhost:5000/auth/start", { receiverId: conv.userId }, { withCredentials: true })
        .then((r) => selectConversation(r.data._id))
        .catch(console.error);
    }
  };

  const selectConversation = async (id) => {
    setActiveConversationId(id);
    // Mark unread count reset
    try {
      const res = await axios.get(`http://localhost:5000/auth/${id}/messages`, {
        withCredentials: true,
      });
      setConversations((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, messages: res.data, unreadCount: 0 } : c
        )
      );
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversationId, conversations]);

  const sendMessage = () => {
    if (!messageInput.trim() || !activeConversationId) return;
    axios
      .post(
        `http://localhost:5000/auth/${activeConversationId}/message`,
        { text: messageInput },
        { withCredentials: true }
      )
      .then((res) => {
        setConversations((prev) =>
          prev.map((c) =>
            c._id === activeConversationId
              ? { ...c, messages: [...c.messages, res.data] }
              : c
          )
        );
        setMessageInput("");
      })
      .catch(console.error);
  };

  const activeConversation = conversations.find((c) => c._id === activeConversationId);

  const filteredConvs = conversations.filter((c) =>
    c.participants.some((p) =>
      p.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="dms-page">
      <div
        className={`conversations-list ${
          isMobile && activeConversationId ? "mobile-hidden" : ""
        }`}
      >
        <div className="conversations-header">
          <h2>Messages</h2>
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="conversations">
          {filteredConvs.map((conv) => {
            const other = conv.participants.find((p) => !p._id.endsWith(conv._id)); // assumes two participants
            return (
              <div
                key={conv._id}
                className={`conversation ${
                  conv._id === activeConversationId ? "active" : ""
                }`}
                onClick={() => selectConversation(conv._id)}
              >
                <div className={`avatar ${other.online ? "online" : "offline"}`}>
                  {other.username.charAt(0).toUpperCase()}
                </div>
                <div className="conversation-details">
                  <div className="conversation-header">
                    <h3>{other.username}</h3>
                    <span className="time">{conv.updatedAt && new Date(conv.updatedAt).toLocaleTimeString()}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <p className="last-message">{conv.lastMessage}</p>
                    {conv.unreadCount > 0 && (
                      <div className="unread-badge">{conv.unreadCount}</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className={`chat-area ${
          isMobile && !activeConversationId ? "mobile-hidden" : ""
        }`}
      >
        {isMobile && (
          <div className="mobile-chat-header">
            <button onClick={() => setActiveConversationId(null)} className="more-button" aria-label="Back">
              <FaTimes />
            </button>
            <div className="chat-partner">
              <div className={`avatar ${activeConversation?.participants?.[1]?.online ? "online" : "offline"}`}>
                {activeConversation?.participants?.[1]?.username?.charAt(0).toUpperCase()}
              </div>
              <h3>{activeConversation?.participants?.[1]?.username || "Select a conversation"}</h3>
            </div>
          </div>
        )}
        {!isMobile && activeConversation && (
          <div className="chat-header">
            <div className="chat-partner">
              <div className={`avatar ${activeConversation.participants[1].online ? "online" : "offline"}`}>
                {activeConversation.participants[1].username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3>{activeConversation.participants[0].username}</h3>
                <p>{activeConversation.participants[0].online ? "Online" : "Offline"}</p>
              </div>
            </div>
            <button className="more-button" aria-label="More options">
              <FaEllipsisV />
            </button>
          </div>
        )}

        <div className="messages">
          {activeConversation ? (
            activeConversation.messages.map((msg) => {
              const isSentByUser = msg.sender._id === currentUserId;
              return (
                <div key={msg._id || msg.id} className={`message ${isSentByUser ? "sent" : "received"}`}>
                  <div className="message-content">{msg.text}</div>
                  <div className="message-meta">
                    <span className="time">{msg.time}</span>
                    {isSentByUser && <FaCheckDouble className={`read-icon ${msg.read ? "read" : ""}`} />}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-chat">
              <FaSmile className="empty-icon" size={48} />
              <h3>No conversation selected</h3>
              <p>Select a conversation to start chatting</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {activeConversation && (
          <div className="message-input">
            <button className="attachment-button" aria-label="Attach file">
              <FaPaperclip />
            </button>
            <input
              type="text"
              placeholder="Type a message"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <button className="emoji-button" aria-label="Add emoji" onClick={() => alert("Emoji picker not implemented")}>
              <FaSmile />
            </button>
            <button className="send-button" onClick={sendMessage} disabled={!messageInput.trim()} aria-label="Send message">
              ➤
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

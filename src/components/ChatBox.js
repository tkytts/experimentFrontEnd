import { useState, useEffect, useRef } from "react";
import socket from "../socket";
import { useChimesConfig } from "../context/ChimesConfigContext";
import { useTranslation } from "react-i18next";

function ChatBox({ currentUser, isAdmin, messageRef, chatRef, confederateNameRef, activityRef, sendButtonRef }) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const [confederateName, setConfederateName] = useState(t('player_name'));
  const { chimesConfig } = useChimesConfig();
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    const updateMousePosition = (e) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", updateMousePosition);

    socket.on("chat message", (msg) => {
      setTypingUser("");
      typingTimeoutRef.current = null;
      setMessages((prevMessages) => [...prevMessages, msg]);
      let messageFromOtherUser = isAdmin ? msg.user !== confederateName : msg.user !== currentUser;

      if (messageFromOtherUser && chimesConfig?.messageReceived) {
        try {
          new Audio("/sounds/message-received.mp3").play(); // Play sound when a message is received
        } catch (error) {
          console.error("Failed to play audio:", error); // Optionally log the error
        }
      }
    });

    socket.on("user typing", (username) => {
      setTypingUser(username);
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setTypingUser(""), 1000);
    });

    socket.on("new confederate", (confederateName) => {
      setConfederateName(confederateName);
    });

    socket.on("chat cleared", () => {
      setMessages([]);
    });

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      socket.off("chat message");
      socket.off("user typing");
      socket.off("new confederate");
      socket.off("chat cleared");
      socket.off("chimes updated");
    };
  }, [currentUser, chimesConfig, confederateName]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Trigger scrolling when `messages` updates

  useEffect(() => {
    socket.emit("get chimes");
  }, []);

  const handleSend = () => {
    if (newMessage.trim() === "") return;

    const messageObj = {
      user: isAdmin ? confederateName : currentUser,
      text: newMessage,
      timeStamp: new Date().toISOString(),
    };
    socket.emit("chat message", messageObj);
    if (!isAdmin) {
      if (typingUser !== "") {
        socket.emit("telemetry event", {
          user: currentUser,
          confederate: confederateName,
          action: "INTERRUPT",
          text: newMessage,
          timestamp: new Date().toISOString(),
          x: mousePositionRef.current.x,
          y: mousePositionRef.current.y,
        });
      }
      socket.emit("telemetry event", {
        user: currentUser,
        confederate: confederateName,
        action: "message sent",
        text: newMessage,
        timestamp: new Date().toISOString(),
        x: mousePositionRef.current.x,
        y: mousePositionRef.current.y,
      });
    }

    setNewMessage("");

    if (chimesConfig?.messageSent)
      try {
        new Audio("/sounds/message-sent.mp3").play(); // Play sound when a message is sent
      } catch (error) {
        console.error("Failed to play audio:", error); // Optionally log the error
      }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleClearChat = () => {
    socket.emit("clear chat");
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    socket.emit("typing", isAdmin ? confederateName : currentUser);
    if (!isAdmin)
      socket.emit("telemetry event", {
        user: currentUser,
        confederate: confederateName,
        action: "edit",
        text: e.target.value,
        timestamp: new Date().toISOString(),
        x: mousePositionRef.current.x,
        y: mousePositionRef.current.y,
      });
  };

  return (
    <div className="col-md-6">
      <div className="card">
        <div className="card-header">
          <h3 className="h5 mb-0">{t('messages')}</h3>
        </div>
        <div className="card-body custom-scroll"
          style={{
            maxHeight: '500px', // Adjust height as needed
            overflowY: 'auto',
            overflowX: 'hidden',
            paddingRight: '10px',
          }}
          ref={chatRef}>
          {confederateName && <p className="info-box" ref={confederateNameRef}>{isAdmin ? currentUser : confederateName}</p>}
          <div className="mb-3">
            {messages.map((msg, index) => (
              <div key={index} className="mb-2">
                <strong>{msg.user}:</strong> {msg.text}
              </div>
            ))}
          </div>
          <div>
            <strong ref={activityRef}>{t('activity')}:</strong>{' '}
            {typingUser && (
              <nobr className="text-muted">{typingUser} {t('is_typing')}...</nobr>
            )}
            <br></br>
            <p className="info-box">{isAdmin ? confederateName : currentUser}</p>
          </div>
          <div ref={messagesEndRef} />
        </div>
        <div className="card-footer">
          <div className="input-group">
            <input
              type="text"
              className="form-control me-2"
              placeholder={t('message_placeholder')}
              value={newMessage}
              onChange={(e) => handleTyping(e)}
              onKeyUp={handleKeyPress}
              ref={messageRef}
            />
            <button
              className="btn btn-primary"
              onClick={handleSend}
              ref={sendButtonRef}>
              {t('send_message')}
            </button>
            {isAdmin && (
              <button
                className="btn btn-warning ms-2"
                onClick={handleClearChat}
              >
                {t('clear_chat')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

// Connect to the WebSocket server
const socket = io("http://localhost:5000"); // Replace with your server address

function Tutorial() {
  const [currentUser, setCurrentUser] = useState("");
  const currentUserRef = useRef("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [usernameSet, setUsernameSet] = useState(false);
  const maxTime = 90;
  const [countdown, setCountdown] = useState(maxTime);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [currentBlock, setCurrentBlock] = useState(null);
  const [typingUser, setTypingUser] = useState("");
  const typingTimeoutRef = useRef(null);
  const countdownAudioRef = useRef(new Audio("/sounds/countdown.mp3")); // Reference to the countdown audio file
  const mousePositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  useEffect(() => {
    const updateMousePosition = (e) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  useEffect(() => {
    socket.on("chat message", (msg) => {
      setTypingUser("");
      typingTimeoutRef.current = null;
      setMessages((prevMessages) => [...prevMessages, msg]);

      if (msg.user !== currentUserRef.current) {
        new Audio("/sounds/message-received.mp3").play(); // Play sound when a message is received
      }
    });

    socket.on("chat history", (chatHistory) => {
      setMessages(chatHistory);
    });

    socket.on("timer update", (newCountdown) => {
      setCountdown(newCountdown);
    });

    socket.on("chat cleared", () => {
      setMessages([]); // Clear the local messages
    });

    socket.on("problem update", ({ block, problem }) => {
      setCurrentBlock(block);
      setCurrentProblem(problem);
    });

    return () => {
      socket.off("chat message");
      socket.off("chat history");
      socket.off("timer update");
      socket.off("chat cleared");
      socket.off("problem update");
    };
  }, []);

  useEffect(() => {
    if (usernameSet) {
      socket.emit("get problem");
    }
  }, [usernameSet]);

  useEffect(() => {
    if (countdown <= 10 && countdown > 0) {
      countdownAudioRef.current.play();
    } else {
      countdownAudioRef.current.pause();
      countdownAudioRef.current.currentTime = 0; // Reset audio playback
    }

    if (countdown === 0) {
      countdownAudioRef.current.pause();
      countdownAudioRef.current.currentTime = 0;
    }
  }, [countdown]);

  const handleSend = () => {
    if (newMessage.trim() === "") return;

    const messageObj = {
      user: currentUser,
      text: newMessage,
      timeStamp: new Date().toISOString(),
    };
    socket.emit("chat message", messageObj);
    setNewMessage("");
    new Audio("/sounds/message-sent.mp3").play(); // Play sound when a message is sent
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    socket.emit("typing", currentUser);
    socket.emit("telemetry event", {
      user: currentUser,
      action: "edit",
      text: e.target.value,
      timestamp: new Date().toISOString(),
      x: mousePositionRef.current.x,
      y: mousePositionRef.current.y,
    });
  };

  const handleSetUsername = (e) => {
    e.preventDefault();
    if (currentUser.trim() !== "") {
      setUsernameSet(true);
    }
  };

  useEffect(() => {
    socket.on("user typing", (username) => {
      setTypingUser(username);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        setTypingUser("");
        typingTimeoutRef.current = null;
      }, 1000);
    });

    // Cleanup on component unmount
    return () => {
      socket.off("user typing");
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Chat Online de Solução de Problemas</h1>

      {!usernameSet && (
        <div className="mb-4">
          <form onSubmit={handleSetUsername} className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Insira seu nome"
              value={currentUser}
              onChange={(e) => setCurrentUser(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Definir Nome
            </button>
          </form>
        </div>
      )}

      {usernameSet && (
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h3 className="h5 mb-0">Mensagens</h3>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  {messages.map((msg, index) => (
                    <div key={index} className="mb-2">
                      <strong>{msg.user}:</strong> {msg.text}
                    </div>
                  ))}
                  {typingUser && (
                    <p className="text-muted">{typingUser} está digitando...</p>
                  )}
                  {!typingUser && <br></br>}
                </div>
              </div>
              <div className="card-footer">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Message"
                    value={newMessage}
                    onChange={(e) => handleInputChange(e)}
                    onKeyUp={handleKeyPress}
                  />
                  <button className="btn btn-primary" onClick={handleSend}>
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <p className="mb-3">Encontre a solução para o problema:</p>
                <div className="fs-2 mb-3">
                  {currentBlock && currentProblem ? (
                    <img
                      src={`/problems/${currentBlock.blockName}/${currentProblem}.png`}
                      alt="Problema"
                    />
                  ) : (
                    "Carregando problema..."
                  )}
                </div>
                <p className={`mb-1 ${countdown === 0 ? "text-danger" : ""}`}>
                  {countdown > 0
                    ? `Restam ${countdown} segundos`
                    : "O tempo acabou"}
                </p>
                <p className="mb-1">Points: 0</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tutorial;

import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import ChatBox from "./ChatBox";
import GameBox from "./GameBox";

// Connect to the WebSocket server
const socket = io("http://localhost:5000"); // Replace with your server address

function Tutorial() {
  const [currentUser, setCurrentUser] = useState("");
  const currentUserRef = useRef("");
  const [usernameSet, setUsernameSet] = useState(false);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  const handleSetUsername = (e) => {
    e.preventDefault();
    if (currentUser.trim() !== "") {
      setUsernameSet(true);
    }
  };

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
          <ChatBox currentUser={currentUser} isAdmin={false} />
          <GameBox isAdmin={false} />
        </div>
      )}
    </div>
  );
}

export default Tutorial;

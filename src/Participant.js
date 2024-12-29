import React, { useState, useEffect, useRef } from "react";
import ChatBox from "./ChatBox";
import GameBox from "./GameBox";
import io from "socket.io-client";

const socket = io("http://192.168.196.93:5000"); // Replace with your server address

function Participant() {
  const [currentUser, setCurrentUser] = useState("");
  const currentUserRef = useRef("");
  const [usernameSet, setUsernameSet] = useState(false);
  const [confederateName, setConfederateName] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  socket.on("new confederate", (confederateName) => {
    setConfederateName(confederateName);
  });

  const handleSetUsername = (e) => {
    e.preventDefault();
    if (currentUser.trim() !== "") {
      setUsernameSet(true);
    }
  };

  const handleReady = () => {
    setReady(true);  
    socket.emit("get chimes");
    socket.emit("start timer");
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

      {usernameSet && !confederateName && (
        <div className="modal" style={modalStyle}>
          <div className="modal-content" style={modalContentStyle}>
            <p>Esperando o outro jogador ficar pronto.</p>
          </div>
        </div>
      )}

      {usernameSet && confederateName && !ready && (
        <div className="modal" style={modalStyle}>
          <div className="modal-content" style={modalContentStyle}>
            <p>{`You are playing with ${confederateName}.`}</p>
            <button className="btn btn-primary" onClick={handleReady}>
              Pronto!
            </button>
          </div>
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

// Inline styles for the modal
const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "10px",
  textAlign: "center",
};

export default Participant;

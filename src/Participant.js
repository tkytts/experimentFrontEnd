import React, { useState, useEffect, useRef } from "react";
import ChatBox from "./ChatBox";
import GameBox from "./GameBox";
import io from "socket.io-client";
import config from "./config";

const socket = io(config.serverUrl);

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
    setReady(false);
  });

  const handleSetUsername = (e) => {
    e.preventDefault();
    if (currentUser.trim() !== "") {
      setUsernameSet(true);
      socket.emit("set participantName", currentUser);
    }
  };

  const handleReady = () => {
    setReady(true);
    socket.emit("get chimes");
    socket.emit("start timer");
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Bate-Papo Online de Resolução de Problemas</h1>

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
            <p>Aguardando o(a) outro(a) jogador(a) ficar pronto(a).</p>
          </div>
        </div>
      )}

      {usernameSet && confederateName && !ready && (
        <div className="modal" style={modalStyle}>
          <div className="modal-content" style={modalContentStyle}>
          <p>Você está jogando com</p>
          <p className="h2"><b>{confederateName}</b></p>
          <p>Clique em “PRONTO(A)!” quando estiver pronto(a) para iniciar o jogo.”</p>
            <button className="btn btn-primary btn-narrow" onClick={handleReady}>
              Pronto(a)!
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

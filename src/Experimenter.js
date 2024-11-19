import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import ChatBox from "./ChatBox";
import GameBox from "./GameBox";

// Connect to the WebSocket server
const socket = io("http://localhost:5000"); // Replace with your server address

function Experimenter() {
  const [currentUser, setCurrentUser] = useState("");
  const currentUserRef = useRef(""); // Track the currentUser reliably
  const [showModal, setShowModal] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState(0);
  const [maxTimeInput, setMaxTimeInput] = useState(90);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleSave = () => {
    socket.emit("set points awarded", pointsAwarded);
    socket.emit("set max time", maxTimeInput);
    closeModal();
  };

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  const handleEnterChat = (e) => {
    socket.emit("set confederate", currentUser)
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Chat Online de Solução de Problemas</h1>

      <div className="row">
        <ChatBox currentUser={currentUser} isAdmin={true} />
        <GameBox isAdmin={true} />
      </div>
      <div className="col-md-6">        
          <input
            type="text"
            placeholder="Insira seu nome"
            value={currentUser}
            onChange={(e) => setCurrentUser(e.target.value)}
          />
          <button className="btn btn-secondary" onClick={handleEnterChat}>
            Entrar no chat
          </button>
      </div>
      <button onClick={openModal}>Abrir Configurações</button>

      {showModal && (
        <div className="col-md-6">
          <h2>Configurações</h2>
          <label>
            Pontos por rodada:
            <input
              type="number"
              value={pointsAwarded}
              onChange={(e) => setPointsAwarded(Number(e.target.value))}
            />
          </label>
          <br />
          <label>
            Max Time (seconds):
            <input
              type="number"
              value={maxTimeInput}
              onChange={(e) => setMaxTimeInput(Number(e.target.value))}
            />
          </label>
          <br />
          <button onClick={handleSave}>Salvar</button>
          <button onClick={closeModal}>Cancelar</button>
        </div>
      )}
    </div>
  );
}

export default Experimenter;

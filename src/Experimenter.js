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
  const [pointsAwarded, setPointsAwarded] = useState(7);
  const [maxTimeInput, setMaxTimeInput] = useState(90);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleSave = () => {
    socket.emit("set points awarded", pointsAwarded);
    socket.emit("set max time", maxTimeInput);
    socket.emit("set confederate", currentUser);
    socket.emit("start timer");
    socket.emit("next block");
    closeModal();
  };

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  return (
    <div className="container mt-4" style={{ overflow: "hidden" }}>
      <h1 className="text-center mb-4">Chat Online de Solução de Problemas</h1>

      <div className="row">
        <ChatBox currentUser={currentUser} isAdmin={true} />
        <GameBox isAdmin={true} />
      </div>
      <button className="btn btn-primary" onClick={openModal}>
        Reiniciar Jogo
      </button>

      {showModal && (        
          <div className="modal-content">
            <h2 id="modal-title">Configurações do Jogo</h2>
            <label>
              Nome do Usuário:
              <input
                type="text"
                placeholder="Insira seu nome"
                value={currentUser}
                onChange={(e) => setCurrentUser(e.target.value)}
              />
            </label>
            <label>
              Pontos por rodada:
              <input
                type="number"
                value={pointsAwarded}
                onChange={(e) => setPointsAwarded(Number(e.target.value))}
              />
            </label>
            <label>
              Tempo máximo (seconds):
              <input
                type="number"
                value={maxTimeInput}
                onChange={(e) => setMaxTimeInput(Number(e.target.value))}
              />
            </label>
            <div>
              <button className="save-btn" onClick={handleSave}>
                Iniciar
              </button>
              <button className="cancel-btn" onClick={closeModal}>
                Cancelar
              </button>
            </div>
          </div>
      )}
    </div>
  );
}

export default Experimenter;

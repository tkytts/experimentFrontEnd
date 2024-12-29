import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import ChatBox from "./ChatBox";
import GameBox from "./GameBox";
import config from "./config";

const socket = io(config.serverUrl);

function Experimenter() {
  const [currentUser, setCurrentUser] = useState("");
  const [gender, setGender] = useState("F");
  const [showGameConfigModal, setShowGameConfigModal] = useState(false);
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState(7);
  const [maxTimeInput, setMaxTimeInput] = useState(90);
  const [confederatesFemaleStart, setConfederatesFemaleStart] = useState([]);
  const [confederatesMaleStart, setConfederatesMaleStart] = useState([]);
  const [enableMessageSentChimes, setEnableMessageSentChimes] = useState(true);
  const [enableMessageReceivedChimes, setEnableMessageReceivedChimes] = useState(true);
  const [enableTimerChimes, setEnableTimerChimes] = useState(true);

  useEffect(() => {
    // Load confederates data from public folder
    const loadConfederates = async () => {
      try {
        const femaleResponse = await fetch("/confederates/confederates_f.json");
        const maleResponse = await fetch("/confederates/confederates_m.json");

        if (!femaleResponse.ok || !maleResponse.ok) {
          throw new Error("Failed to fetch confederates data.");
        }

        const femaleData = await femaleResponse.json();
        const maleData = await maleResponse.json();

        setConfederatesFemaleStart(femaleData);
        setConfederatesMaleStart(maleData);
      } catch (error) {
        console.error("Error loading confederates data:", error);
      }
    };

    loadConfederates();
  }, []);

  const openGameConfigModal = () => {
    setShowGameConfigModal(true);
    handleGenderChange(gender);
  };

  const closeGameConfigModal = () => setShowGameConfigModal(false);

  const openResolutionModal = () => {
    setShowResolutionModal(true);
  };

  const closeResolutionModal = () => {
    setShowResolutionModal(false);
  };

  const handleGenderChange = (selectedGender) => {
    setGender(selectedGender);
    let firstUser = selectedGender === "F" ? confederatesFemaleStart[0].name : confederatesMaleStart[0].name;
    setCurrentUser(firstUser);
  };

  const getConfederateOptions = () => {
    return (gender === "F" ? confederatesFemaleStart : confederatesMaleStart).map(
      (confederate, index) => (
        <option key={index} value={confederate.name}>
          {confederate.name}
        </option>
      )
    );
  };

  const handleSave = () => {
    socket.emit("start game");
    socket.emit("set points awarded", pointsAwarded);
    socket.emit("set max time", maxTimeInput);
    socket.emit("set confederate", currentUser);
    socket.emit("set chimes", {
      messageSent: enableMessageSentChimes,
      messageReceived: enableMessageReceivedChimes,
      timer: enableTimerChimes
    });
    socket.emit("first block");
    closeGameConfigModal();
  };

  return (
    <div className="container mt-4" style={{ overflow: "hidden" }}>
      <h1 className="text-center mb-4">Chat Online de Solução de Problemas</h1>

      <div className="row">
        <ChatBox currentUser={currentUser} isAdmin={true} />
        <GameBox isAdmin={true} />
      </div>
      <button className="btn btn-primary" onClick={openGameConfigModal}>
        Iniciar Jogo
      </button>
      <button className="btn btn-secondary" onClick={openResolutionModal}>
        Resolver Jogo e Próximo Bloco
      </button>

      {showGameConfigModal && (
        <div className="modal-content p-4">
          <h2 id="modal-title" className="mb-3">Configurações do Jogo</h2>
          <label className="d-block mb-3">
            Gênero Inicial:
            <div style={{ display: "flex", alignItems: "center", gap: "20px", padding: "5px", border: "1px solid #ccc", borderRadius: "5px", backgroundColor: "#f9f9f9", marginTop: "5px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "5px", margin: "0" }}>
                <input
                  type="radio"
                  name="gender"
                  value="F"
                  checked={gender === "F"}
                  onChange={(e) => handleGenderChange(e.target.value)}
                />
                Feminino
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "5px", margin: "0" }}>
                <input
                  type="radio"
                  name="gender"
                  value="M"
                  checked={gender === "M"}
                  onChange={(e) => handleGenderChange(e.target.value)}
                />
                Masculino
              </label>
            </div>
          </label>
          <label className="d-block mb-3">
            Nome do(a) Confederado(a):
            <select
              className="form-control mt-2"
              value={currentUser}
              onChange={(e) => setCurrentUser(e.target.value)}
            >
              <option value="" disabled>
                Selecione
              </option>
              {getConfederateOptions()}
            </select>
          </label>
          <label className="d-block mb-3">
            Pontos por rodada:
            <input
              type="number"
              className="form-control"
              value={pointsAwarded}
              onChange={(e) => setPointsAwarded(Number(e.target.value))}
            />
          </label>
          <label className="d-block mb-3">
            Tempo máximo (seconds):
            <input
              type="number"
              className="form-control"
              value={maxTimeInput}
              onChange={(e) => setMaxTimeInput(Number(e.target.value))}
            />
          </label>
          <label className="d-block mb-3">
            Opções de Som:
            <div className="checkbox-container">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  className="form-check-input checkbox-input"
                  checked={enableMessageReceivedChimes}
                  onChange={(e) => setEnableMessageReceivedChimes(e.target.checked)}
                />
                Mensagem Recebida
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  className="form-check-input checkbox-input"
                  checked={enableMessageSentChimes}
                  onChange={(e) => setEnableMessageSentChimes(e.target.checked)}
                />
                Mensagem Enviada
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  className="form-check-input checkbox-input"
                  checked={enableTimerChimes}
                  onChange={(e) => setEnableTimerChimes(e.target.checked)}
                />
                Temporizador
              </label>
            </div>
          </label>
          <div className="d-flex justify-content-between">
            <button className="btn btn-success" onClick={handleSave}>
              Iniciar
            </button>
            <button className="btn btn-danger" onClick={closeGameConfigModal}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {showResolutionModal && (
        <div className="modal-content p-4">
          <h2 id="resolution-modal-title" className="mb-3">Resolução do Jogo e Próximo Bloco</h2>
          {/* Add your form elements and content here */}
          <button className="btn btn-primary" onClick={closeResolutionModal}>
            Fechar
          </button>
        </div>
      )}
    </div>
  );
}

export default Experimenter;

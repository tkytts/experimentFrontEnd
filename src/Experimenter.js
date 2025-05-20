import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import ChatBox from "./ChatBox";
import GameBox from "./GameBox";
import config from "./config";
import Modal from "./Modal";

const socket = io(config.serverUrl);

function Experimenter() {
  const [confederateName, setConfederateName] = useState("");
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
  const [teamAnswer, setTeamAnswer] = useState("");
  const [currentProblem, setCurrentProblem] = useState(0);
  const [currentParticipant, setCurrentParticipant] = useState(null);
  const [showTutorialCompleteModal, setShowTutorialCompleteModal] = useState(false);
  const [numTries, setNumTries] = useState(1);

  useEffect(() => {
    socket.on("tutorial done", (numTries) => {
      setNumTries(numTries);
      setShowTutorialCompleteModal(true);
    });
  
    return () => {
      socket.off("tutorial done");
    };
  }, []);

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

  useEffect(() => {
    // Fetch current user data
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(`${config.serverUrl}/currentUser`);
        if (!response.ok) {
          throw new Error("Failed to fetch current user data.");
        }
        const userData = await response.json();
        setCurrentParticipant(userData);
      } catch (error) {
        console.error("Error fetching current user data:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  const openGameConfigModal = () => {
    setShowGameConfigModal(true);

    if (!confederateName)
      handleGenderChange(gender);
  };

  const closeGameConfigModal = () => setShowGameConfigModal(false);

  const nextProblem = () => {
    socket.emit("clear answer");

    if (currentProblem === 4) {
      socket.emit("reset timer");
      socket.emit("stop timer");
      setNextConfederate()
      openGameConfigModal();
      socket.emit("block finished");
    }
    else {
      setCurrentProblem(currentProblem + 1);
      socket.emit("next problem");
      socket.emit("reset timer");
      socket.emit("start timer");
    }
  };


  function setNextConfederate() {
    const confederates = gender === "F" ? confederatesFemaleStart : confederatesMaleStart;
    const currentIndex = confederates.findIndex(confederate => confederate.name === confederateName);
    const nextIndex = (currentIndex + 1) % confederates.length;
    setConfederateName(confederates[nextIndex].name);
  }

  const openResolutionModal = () => {
    setTeamAnswer("");
    setShowResolutionModal(true);
  };

  const closeResolutionModal = () => {
    setShowResolutionModal(false);
  };

  const handleGenderChange = (selectedGender) => {
    setGender(selectedGender);
    let firstUser = selectedGender === "F" ? confederatesFemaleStart[0].name : confederatesMaleStart[0].name;
    setConfederateName(firstUser);
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
    let confederateBlock;
    if (gender === "F") {
      confederateBlock = confederatesFemaleStart.findIndex(confederate => confederate.name === confederateName);
    } else {
      confederateBlock = confederatesMaleStart.findIndex(confederate => confederate.name === confederateName);
    }

    setCurrentProblem(0);

    socket.emit("start game");
    socket.emit("set points awarded", pointsAwarded);
    socket.emit("set max time", maxTimeInput);
    socket.emit("set confederate", confederateName);
    socket.emit("set chimes", {
      messageSent: enableMessageSentChimes,
      messageReceived: enableMessageReceivedChimes,
      timer: enableTimerChimes
    });
    socket.emit("update problem selection", {
      blockIndex: confederateBlock,
      problemIndex: currentProblem
    }
    );
    socket.emit("clear chat");

    closeGameConfigModal();
  };

  const resolveGame = (gameResolutionType) => {
    if (!teamAnswer && gameResolutionType !== 'TNP') {
      alert('Por favor, preencha o campo "Resposta da Equipe".');
      return;
    }

    socket.emit("set game resolution", { gameResolutionType, teamAnswer });
    closeResolutionModal();
  };

  return (
    <div className="container mt-4" style={{ overflow: "hidden" }}>
      <h1 className="text-center mb-4">Bate-Papo Online de Resolução de Problemas</h1>

      <div className="row">
        <ChatBox currentUser={currentParticipant} isAdmin={true} />
        <GameBox isAdmin={true} />
      </div>
      <button className="btn btn-primary" onClick={openGameConfigModal}>
        Iniciar Jogo
      </button>
      <button className="btn btn-warning m-3" onClick={openResolutionModal}>
        Resolver Jogo
      </button>
      <button className="btn btn-secondary" onClick={nextProblem}>
        Próximo Problema
      </button>

      {showGameConfigModal && (
        <Modal>
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
              value={confederateName}
              onChange={(e) => setConfederateName(e.target.value)}
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
        </Modal>
      )}

      {showResolutionModal && (
        <Modal onClose={closeResolutionModal}>
          <h2 id="resolution-modal-title" className="mb-3">Resolução do Jogo e Próximo Problema</h2>
          <div className="mb-3">
            <label htmlFor="teamAnswer" className="form-label">Resposta do Time:</label>
            <input
              type="text"
              className="form-control"
              id="teamAnswer"
              value={teamAnswer}
              onChange={(e) => setTeamAnswer(e.target.value)}
            />
          </div>
          <div className="d-flex justify-content-between mb-3">
            <button className="btn btn-success" onClick={() => resolveGame('AP')}>CP</button>
            <button className="btn btn-warning" onClick={() => resolveGame('ANP')}>CSP</button>
            <button className="btn btn-primary" onClick={() => resolveGame('DP')}>DP</button>
            <button className="btn btn-danger" onClick={() => resolveGame('DNP')}>DSP</button>
            <button className="btn btn-secondary" onClick={() => resolveGame('TNP')}>TSP</button>
          </div>
        </Modal>
      )}
      {showTutorialCompleteModal && (
      <Modal onClose={() => setShowTutorialCompleteModal(false)}>
        <h2>Tutorial Completo</h2>
        <p>O usuario completou o tutorial com sucesso.</p>
        <p>O critério de domínio da tarefa foi atingido na {numTries}ª tentativa.</p>
      </Modal>
    )}
    </div>
  );
}

export default Experimenter;

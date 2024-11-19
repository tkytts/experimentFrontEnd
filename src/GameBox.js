import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // Replace with your server address

function GameBox({ isAdmin }) {
  const [currentProblem, setCurrentProblem] = useState(null); // New state to store the current problem
  const [currentBlock, setCurrentBlock] = useState(null); // New state to store the current block
  const [countdown, setCountdown] = useState(null);
  const countdownAudioRef = useRef(new Audio("/sounds/countdown.mp3")); // Reference to the countdown audio file
  const [blocks, setBlocks] = useState([]);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);

  socket.on("problem update", ({ block, problem }) => {
    setCurrentBlock(block);
    setCurrentProblem(problem);
  });

  useEffect(() => {
    socket.on("timer update", (newCountdown) => {
      setCountdown(newCountdown);
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
    fetch("http://localhost:5000/blocks")
      .then((response) => response.json())
      .then((data) => setBlocks(data))
      .catch((error) => console.error("Error fetching blocks:", error));
  }, []);

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

  const handleStartTimer = () => {
    socket.emit("start timer"); // Emit start timer event to server
  };

  const handleStopTimer = () => {
    socket.emit("stop timer"); // Emit stop timer event to server
    countdownAudioRef.current.pause();
    countdownAudioRef.current.currentTime = 0;
  };

  const handleResetTimer = () => {
    socket.emit("reset timer"); // Emit reset timer event to server
    countdownAudioRef.current.pause();
    countdownAudioRef.current.currentTime = 0;
  };

  const handleBlockChange = (e) => {
    const newBlockIndex = Number(e.target.value);
    setCurrentBlockIndex(newBlockIndex);
    setCurrentProblemIndex(0); // Reset to the first problem in the new block

    // Emit the updated selection to the server
    socket.emit("update problem selection", {
      blockIndex: newBlockIndex,
      problemIndex: 0,
    });
  };

  const handleProblemChange = (e) => {
    const newProblemIndex = Number(e.target.value);
    setCurrentProblemIndex(newProblemIndex);

    // Emit the updated selection to the server
    socket.emit("update problem selection", {
      blockIndex: currentBlockIndex,
      problemIndex: newProblemIndex,
    });
  };

  return (
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
            {countdown > 0 ? `Restam ${countdown} segundos` : "O tempo acabou"}
          </p>
          <p className="mb-1">Pontos: 0</p>

          {isAdmin && (<div><button className="btn btn-primary" onClick={handleStartTimer}>
            Iniciar Timer
          </button>
          <button className="btn btn-danger" onClick={handleStopTimer}>
            Pausar Timer
          </button>
          <button className="btn btn-secondary" onClick={handleResetTimer}>
            Resetar Timer
          </button></div>)}
          <br></br>
          {isAdmin && blocks.length > 0 && (
            <>
              {/* Dropdown for Block Selection */}
              <label>Selecione o Bloco</label>
              <select
                onChange={handleBlockChange}
                value={currentBlockIndex}
                className="form-select mb-3"
              >
                {blocks.map((block, index) => (
                  <option key={index} value={index}>
                    {block.blockName}
                  </option>
                ))}
              </select>

              {/* Dropdown for Problem Selection */}
              <label>Selecione o Problema</label>
              <select
                onChange={handleProblemChange}
                value={currentProblemIndex}
                className="form-select mb-3"
              >
                {blocks[currentBlockIndex].order.map((problem, index) => (
                  <option key={index} value={index}>
                    {problem}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default GameBox;
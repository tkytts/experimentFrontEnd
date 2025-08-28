import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import config from "./config";

const socket = io({ path: '/api/socket.io' });

function GameBox({ isAdmin, gamesRef, timerRef, pointsRef, teamAnswerRef }) {
  const [currentProblem, setCurrentProblem] = useState(null); // New state to store the current problem
  const [currentBlock, setCurrentBlock] = useState(null); // New state to store the current block
  const [countdown, setCountdown] = useState(null);
  const countdownAudioRef = useRef(new Audio("/sounds/countdown.mp3")); // Reference to the countdown audio file
  const [countdownAudioEnabled, setCountdownAudioEnabled] = useState(false);
  const [teamAnswer, setTeamAnswer] = useState("");
  const [teamScore, setTeamScore] = useState(0);
  const [finalAnswer, setFinalAnswer] = useState("");
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [pointsAwarded, setPointsAwarded] = useState(null);
  const [showResults, setShowResults] = useState(false);

  socket.on("problem update", ({ block, problem }) => {
    setCurrentBlock(block);
    setCurrentProblem(problem);
    setShowResults(false);
  });

  useEffect(() => {
    socket.on("timer update", (newCountdown) => {
      setCountdown(newCountdown);
    });

    socket.on("chimes updated", (data) => {
      setCountdownAudioEnabled(data?.timer ?? false);
    });

    socket.on("set answer", (answer) => {
      setTeamAnswer(answer);
    });

    socket.on("game resolved", (resolution) => {
      setFinalAnswer("");
      setIsAnswerCorrect(null);
      setPointsAwarded(null);

      setTimeout(() => {
        setShowResults(true);
        setFinalAnswer(resolution.teamAnswer);

        setTimeout(() => {
          setIsAnswerCorrect(resolution.isAnswerCorrect)

          setTimeout(() => {
            setPointsAwarded(resolution.pointsAwarded)
            setTeamScore(resolution.currentScore)
          }
            , 3000);
        }, 3000);

      }, 3000);
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
    if (countdownAudioEnabled && countdownAudioEnabled.current) {
      if (countdown <= 10) {
        countdownAudioRef.current.play();
      } else {
        countdownAudioRef.current.pause();
        countdownAudioRef.current.currentTime = 0; // Reset audio playback
      }
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

  return (
    <div className="col-md-6">
      <div className="card">
        <div className="card-body">
          <p className="mb-3">Encontrem a solução para o problema:</p>
          <div className="fs-2 mb-3" ref={gamesRef}>
            {currentBlock && currentProblem ? (
              <img
                src={`/problems/${currentBlock.blockName}/${currentProblem}.png`}
                alt="Problema"
                className="img-fluid"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            ) : (
              "Carregando problema..."
            )}
          </div>
          {showResults && (<p className="mb-1"><b>A resposta do time foi {finalAnswer}</b></p>)}
          {showResults && isAnswerCorrect != null && (
            <p className="mb-1"><b>A resposta do time estava {isAnswerCorrect ? "correta" : "incorreta"}</b></p>
          )}
          {showResults && pointsAwarded != null && (
            <p className="mb-1"><b>Vocês ganharam {pointsAwarded} pontos</b></p>
          )}
          <p
            className={`mt-3 ${countdown === 0 ? "text-danger" : ""} ${countdown <= 10 ? "flash-red" : ""
              }`}
            ref={timerRef}
          >
            {countdown > 0 ? `Restam ${countdown} segundos` : <b>O tempo acabou</b>}
          </p>
          <p className="mb-1" ref={teamAnswerRef}><b>Resposta do Time:</b> {teamAnswer}</p>
          <p className="mb-1" ref={pointsRef}><b>Pontos:</b> {teamScore}</p>

          {isAdmin && (<div><button className="btn btn-primary" onClick={handleStartTimer}>
            Iniciar Timer
          </button>
            <button className="btn btn-danger" onClick={handleStopTimer}>
              Pausar Timer
            </button>
            <button className="btn btn-secondary" onClick={handleResetTimer}>
              Resetar Timer
            </button></div>)}
        </div>
      </div>
    </div>
  );
}

export default GameBox;
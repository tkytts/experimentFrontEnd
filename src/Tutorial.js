import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import ChatBox from "./ChatBox";
import GameBox from "./GameBox";
import io from "socket.io-client";
import config from "./config";
import Modal from "./Modal";
import InputModal from "./InputModal";

const socket = io(config.serverUrl);

function Tutorial() {
  const navigate = useNavigate(); // Define navigate using useNavigate
  const [currentUser, setCurrentUser] = useState("");
  const [usernameSet, setUsernameSet] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [wrongAnswer, setWrongAnswer] = useState(0);
  const [typedMessage, setTypedMessage] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [messageInputStyle, setMessageInputStyle] = useState(null);
  const [numTries, setNumTries] = useState(1);
  const currentUserRef = useRef("");
  const messageRef = useRef(null);
  const sendButtonRef = useRef(null);
  const chatRef = useRef(null);
  const confederateNameRef = useRef(null);
  const activityRef = useRef(null);
  const gamesRef = useRef(null);
  const timerRef = useRef(null);
  const pointsRef = useRef(null);
  const teamAnswerRef = useRef(null);
  const readyButtonRef = useRef(null);

  useEffect(() => {
    currentUserRef.current = currentUser;

    socket.on("start game", () => {
      navigate("/participant"); // Use navigate here
    });

    return () => {
      socket.off("start game");
    };
  }, [currentUser, navigate]);


  const handleTutorialStep1 = () => {
    setCurrentUser("Seu Nome");
    setUsernameSet(true);
    socket.emit("set max time", 90);
    setTutorialStep(1);

    socket.emit("set chimes", {
      messageSent: true,
      messageReceived: true,
      timer: true
    });
  };

  const handleSimulation1 = () => {
    let simulationConfederate = "Sérgio";
    setTutorialStep(11);
    socket.emit("set confederate", simulationConfederate);
    setCurrentUser("Flávia");
    socket.emit("tutorial problem", { block: { blockName: "T_1" }, problem: "1" });

    setTimeout(() => {
      readyButtonRef.current.classList.add('click-animation');

      setTimeout(() => {
        readyButtonRef.current.classList.remove('click-animation');
        setTimeout(() => {
          setTutorialStep(12);
        }, 200);

        socket.emit("start timer");

        setTimeout(() => {
          socket.emit("typing", simulationConfederate);
          setTimeout(() => {
            socket.emit("chat message", {
              user: simulationConfederate,
              text: "O que você acha?",
              timeStamp: new Date().toISOString(),
            });
            socket.emit("stop timer");
            setTimeout(() => {
              setTutorialStep(13);
            }, 2000);
          }, 1000);
        }, 2800)
      }, 500);
    }, 2000);
  }

  const handleTutorialStep13 = () => {
    let simulationConfederate = "Sérgio";
    socket.emit("set max time", 70);
    socket.emit("start timer");
    setTutorialStep(14);
    handleTutorialMessage("A resposta é triângulo");

    setTimeout(() => {
      socket.emit("typing", simulationConfederate);
      socket.emit("set max time", 33);
      socket.emit("start timer");
      setTimeout(() => {
        socket.emit("chat message", {
          user: simulationConfederate,
          text: "Sim, acho que você está certa!",
          timeStamp: new Date().toISOString(),
        });

        setTimeout(() => {
          socket.emit("set answer", "triângulo");
          socket.emit("set game resolution", { gameResolutionType: "AP", teamAnswer: "triângulo" });
          socket.emit("set max time", 11);
          socket.emit("start timer");

          setTimeout(() => {
            setTutorialStep(15);
          }, 25000);
        }, 3000);
      }, 3000);
    }, 5000);
  };

  const handleSimulation2 = () => {
    socket.emit("set answer", "");
    socket.emit("reset points");
    socket.emit("clear chat");
    socket.emit("set max time", 90);
    let simulationConfederate = "César";
    setTutorialStep(16);
    socket.emit("set confederate", simulationConfederate);
    setCurrentUser("Ana");
    socket.emit("tutorial problem", { block: { blockName: "T_1" }, problem: "2" });

    setTimeout(() => {
      readyButtonRef.current.classList.add('click-animation');

      setTimeout(() => {
        readyButtonRef.current.classList.remove('click-animation');
        setTimeout(() => {
          setTutorialStep(12);
        }, 200);

        socket.emit("start timer");

        setTimeout(() => {
          socket.emit("typing", simulationConfederate);
          setTimeout(() => {
            socket.emit("chat message", {
              user: simulationConfederate,
              text: "Em qual opção você está pensando?",
              timeStamp: new Date().toISOString(),
            });
            socket.emit("stop timer");
            setTimeout(() => {
              setTutorialStep(17);
            }, 2000);
          }, 1000);
        }, 2800)
      }, 500);
    }, 2000);
  };

  const handleTutorialStep17 = () => {
    let simulationConfederate = "César";
    socket.emit("set max time", 70);
    socket.emit("start timer");
    setTutorialStep(18);
    handleTutorialMessage("Acho que a resposta é 11");

    setTimeout(() => {
      socket.emit("typing", simulationConfederate);
      socket.emit("set max time", 33);
      socket.emit("start timer");
      setTimeout(() => {
        socket.emit("chat message", {
          user: simulationConfederate,
          text: "Eu discordo... acho que é 12!!",
          timeStamp: new Date().toISOString(),
        });

        setTimeout(() => {
          socket.emit("set answer", "12");
          socket.emit("set game resolution", { gameResolutionType: "DNP", teamAnswer: "12" });
          socket.emit("set max time", 11);
          socket.emit("start timer");

          setTimeout(() => {
            setTutorialStep(19);
          }, 25000);
        }, 3000);

      }, 3000);
    }, 5000);
  };

  const handleSimulation3 = () => {
    socket.emit("clear chat");
    socket.emit("set max time", 90);
    let simulationConfederate = "Júlio";
    setTutorialStep(20);
    socket.emit("set confederate", simulationConfederate);
    setCurrentUser("Hugo");
    socket.emit("tutorial problem", { block: { blockName: "T_1" }, problem: "3" });
  };

  const handleTutorialStep20 = () => {
    setTutorialStep(21);
    let simulationConfederate = "Júlio";
    socket.emit("typing", simulationConfederate);
    setTimeout(() => {
      socket.emit("typing", simulationConfederate);
      setTimeout(() => {
        socket.emit("chat message", {
          user: simulationConfederate,
          text: "O que você acha?",
          timeStamp: new Date().toISOString(),
        });
        setTimeout(() => {
          setTutorialStep(22);
        }, 2000);
      }, 1000);
    }, 2000);
  };

  const handleTutorialStep24 = () => {
      socket.emit("tutorial done", numTries);
      setTutorialStep(25);
  }

  socket.on("chat message", (message) => {
    if (tutorialStep === 23) {
      if (/flecha.+verde.+cima/.test(message.text)) {
        setWrongAnswer(0);
        setTutorialStep(24);
      }
      else {
        setNumTries(numTries + 1);
        setTypedMessage(message.text);
        setWrongAnswer(1);
        setTutorialStep(22);
      }
    }
  });

  const handleTutorialMessage = (message) => {
    setShowMessageBox(true);
    let inputPosition = messageRef.current.getBoundingClientRect();

    setMessageInputStyle({
      position: 'absolute',
      top: inputPosition.top,
      left: inputPosition.left,
      width: inputPosition.width,
      height: inputPosition.height
    });

    typeMessage(message);
  }

  function typeMessage(originalMessage, delay = 100) {
    let newMessage = "";
    const characters = originalMessage.split("");
    let index = 0;

    const intervalId = setInterval(() => {
      newMessage += characters[index];
      setNewMessage(newMessage);

      index++;

      if (index >= characters.length) {
        clearInterval(intervalId);

        setTimeout(() => {
          sendButtonRef.current.classList.add('click-animation');

          setTimeout(() => {
            sendButtonRef.current.classList.remove('click-animation');
            setShowMessageBox(false);
            socket.emit("chat message", {
              user: currentUser,
              text: originalMessage,
              timeStamp: new Date().toISOString(),
            });
          }, 500);
        }, 1000);
      }
    }, delay);
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Bate-Papo Online de Resolução de Problemas</h1>
      {tutorialStep === 0 && (
        <div className="mb-4" style={{ textAlign: "left" }}>
          <p>Bem-vindo(a)!</p>
          <p>Muito obrigada por participar do estudo.
            <br /> O objetivo desta pesquisa é compreender como as pessoas resolvem problemas durante atividades (que, daqui para frente, chamaremos de jogos).
            <br /> Você usará este computador para interagir com outro(a) participante (que chamaremos de jogador(a)) em um bate-papo online.</p>
          <p>Você e o(a) outro(a) jogador(a) participarão de jogos cooperativos e ganharão pontos ao resolverem os problemas corretamente.
            <br /> Você e o(a) outro(a) jogador(a) verão telas idênticas, e o(a) outro(a) jogador(a) enviará as respostas finais dos problemas para a pesquisadora.</p>
          <p>Sua missão é ajudar o(a) outro(a) jogador(a) a resolver os problemas, usando o bate-papo para se comunicar com ele(a).
            <br /> Vocês receberão instruções sobre como usar o bate-papo neste tutorial. Para isto, siga as instruções que aparecerão na tela.</p>
        </div>
      )}
      {tutorialStep === 0 && (
        <div className="mb-4" style={{ textAlign: "center" }}>
          <p>Clique no botão “Pronto(a)!” para iniciar o tutorial!</p>
          <button className="btn btn-primary btn-narrow" onClick={handleTutorialStep1}>
            Pronto(a)!
          </button>
        </div>
      )}
      {tutorialStep === 1 && (
        <Modal>
          <p>Bem-vindo(a) ao Bate-Papo Online de Resolução de Problemas! Nesse tutorial, você vai aprender como utilizar o bate-papo e suas funcionalidades.</p>
          <button className="btn btn-primary btn-narrow" onClick={() => setTutorialStep(2)}>
            Entendi!
          </button>
        </Modal>
      )}
      {tutorialStep === 2 && (
        <InputModal onUnderstood={() => setTutorialStep(3)} inputRef={messageRef?.current} text="Essa é a caixa de texto. Digite sua mensagem aqui e aperte o botão “Enviar” ou a tecla “Enter” para enviar mensagens ao(à) outro(a) jogador(a).">
        </InputModal>
      )}
      {tutorialStep === 3 && (
        <InputModal onUnderstood={() => setTutorialStep(4)} inputRef={chatRef?.current} text="Esse é o campo de histórico de mensagens. Todas as mensagens enviadas e recebidas aparecerão aqui. Você vai ouvir um som quando o(a) outro(a) jogador(a) te enviar uma mensagem e quando sua mensagem for enviada ao(à) outro(a) jogador(a).">
        </InputModal>
      )}
      {tutorialStep === 4 && (
        <InputModal onUnderstood={() => setTutorialStep(5)} inputRef={confederateNameRef?.current} text="Aqui você vai ver o nome do(a) outro(a) jogador(a).">
        </InputModal>
      )}
      {tutorialStep === 5 && (
        <InputModal onUnderstood={() => setTutorialStep(6)} inputRef={activityRef?.current} text="Você vai poder acompanhar a atividade do(a) outro(a) jogador(a). Uma mensagem te informará quando ele(a) estiver digitando.">
        </InputModal>
      )}
      {tutorialStep === 6 && (
        <InputModal onUnderstood={() => setTutorialStep(7)} inputRef={gamesRef?.current} text="Essa a tela dos jogos. Você e o(a) outro(a) jogador(a) verão os mesmos jogos, que poderão ter diferentes níveis de dificuldade e incluir atividades de resolução de problemas com várias combinações e padrões de números, formas, cores ou letras. Sua missão é resolver o problema de forma cooperativa com o(a) outro(a) jogador(a), usando o bate-papo para conversar com ele(a).">
        </InputModal>
      )}
      {tutorialStep === 7 && (
        <InputModal onUnderstood={() => setTutorialStep(8)} inputRef={timerRef?.current} text="Esse é o cronômetro de contagem regressiva. O tempo restante que vocês terão para resolver o problema vai aparecer aqui.">
        </InputModal>
      )}
      {tutorialStep === 8 && (
        <InputModal onUnderstood={() => setTutorialStep(9)} inputRef={pointsRef?.current} text="Aqui você vai ver o total de pontos que acumulou em todos os jogos que participou.">
        </InputModal>
      )}
      {tutorialStep === 9 && (
        <InputModal onUnderstood={() => setTutorialStep(10)} inputRef={teamAnswerRef?.current} text="Aqui você vai ver a resposta final que o(a) outro(a) jogador(a) enviará para a solução do problema.">
        </InputModal>
      )}
      {tutorialStep === 10 && (
        <Modal>
          <p>Agora que você já sabe como o bate-papo funciona, vou te mostrar um exemplo de jogo. Depois, você vai praticar com alguns jogos antes de começar. Essa é uma simulação de computador, então não é um(a) jogador(a) real. Por enquanto, você só precisa observar o exemplo.</p>
          <button className="btn btn-primary btn-narrow" onClick={() => handleSimulation1()}>
            Entendi!
          </button>
        </Modal>
      )}
      {tutorialStep === 11 && (
        <Modal>
          <p>Você está jogando com</p>
          <p className="h2"><b>Sérgio</b></p>
          <button ref={readyButtonRef} className="btn btn-primary btn-narrow button-dead">
            Pronto(a)!
          </button>
        </Modal>
      )}
      {tutorialStep === 13 && (
        <Modal>
          <p>Para esse problema, vou digitar a mensagem: “A resposta é triângulo”. Vou te mostrar como enviar a mensagem.</p>
          <button className="btn btn-primary btn-narrow" onClick={() => handleTutorialStep13()}>
            Entendi!
          </button>
        </Modal>
      )}
      {tutorialStep === 15 && (
        <Modal>
          <p>Agora vou mostrar outro exemplo de jogo. Essa é outra simulação de computador.</p>
          <button className="btn btn-primary btn-narrow" onClick={() => handleSimulation2()}>
            Entendi!
          </button>
        </Modal>
      )}
      {tutorialStep === 16 && (
        <Modal>
          <p>Você está jogando com</p>
          <p className="h2"><b>César</b></p>
          <button ref={readyButtonRef} className="btn btn-primary btn-narrow button-dead">
            Pronto(a)!
          </button>
        </Modal>
      )}
      {tutorialStep === 17 && (
        <Modal>
          <p>Para esse problema, vou digitar a mensagem: “Acho que a resposta é 11”. Vou te mostrar como enviar a mensagem.</p>
          <button className="btn btn-primary btn-narrow" onClick={() => handleTutorialStep17()}>
            Entendi!
          </button>
        </Modal>
      )}
      {tutorialStep === 19 && (
        <Modal>
          <p>Agora que te mostrei como escrever e enviar mensagens, é sua vez de praticar em uma simulação de computador antes de jogar com outro(a) jogador(a). Para isso, siga as instruções que aparecerão na tela. Clique no botão “Pronto(a)!” para iniciar.          </p>
          <button className="btn btn-primary btn-narrow" onClick={() => handleSimulation3()}>
            Pronto(a)!
          </button>
        </Modal>
      )}
      {tutorialStep === 20 && (
        <Modal>
          <p>Bem-vindo(a) ao Bate-Papo Online de Resolução de Problemas!</p>
          <p>Você está jogando com</p>
          <p className="h2"><b>Júlio</b></p>
          <p>Clique em “PRONTO(A)!” quando estiver pronto(a) para iniciar o jogo.”</p>
          <button onClick={() => handleTutorialStep20()} className="btn btn-primary btn-narrow">
            Pronto(a)!
          </button>
        </Modal>
      )}
      {tutorialStep === 22 && !wrongAnswer && (
        <Modal>
          <p>Para esse problema, digite a seguinte mensagem: “flecha verde para cima”.</p>
          <button className="btn btn-primary btn-narrow" onClick={() => setTutorialStep(23)}>
            Entendi!
          </button>
        </Modal>
      )}
      {tutorialStep === 22 && wrongAnswer && (
        <Modal>
          <p>A frase digitada contém um erro: você digitou “{typedMessage}” em vez de “<b>flecha verde para cima</b>”. Por favor, tente novamente digitando a frase corretamente.</p>
          <button className="btn btn-primary btn-narrow" onClick={() => setWrongAnswer(0)}>
            Entendi!
          </button>
        </Modal>
      )}
      {tutorialStep === 24 && (
        <Modal>
          <p>EXCELENTE!!!</p>
          <button className="btn btn-primary" onClick={() => handleTutorialStep24()}>
            Obrigado(a)!
          </button>
        </Modal>
      )}
      {tutorialStep === 25 && (
        <Modal>
          <p>Agora que você já sabe como o jogo e o envio de mensagens funcionam, você vai começar a jogar com outro(a) jogador(a). Nesse momento, o(a) jogador(a) está recebendo as mesmas instruções desse tutorial. Por favor, aguarde o(a) jogador(a) estar pronto(a) para jogar com você. Isso pode levar de 1 a 5 minutos. Quando o(a) jogador(a) estiver pronto(a), a pesquisadora te avisará e o jogo irá começar.</p>
        </Modal>
      )}
      {usernameSet && (
        <div className="row">
          <ChatBox currentUser={currentUser} isAdmin={false} messageRef={messageRef} chatRef={chatRef} confederateNameRef={confederateNameRef} activityRef={activityRef} sendButtonRef={sendButtonRef} />
          <GameBox isAdmin={false} gamesRef={gamesRef} timerRef={timerRef} pointsRef={pointsRef} teamAnswerRef={teamAnswerRef} />
          {showMessageBox && <input
            type="text"
            className="form-control me-2"
            placeholder="Mensagem"
            value={newMessage}
            style={messageInputStyle}
          />}
        </div>
      )}
    </div>
  );
}

export default Tutorial;
import React, { useState, useEffect, useRef } from "react";
import ChatBox from "./ChatBox";
import GameBox from "./GameBox";
import io from "socket.io-client";
import config from "./config";
import Modal from "./Modal";
import InputModal from "./InputModal";

const socket = io(config.serverUrl);

function Tutorial() {
  const [currentUser, setCurrentUser] = useState("");
  const currentUserRef = useRef("");
  const [usernameSet, setUsernameSet] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const messageRef = useRef(null);
  const chatRef = useRef(null);
  const confederateNameRef = useRef(null);
  const activityRef = useRef(null);
  const gamesRef = useRef(null);
  const timerRef = useRef(null);
  const pointsRef = useRef(null);
  const teamAnswerRef = useRef(null);
  const step11ButtonRef = useRef(null);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  const handleSetUsername = (e) => {
    e.preventDefault();
    if (currentUser.trim() !== "") {
      setUsernameSet(true);
    }
  };

  const handleTutorialStep1 = () => {
    setCurrentUser("Seu Nome");
    setUsernameSet(true);
    socket.emit("set max time", 90);
    setTutorialStep(1);
  };

  const handleSimulation1 = () => {
    setTutorialStep(11);
    socket.emit("set confederate", "Ricardo");
    socket.emit("tutorial problem", {block: {blockName: "T_1" }, problem: "1"});

    setTimeout(() => {
      step11ButtonRef.current.classList.add('click-animation');

      setTimeout(() => {
        step11ButtonRef.current.classList.remove('click-animation');
        setTutorialStep(12);
      }, 200);
    }, 2000);
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
          <p>Bem-vindo(a) ao Jogo de Resolução de Problemas! Nesse tutorial, você vai aprender como utilizar o bate-papo e suas funcionalidades.</p>
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
        <InputModal onUnderstood={() => setTutorialStep(10)} inputRef={teamAnswerRef?.current} text="Aqui você vai ver a resposta final que o(a) outro(a) jogador(a) sugerir para o problema.">
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
            <p class name="h2"><b>Ricardo</b></p>
            <button ref={step11ButtonRef} className="btn btn-primary btn-narrow">
              Pronto(a)!
            </button>
          </Modal>
      )}
      {tutorialStep > 0 && !usernameSet && (
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
          <ChatBox currentUser={currentUser} isAdmin={false} messageRef={messageRef} chatRef={chatRef} confederateNameRef={confederateNameRef} activityRef={activityRef} />
          <GameBox isAdmin={false} gamesRef={gamesRef} timerRef={timerRef} pointsRef={pointsRef} teamAnswerRef={teamAnswerRef} />
        </div>
      )}
    </div>
  );
}

export default Tutorial;
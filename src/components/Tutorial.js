import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import ChatBox from "./ChatBox";
import GameBox from "./GameBox";
import Modal from "./Modal";
import InputModal from "./InputModal";
import socket from "../socket";
import { Trans, useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
    setCurrentUser(t('your_name'));
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
    let simulationConfederate = t('tutorial_confederate_1');
    setTutorialStep(11);
    socket.emit("set confederate", simulationConfederate);
    setCurrentUser(t('tutorial_participant_1'));
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
              text: t('what_do_you_think'),
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
    let simulationConfederate = t('tutorial_confederate_1');
    socket.emit("set max time", 70);
    socket.emit("start timer");
    setTutorialStep(14);
    handleTutorialMessage(t('the_answer_is_triangle'));

    setTimeout(() => {
      socket.emit("typing", simulationConfederate);
      socket.emit("set max time", 33);
      socket.emit("start timer");
      setTimeout(() => {
        socket.emit("chat message", {
          user: simulationConfederate,
          text: t('yes_i_think_you_are_right'),
          timeStamp: new Date().toISOString(),
        });

        setTimeout(() => {
          socket.emit("set answer", t('triangle'));
          socket.emit("set game resolution", { gameResolutionType: "AP", teamAnswer: t('triangle') });
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
    let simulationConfederate = t('tutorial_confederate_2');
    setTutorialStep(16);
    socket.emit("set confederate", simulationConfederate);
    setCurrentUser(t('tutorial_participant_2'));
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
              text: t('which_option'),
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
    let simulationConfederate = t('tutorial_confederate_2');
    socket.emit("set max time", 70);
    socket.emit("start timer");
    setTutorialStep(18);
    handleTutorialMessage(t('i_think_the_answer_is_11'));

    setTimeout(() => {
      socket.emit("typing", simulationConfederate);
      socket.emit("set max time", 33);
      socket.emit("start timer");
      setTimeout(() => {
        socket.emit("chat message", {
          user: simulationConfederate,
          text: t('i_disagree_i_think_its_12'),
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
    let simulationConfederate = t('tutorial_confederate_3');
    setTutorialStep(20);
    socket.emit("set confederate", simulationConfederate);
    setCurrentUser(t('tutorial_participant_3'));
    socket.emit("tutorial problem", { block: { blockName: "T_1" }, problem: "3" });
  };

  const handleTutorialStep20 = () => {
    setTutorialStep(21);
    let simulationConfederate = t('tutorial_confederate_3');
    socket.emit("typing", simulationConfederate);
    setTimeout(() => {
      socket.emit("typing", simulationConfederate);
      setTimeout(() => {
        socket.emit("chat message", {
          user: simulationConfederate,
          text: t('what_do_you_think'),
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
      // Compare normalized message with the translated answer
      const expected = t('arrow_up_green').toLowerCase().replace(/\s+/g, '');
      const received = message.text.toLowerCase().replace(/\s+/g, '');
      if (received === expected) {
        setWrongAnswer(0);
        setTutorialStep(24);
      } else {
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
            try {
              new Audio("/sounds/message-sent.mp3").play(); // Play sound when a message is sent
            } catch (error) {
              console.error("Failed to play audio:", error); // Optionally log the error
            }
          }, 500);
        }, 1000);
      }
    }, delay);
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">{t('title')}</h1>
      {tutorialStep === 0 && (
        <div className="mb-4" style={{ textAlign: "left" }}>
          <p>{t('welcome')}</p>
          <Trans i18nKey="tutorial_intro" components={{ p: <p /> }} />
        </div>
      )}
      {tutorialStep === 0 && (
        <div className="mb-4" style={{ textAlign: "center" }}>
          <p>{t('start_tutorial')}</p>
          <button className="btn btn-primary btn-narrow" onClick={handleTutorialStep1}>
            {t('ready')}
          </button>
        </div>
      )}
      {tutorialStep === 1 && (
        <Modal>
          <p>{t('tutorial_step1')}</p>
          <button
            className="btn btn-primary btn-narrow"
            style={{ minWidth: '120px', width: '120px', textAlign: 'center' }}
            onClick={() => setTutorialStep(2)}>
            {t('understood')}
          </button>
        </Modal>
      )}
      {tutorialStep === 2 && (
        <InputModal onUnderstood={() => setTutorialStep(3)} inputRef={messageRef?.current} text={t('inputmodal_2')} />
      )}
      {tutorialStep === 3 && (
        <InputModal onUnderstood={() => setTutorialStep(4)} inputRef={chatRef?.current} text={t('inputmodal_3')} />
      )}
      {tutorialStep === 4 && (
        <InputModal onUnderstood={() => setTutorialStep(5)} inputRef={confederateNameRef?.current} text={t('inputmodal_4')} />
      )}
      {tutorialStep === 5 && (
        <InputModal onUnderstood={() => setTutorialStep(6)} inputRef={activityRef?.current} text={t('inputmodal_5')} />
      )}
      {tutorialStep === 6 && (
        <InputModal onUnderstood={() => setTutorialStep(7)} inputRef={gamesRef?.current} text={t('inputmodal_6')} />
      )}
      {tutorialStep === 7 && (
        <InputModal onUnderstood={() => setTutorialStep(8)} inputRef={timerRef?.current} text={t('inputmodal_7')} />
      )}
      {tutorialStep === 8 && (
        <InputModal onUnderstood={() => setTutorialStep(9)} inputRef={pointsRef?.current} text={t('inputmodal_8')} />
      )}
      {tutorialStep === 9 && (
        <InputModal onUnderstood={() => setTutorialStep(10)} inputRef={teamAnswerRef?.current} text={t('inputmodal_9')} />
      )}
      {tutorialStep === 10 && (
        <Modal>
          <p>{t('tutorial_step10')}</p>
          <button
            className="btn btn-primary btn-narrow"
            style={{ minWidth: '120px', width: '120px', textAlign: 'center' }}
            onClick={() => handleSimulation1()}>
            {t('understood')}
          </button>
        </Modal>
      )}
      {tutorialStep === 11 && (
        <Modal>
          <p>{t('playing_with')}</p>
          <p className="h2"><b>{t('tutorial_confederate_1')}</b></p>
          <button ref={readyButtonRef} className="btn btn-primary btn-narrow button-dead">
            {t('ready')}
          </button>
        </Modal>
      )}
      {tutorialStep === 13 && (
        <Modal>
          <p>{t('tutorial_step13')}</p>
          <button
            className="btn btn-primary btn-narrow"
            style={{ minWidth: '120px', width: '120px', textAlign: 'center' }}
            onClick={() => handleTutorialStep13()}>
            {t('understood')}
          </button>
        </Modal>
      )}
      {tutorialStep === 15 && (
        <Modal>
          <p>{t('tutorial_step15')}</p>
          <button
            className="btn btn-primary btn-narrow"
            style={{ minWidth: '120px', width: '120px', textAlign: 'center' }}
            onClick={() => handleSimulation2()}>
            {t('understood')}
          </button>
        </Modal>
      )}
      {tutorialStep === 16 && (
        <Modal>
          <p>{t('playing_with')}</p>
          <p className="h2"><b>{t("tutorial_confederate_2")}</b></p>
          <button ref={readyButtonRef} className="btn btn-primary btn-narrow button-dead">
            {t('ready')}
          </button>
        </Modal>
      )}
      {tutorialStep === 17 && (
        <Modal>
          <p>{t('tutorial_step17')}</p>
          <button
            className="btn btn-primary btn-narrow"
            style={{ minWidth: '120px', width: '120px', textAlign: 'center' }}
            onClick={() => handleTutorialStep17()}>
            {t('understood')}
          </button>
        </Modal>
      )}
      {tutorialStep === 19 && (
        <Modal>
          <p>{t('tutorial_step19')}</p>
          <button
            className="btn btn-primary btn-narrow"
            style={{ minWidth: '120px', width: '120px', textAlign: 'center' }}
            onClick={() => handleSimulation3()}>
            {t('ready')}
          </button>
        </Modal>
      )}
      {tutorialStep === 20 && (
        <Modal>
          <p>{t('tutorial_step20_1')}</p>
          <p>{t('tutorial_step20_2')}</p>
          <p className="h2"><b>{t("tutorial_confederate_3")}</b></p>
          <p>{t('tutorial_step20_3')}</p>
          <button onClick={() => handleTutorialStep20()} className="btn btn-primary btn-narrow">
            {t('ready')}
          </button>
        </Modal>
      )}
      {tutorialStep === 22 && !wrongAnswer && (
        <Modal>
          <p>{t('tutorial_step22')}</p>
          <button
            className="btn btn-primary btn-narrow"
            style={{ minWidth: '120px', width: '120px', textAlign: 'center' }}
            onClick={() => setTutorialStep(23)}>
            {t('understood')}
          </button>
        </Modal>
      )}
      {tutorialStep === 22 && wrongAnswer && (
        <Modal>
          <Trans i18nKey="tutorial_step22_wrong" values={{ typedMessage }} components={{ b: <b /> }} />
          <button
            className="btn btn-primary btn-narrow"
            style={{ minWidth: '120px', width: '120px', textAlign: 'center' }}
            onClick={() => setWrongAnswer(0)}>
            {t('understood')}
          </button>
        </Modal>
      )}
      {tutorialStep === 24 && (
        <Modal>
          <p>{t('excellent')}</p>
          <button
            className="btn btn-primary btn-narrow"
            style={{ minWidth: '120px', width: '120px', textAlign: 'center' }}
            onClick={() => handleTutorialStep24()}>
            {t('thanks')}
          </button>
        </Modal>
      )}
      {tutorialStep === 25 && (
        <Modal>
          <p>{t('tutorial_step25')}</p>
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
import { createContext, useContext, useState, useEffect } from "react";
import socket from "../socket";

const DEFAULT_CHIMES = {
  messageSent: true,
  messageReceived: true,
  timer: true,
};

const ChimesConfigContext = createContext({
  chimesConfig: DEFAULT_CHIMES,
  updateChimesConfig: () => {},
});

export function ChimesConfigProvider({ children }) {
  const [chimesConfig, setChimesConfig] = useState(DEFAULT_CHIMES);

  useEffect(() => {
    socket.emit("get chimes");
    socket.on("chimes updated", (data) => {
      setChimesConfig(data);
    });
    return () => socket.off("chimes updated");
  }, []);

  const updateChimesConfig = (newConfig) => {
    setChimesConfig(newConfig);
    socket.emit("set chimes", newConfig);
  };

  return (
    <ChimesConfigContext.Provider value={{ chimesConfig, updateChimesConfig }}>
      {children}
    </ChimesConfigContext.Provider>
  );
}

export function useChimesConfig() {
  return useContext(ChimesConfigContext) || { chimesConfig: DEFAULT_CHIMES, updateChimesConfig: () => {} };
}
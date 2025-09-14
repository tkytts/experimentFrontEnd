import React, { createContext, useContext, useState, useEffect } from "react";
import socket from "../socket";

const ChimesConfigContext = createContext();

export function ChimesConfigProvider({ children }) {
  const [chimesConfig, setChimesConfig] = useState({
    messageSent: true,
    messageReceived: true,
    timer: true,
  });

  useEffect(() => {
    socket.emit("get chimes");
    socket.on("chimes updated", (data) => {
      setChimesConfig(data);
    });
    return () => socket.off("chimes updated");
  }, []);

  // Optionally, provide a setter to update config and emit to server
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
  return useContext(ChimesConfigContext);
}
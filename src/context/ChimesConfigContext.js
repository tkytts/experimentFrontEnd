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
    // Ensure we request chimes when socket connects (covers late-mounted clients)
    const requestChimes = () => socket.emit("get chimes");
    socket.on("connect", requestChimes);

    const onChimesUpdated = (data) => {
      // Ignore invalid payloads
      if (!data || typeof data !== "object") return;

      // Merge incoming partial updates into current state to avoid overwriting with null/partial
      setChimesConfig((prev) => ({
        messageSent: typeof data.messageSent === "boolean" ? data.messageSent : prev.messageSent,
        messageReceived: typeof data.messageReceived === "boolean" ? data.messageReceived : prev.messageReceived,
        timer: typeof data.timer === "boolean" ? data.timer : prev.timer,
      }));
    };

    socket.on("chimes updated", onChimesUpdated);

    // Request chimes immediately in case socket is already connected
    requestChimes();

    return () => {
      socket.off("connect", requestChimes);
      socket.off("chimes updated", onChimesUpdated);
    };
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
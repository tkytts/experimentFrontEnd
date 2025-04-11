import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Experimenter from './Experimenter';
import Tutorial from './Tutorial';
import Participant from './Participant';

function App() {
  const [fontSize, setFontSize] = useState(16); // Default font size in pixels

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 2, 24)); // Limit max size
    document.documentElement.style.fontSize = `${Math.min(fontSize + 2, 24)}px`;
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 2, 12)); // Limit min size
    document.documentElement.style.fontSize = `${Math.max(fontSize - 2, 12)}px`;
  };

  return (
    <Router>
      <div className="font-size-controls" style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 1000 }}>
        <button onClick={increaseFontSize} className="btn btn-primary me-2">A+</button>
        <button onClick={decreaseFontSize} className="btn btn-secondary">A-</button>
      </div>
      <Routes>
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/experimenter" element={<Experimenter />} />
        <Route path="/participant" element={<Participant />} />
      </Routes>
    </Router>
  );
}

export default App;
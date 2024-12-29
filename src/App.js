import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Experimenter from './Experimenter';
import Tutorial from './Tutorial';
import Participant from './Participant';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/experimenter" element={<Experimenter />} />
        <Route path="/participant" element={<Participant />} />
      </Routes>
    </Router>
  );
}

export default App;
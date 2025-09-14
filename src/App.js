import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Experimenter from './components/Experimenter';
import Tutorial from './components/Tutorial';
import Participant from './components/Participant';
import { useTranslation } from "react-i18next";
import languages from './languages';
import Select from 'react-select';
import ReactCountryFlag from "react-country-flag";

function App() {
  const [fontSize, setFontSize] = useState(16);
  const { i18n } = useTranslation();

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 2, 24));
    document.documentElement.style.fontSize = `${Math.min(fontSize + 2, 24)}px`;
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 2, 12));
    document.documentElement.style.fontSize = `${Math.max(fontSize - 2, 12)}px`;
  };

  const currentLang = i18n.language || localStorage.getItem('language') || languages[0].value;

  const handleLanguageChange = (selected) => {
    i18n.changeLanguage(selected.value);
    localStorage.setItem('language', selected.value);
  };

  // Custom option rendering with SVG flag
  const formatOptionLabel = ({ countryCode, label }) => (
    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <ReactCountryFlag countryCode={countryCode} svg style={{ width: '1.5em', height: '1.5em' }} />
      <span>{label}</span>
    </span>
  );

  return (
    <Router>
      <div className="font-size-controls" style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 1000, display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button onClick={increaseFontSize} className="btn btn-primary">A+</button>
        <button onClick={decreaseFontSize} className="btn btn-secondary">A-</button>
        <div style={{ minWidth: 170 }}>
          <Select
            options={languages}
            value={languages.find(l => l.value === currentLang)}
            onChange={handleLanguageChange}
            formatOptionLabel={formatOptionLabel}
            isSearchable={false}
            styles={{
              control: (base) => ({
                ...base,
                minHeight: 32,
                fontSize: '1.1em'
              }),
              valueContainer: (base) => ({
                ...base,
                padding: '0 8px'
              }),
              dropdownIndicator: (base) => ({
                ...base,
                padding: 4
              }),
              option: (base, state) => ({
                ...base,
                fontSize: '1.1em',
                backgroundColor: state.isSelected ? '#e9ecef' : base.backgroundColor
              })
            }}
          />
        </div>
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
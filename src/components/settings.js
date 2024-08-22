// src/SettingsPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SettingsPage = ({ onSettingsChange }) => {
  const [theme, setTheme] = useState("light");
  const [wordLength, setWordLength] = useState(4);
  const [fontSize, setFontSize] = useState("16px");
  const [keyHighlightColor, setKeyHighlightColor] = useState("#000000");

  const navigate = useNavigate();

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    onSettingsChange({ theme: newTheme });
  };

  const handleSaveSettings = () => {
    onSettingsChange({ theme, wordLength, fontSize, keyHighlightColor });
    navigate("/");
  };

  return (
    <div className="container">
      <h1>Settings</h1>
      <div className="form-group">
        <label htmlFor="theme">Theme</label>
        <select
          id="theme"
          value={theme}
          onChange={(e) => handleThemeChange(e.target.value)}
          className="form-control"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="wordLength">Word Length</label>
        <input
          type="number"
          id="wordLength"
          value={wordLength}
          min="1"
          max="20"
          onChange={(e) => setWordLength(Number(e.target.value))}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label htmlFor="fontSize">Font Size</label>
        <input
          type="text"
          id="fontSize"
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label htmlFor="keyHighlightColor">Key Highlight Color</label>
        <input
          type="color"
          id="keyHighlightColor"
          value={keyHighlightColor}
          onChange={(e) => setKeyHighlightColor(e.target.value)}
          className="form-control"
        />
      </div>
      <button onClick={handleSaveSettings} className="btn btn-primary">
        Save Settings
      </button>
    </div>
  );
};

export default SettingsPage;

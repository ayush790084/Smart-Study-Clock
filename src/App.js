import React from "react";
import StudyClock from "./components/StudyClock";
import "./styles.css";

function App() {
  return (
    <div className="app">
      <h1 className="title">📖 Smart Study Clock</h1>
      <StudyClock />
    </div>
  );
}

export default App;
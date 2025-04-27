// src/App.jsx
import React, { useState } from "react";
import Toolbar from "./components/Toolbar";
import EditorArea from "./components/EditorArea";

function App() {
  const [content, setContent] = useState("<p>Start writing...</p>");

  const executeCommand = (command) => {
    document.execCommand(command, false, null);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6">Custom Rich Text Editor 🚀</h1>
      <Toolbar commands={executeCommand} />
      <EditorArea value={content} onChange={setContent} />
    </div>
  );
}

export default App;

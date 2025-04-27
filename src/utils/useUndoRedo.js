import { useState } from "react";

export function useUndoRedo() {
  const [history, setHistory] = useState([{ content: "" }]);
  const [index, setIndex] = useState(0);

  const addToHistory = (content) => {
    const newHistory = history.slice(0, index + 1);
    newHistory.push({ content });
    setHistory(newHistory);
    setIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const redo = () => {
    if (index < history.length - 1) {
      setIndex(index + 1);
    }
  };

  return { content: history[index]?.content, addToHistory, undo, redo };
}

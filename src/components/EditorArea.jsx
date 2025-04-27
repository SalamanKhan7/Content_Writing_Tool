import React, { useRef, useState, useEffect } from "react";
import FloatingHighlightToolbar from "./FloatingHighlightToolbar";
import SlashCommandMenu from "./SlashCommandMenu";
import MentionMenu from "./MentionMenu";

const EditorArea = ({ value, onChange }) => {
  const editorRef = useRef(null);

  // Undo/Redo Stacks
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const [mentionMenuPosition, setMentionMenuPosition] = useState(null);
  const [mentionQuery, setMentionQuery] = useState("");
  const [highlightPosition, setHighlightPosition] = useState(null);
  const [slashMenuPosition, setSlashMenuPosition] = useState(null);
  const [activeCommandIndex, setActiveCommandIndex] = useState(0);
  const [activeMentionIndex, setActiveMentionIndex] = useState(0);

  const saveToHistory = () => {
    const content = editorRef.current.innerHTML;
    setUndoStack((prev) => {
      const newStack = [...prev, content];
      // Limit history size (100 states)
      if (newStack.length > 100) newStack.shift();
      return newStack;
    });
    setRedoStack([]); // Clear redo stack when new changes happen
  };

  const handleInput = () => {
    if (onChange) {
      onChange(editorRef.current.innerHTML);
    }
    saveToHistory();
  };

  const undo = () => {
    setUndoStack((prevUndoStack) => {
      if (prevUndoStack.length === 0) return prevUndoStack;
      const lastState = prevUndoStack[prevUndoStack.length - 1];
      setRedoStack((prevRedoStack) => [
        ...prevRedoStack,
        editorRef.current.innerHTML,
      ]);
      editorRef.current.innerHTML = lastState;
      if (onChange) {
        onChange(lastState);
      }
      return prevUndoStack.slice(0, -1);
    });
  };

  const redo = () => {
    setRedoStack((prevRedoStack) => {
      if (prevRedoStack.length === 0) return prevRedoStack;
      const lastState = prevRedoStack[prevRedoStack.length - 1];
      setUndoStack((prevUndoStack) => [
        ...prevUndoStack,
        editorRef.current.innerHTML,
      ]);
      editorRef.current.innerHTML = lastState;
      if (onChange) {
        onChange(lastState);
      }
      return prevRedoStack.slice(0, -1);
    });
  };

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setHighlightPosition({
        top: rect.top + window.scrollY - 50,
        left: rect.left + window.scrollX,
      });
    } else {
      setHighlightPosition(null);
    }
  };

  const highlightSelection = (color) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const span = document.createElement("span");
    span.style.backgroundColor = color;
    span.className = "rounded-md px-1";
    range.surroundContents(span);

    selection.removeAllRanges();
    setHighlightPosition(null);
    handleInput();
  };

  const insertMention = (name) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const mention = document.createElement("span");
    mention.innerText = `@${name}`;
    mention.className =
      "bg-blue-100 text-blue-800 px-1 rounded-md cursor-pointer";
    mention.contentEditable = "false";

    range.deleteContents();
    range.insertNode(mention);
    range.collapse(false);

    setMentionMenuPosition(null);
    handleInput();
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === "z") {
      e.preventDefault();
      undo();
      return;
    }
    if (e.ctrlKey && e.shiftKey && e.key === "Z") {
      e.preventDefault();
      redo();
      return;
    }

    if (slashMenuPosition) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveCommandIndex((prev) => (prev + 1) % 5);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveCommandIndex((prev) => (prev - 1 + 5) % 5);
      }
      if (e.key === "Enter") {
        e.preventDefault();
        insertBlock(
          ["blockquote", "codeblock", "callout", "heading", "divider"][
            activeCommandIndex
          ]
        );
      }
    } else if (mentionMenuPosition) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveMentionIndex((prev) => (prev + 1) % 4);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveMentionIndex((prev) => (prev - 1 + 4) % 4);
      }
      if (e.key === "Enter") {
        e.preventDefault();
        insertMention(
          ["John Doe", "Jane Smith", "Alice Johnson", "Bob Brown"][
            activeMentionIndex
          ]
        );
      }
      if (e.key.length === 1) {
        setMentionQuery((prev) => prev + e.key);
      }
      if (e.key === "Backspace") {
        setMentionQuery((prev) => prev.slice(0, -1));
      }
    } else if (e.key === "/") {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSlashMenuPosition({
        top: rect.top + window.scrollY + 20,
        left: rect.left + window.scrollX,
      });
    } else if (e.key === "@") {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setMentionMenuPosition({
        top: rect.top + window.scrollY + 20,
        left: rect.left + window.scrollX,
      });
      setMentionQuery("");
    }
  };

  const insertBlock = (type) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);

    let node;
    switch (type) {
      case "blockquote":
        node = document.createElement("blockquote");
        node.className = "border-l-4 border-gray-300 pl-4 italic text-gray-600";
        node.innerText = "Blockquote text...";
        break;
      case "codeblock":
        node = document.createElement("pre");
        node.className = "bg-gray-100 p-2 rounded-md overflow-auto";
        node.innerText = "Code goes here...";
        break;
      case "callout":
        node = document.createElement("div");
        node.className = "bg-yellow-100 p-2 rounded-md";
        node.innerText = "💡 Callout content...";
        break;
      case "heading":
        node = document.createElement("h2");
        node.className = "text-2xl font-bold mt-4 mb-2";
        node.innerText = "Heading Title";
        break;
      case "divider":
        node = document.createElement("hr");
        node.className = "my-4 border-gray-300";
        break;
      default:
        break;
    }

    if (node) {
      range.deleteContents();
      range.insertNode(node);
      range.collapse(false);
    }

    setSlashMenuPosition(null);
    handleInput();
  };

  return (
    <div className="relative">
      <div className="flex gap-2 mb-2">
        <button
          onClick={undo}
          disabled={undoStack.length === 0}
          className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Undo
        </button>
        <button
          onClick={redo}
          disabled={redoStack.length === 0}
          className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Redo
        </button>
      </div>
      <FloatingHighlightToolbar
        position={highlightPosition}
        onSelectColor={highlightSelection}
      />
      <SlashCommandMenu
        position={slashMenuPosition}
        activeIndex={activeCommandIndex}
        onHover={setActiveCommandIndex}
        onSelect={insertBlock}
      />
      <MentionMenu
        position={mentionMenuPosition}
        query={mentionQuery}
        activeIndex={activeMentionIndex}
        onHover={setActiveMentionIndex}
        onSelect={(mention) => insertMention(mention.name)}
      />
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onMouseUp={handleMouseUp}
        onKeyDown={handleKeyDown}
        className="min-h-[400px] p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base bg-white"
        aria-label="Rich Text Editor"
      />
    </div>
  );
};

export default EditorArea;

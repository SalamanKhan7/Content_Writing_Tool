// src/components/Toolbar.jsx
import React from "react";

const Toolbar = ({ commands }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4 p-2 bg-gray-50 rounded-lg shadow-sm">
      <button
        onClick={() => commands("bold")}
        className="p-2 rounded-md hover:bg-gray-200 active:bg-gray-300"
        aria-label="Bold"
      >
        <b>B</b>
      </button>
      <button
        onClick={() => commands("italic")}
        className="p-2 rounded-md hover:bg-gray-200 active:bg-gray-300"
        aria-label="Italic"
      >
        <i>I</i>
      </button>
      <button
        onClick={() => commands("underline")}
        className="p-2 rounded-md hover:bg-gray-200 active:bg-gray-300"
        aria-label="Underline"
      >
        <u>U</u>
      </button>
      <button
        onClick={() => commands("strikeThrough")}
        className="p-2 rounded-md hover:bg-gray-200 active:bg-gray-300"
        aria-label="StrikeThrough"
      >
        <s>S</s>
      </button>
      {/* More buttons: Heading, List, Blockquote, etc */}
    </div>
  );
};

export default Toolbar;

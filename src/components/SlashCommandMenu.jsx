// src/components/SlashCommandMenu.jsx
import React from "react";

const COMMANDS = [
  { label: "Blockquote", type: "blockquote" },
  { label: "Code Block", type: "codeblock" },
  { label: "Callout Box", type: "callout" },
  { label: "Heading", type: "heading" },
  { label: "Divider", type: "divider" },
];

const SlashCommandMenu = ({ position, activeIndex, onSelect, onHover }) => {
  if (!position) return null;

  return (
    <div
      className="absolute bg-white rounded-md shadow-lg border border-gray-200 w-60"
      style={{ top: position.top, left: position.left }}
    >
      {COMMANDS.map((cmd, index) => (
        <div
          key={cmd.type}
          onMouseEnter={() => onHover(index)}
          onClick={() => onSelect(cmd.type)}
          className={`p-2 cursor-pointer ${
            index === activeIndex ? "bg-gray-100" : ""
          }`}
        >
          {cmd.label}
        </div>
      ))}
    </div>
  );
};

export default SlashCommandMenu;

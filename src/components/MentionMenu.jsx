// src/components/MentionMenu.jsx
import React from "react";

const MENTIONS = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Alice Johnson" },
  { id: 4, name: "Bob Brown" },
];

const MentionMenu = ({ position, query, activeIndex, onSelect, onHover }) => {
  if (!position) return null;

  const filtered = MENTIONS.filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase())
  );

  if (filtered.length === 0) return null;

  return (
    <div
      className="absolute bg-white rounded-md shadow-lg border border-gray-200 w-60"
      style={{ top: position.top, left: position.left }}
    >
      {filtered.map((mention, index) => (
        <div
          key={mention.id}
          onMouseEnter={() => onHover(index)}
          onClick={() => onSelect(mention)}
          className={`p-2 cursor-pointer ${
            index === activeIndex ? "bg-gray-100" : ""
          }`}
        >
          {mention.name}
        </div>
      ))}
    </div>
  );
};

export default MentionMenu;

// src/components/FloatingHighlightToolbar.jsx
import React from "react";

const colors = [
  { name: "Yellow", value: "#facc15" },
  { name: "Green", value: "#4ade80" },
  { name: "Pink", value: "#f472b6" },
];

const FloatingHighlightToolbar = ({ position, onSelectColor }) => {
  if (!position) return null;

  return (
    <div
      className="absolute bg-white p-2 rounded-md shadow-lg border border-gray-200 flex gap-2"
      style={{ top: position.top, left: position.left }}
    >
      {colors.map((color) => (
        <button
          key={color.name}
          className="w-6 h-6 rounded-full border-2"
          style={{ backgroundColor: color.value }}
          onClick={() => onSelectColor(color.value)}
          title={color.name}
        />
      ))}
    </div>
  );
};

export default FloatingHighlightToolbar;

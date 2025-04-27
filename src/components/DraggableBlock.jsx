import { useState } from "react";

export default function DraggableBlock({ children, onDrop }) {
  const [dragging, setDragging] = useState(false);

  const handleDragStart = (e) => {
    setDragging(true);
    e.dataTransfer.setData("text", "dragging");
  };

  const handleDragEnd = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    onDrop();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={`p-4 my-2 rounded shadow-sm border ${
        dragging ? "bg-gray-100" : ""
      }`}
    >
      {children}
    </div>
  );
}

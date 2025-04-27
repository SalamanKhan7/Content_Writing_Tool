import { useState } from "react";

export default function EditableList({ type, children }) {
  const [items, setItems] = useState(children || [""]);

  const handleInputChange = (index, e) => {
    const newItems = [...items];
    newItems[index] = e.target.value;
    setItems(newItems);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Tab") {
      e.preventDefault();
      if (e.shiftKey) {
        // Shift + Tab: Decrease indentation
        setItems((prevItems) => {
          if (index > 0) {
            const updated = [...prevItems];
            updated.splice(index, 1);
            updated.splice(index - 1, 0, prevItems[index]);
            return updated;
          }
          return prevItems;
        });
      } else {
        // Tab: Increase indentation
        setItems((prevItems) => {
          if (index < prevItems.length - 1) {
            const updated = [...prevItems];
            updated.splice(index, 1);
            updated.splice(index + 1, 0, prevItems[index]);
            return updated;
          }
          return prevItems;
        });
      }
    }
  };

  return (
    <div className="pl-4">
      <ul className={type === "ordered" ? "list-decimal" : "list-disc"}>
        {items.map((item, idx) => (
          <li key={idx}>
            <input
              type="text"
              value={item}
              onChange={(e) => handleInputChange(idx, e)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className="border rounded p-2"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

import { useEffect, useState } from "react";

const users = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Alice Smith" },
  { id: 3, name: "Bob Johnson" },
];

export default function MentionDropdown({ position, onMention }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(users);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % results.length);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + results.length) % results.length
        );
      }
      if (e.key === "Enter") {
        e.preventDefault();
        onMention(results[selectedIndex]);
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [selectedIndex, results, onMention]);

  useEffect(() => {
    setResults(
      users.filter((u) => u.name.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query]);

  return (
    <div
      style={{
        top: position.top + 20,
        left: position.left,
      }}
      className="absolute bg-white border rounded shadow-md w-48 p-2 z-50"
    >
      <input
        autoFocus
        type="text"
        placeholder="Search user..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-1 w-full mb-2 rounded text-sm"
      />
      {results.map((user, idx) => (
        <div
          key={user.id}
          className={`p-2 rounded cursor-pointer ${
            selectedIndex === idx ? "bg-blue-100" : ""
          }`}
          onClick={() => onMention(user)}
        >
          {user.name}
        </div>
      ))}
    </div>
  );
}

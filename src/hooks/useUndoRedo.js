import { useRef } from "react";

export function useUndoRedo(initialContent, setContent) {
  const stack = useRef([initialContent]);
  const index = useRef(0);

  const undo = () => {
    if (index.current > 0) {
      index.current -= 1;
      setContent(stack.current[index.current]);
    }
  };

  const redo = () => {
    if (index.current < stack.current.length - 1) {
      index.current += 1;
      setContent(stack.current[index.current]);
    }
  };

  const saveState = (content) => {
    stack.current = stack.current.slice(0, index.current + 1);
    stack.current.push(content);
    index.current++;
  };

  return { undo, redo, saveState };
}

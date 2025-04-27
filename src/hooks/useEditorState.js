import { useContext, useEffect, useState } from "react";
import { EditorContext } from "../context/EditorContext";

export function useEditorState() {
  const { setContent, contentRef, saveState } = useContext(EditorContext);
  const [slashMenu, setSlashMenu] = useState(null);
  const [mentionMenu, setMentionMenu] = useState(null);

  const handleInput = () => {
    const html = contentRef.current.innerHTML;
    setContent(html);
    saveState(html);
  };

  const handleKeyDown = (e) => {
    if (e.metaKey || e.ctrlKey) {
      if (e.key === "b") {
        e.preventDefault();
        document.execCommand("bold");
      }
      if (e.key === "i") {
        e.preventDefault();
        document.execCommand("italic");
      }
      if (e.key === "u") {
        e.preventDefault();
        document.execCommand("underline");
      }
    }

    if (e.key === "/") {
      const rect = window
        .getSelection()
        ?.getRangeAt(0)
        ?.getBoundingClientRect();
      if (rect) {
        setSlashMenu({
          position: {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
          },
        });
      }
    }

    if (e.key === "@") {
      const rect = window
        .getSelection()
        ?.getRangeAt(0)
        ?.getBoundingClientRect();
      if (rect) {
        setMentionMenu({
          position: {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
          },
        });
      }
    }
  };

  const selectSlashCommand = (cmd) => {
    document.execCommand("insertText", false, cmd.label + " ");
    setSlashMenu(null);
  };

  const selectMention = (user) => {
    document.execCommand("insertText", false, `@${user.name} `);
    setMentionMenu(null);
  };

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML =
        localStorage.getItem("doc") || "Type here...";
    }
  }, []);

  return {
    contentRef,
    handleInput,
    handleKeyDown,
    slashMenu,
    mentionMenu,
    selectSlashCommand,
    selectMention,
  };
}

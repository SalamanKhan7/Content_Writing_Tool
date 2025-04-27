export function saveContent(content) {
  localStorage.setItem("doc", content);
}

export function loadContent() {
  return localStorage.getItem("doc");
}

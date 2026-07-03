export function focusSearch() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  document.getElementById("yv-search-input")?.focus();
}

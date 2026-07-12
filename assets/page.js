const quotes = [
  "GOOD DAY, Dr.",
  "Have fun, Dr.",
  "Take a break.",
  "Nice work.",
  "This page is under construction."
];

function applyTheme(theme) {
  const isDay = theme === "day";
  document.body.classList.toggle("day", isDay);

  const button = document.getElementById("themeButton");
  if (button) {
    button.textContent = isDay ? "Night" : "Day";
    button.setAttribute(
      "aria-label",
      isDay ? "切换到夜间模式" : "切换到日间模式"
    );
  }

  localStorage.setItem("e2eryPublicTheme", theme);
}

const themeButton = document.getElementById("themeButton");
if (themeButton) {
  themeButton.addEventListener("click", () => {
    applyTheme(document.body.classList.contains("day") ? "night" : "day");
  });
}

let themeDragStartY = null;
let themeDragStartX = null;
let themeDragTriggered = false;

function shouldIgnoreThemeDrag(event) {
  return Boolean(event.target.closest("input, textarea, button, select, option"));
}

function startThemeDrag(event) {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  if (shouldIgnoreThemeDrag(event)) return;

  themeDragStartY = event.clientY;
  themeDragStartX = event.clientX;
  themeDragTriggered = false;
  document.body.classList.add("theme-dragging");
}

function moveThemeDrag(event) {
  if (themeDragStartY === null || themeDragStartX === null) return;

  const dy = event.clientY - themeDragStartY;
  const dx = event.clientX - themeDragStartX;

  if (Math.abs(dy) > 8) event.preventDefault();
  if (Math.abs(dy) < 90) return;
  if (Math.abs(dy) < Math.abs(dx) * 1.2) return;

  applyTheme(dy > 0 ? "night" : "day");
  themeDragTriggered = true;
  themeDragStartY = null;
  themeDragStartX = null;
}

function endThemeDrag() {
  document.body.classList.remove("theme-dragging");
  themeDragStartY = null;
  themeDragStartX = null;
}

document.addEventListener("pointerdown", startThemeDrag);
document.addEventListener("pointermove", moveThemeDrag, { passive: false });
document.addEventListener("pointerup", endThemeDrag);
document.addEventListener("pointercancel", endThemeDrag);

document.addEventListener("click", event => {
  if (themeDragTriggered) {
    event.preventDefault();
    event.stopPropagation();
    themeDragTriggered = false;
  }
}, true);

const savedTheme = localStorage.getItem("e2eryPublicTheme");
const systemPrefersDay = window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: light)").matches;

applyTheme(savedTheme || (systemPrefersDay ? "day" : "night"));

const quote = document.getElementById("quote");
if (quote) {
  quote.textContent = quotes[Math.floor(Math.random() * quotes.length)];
}

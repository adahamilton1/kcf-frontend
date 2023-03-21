import {
  isCurrentlyDarkMode,
  setAndSaveIsDarkMode,
} from "@/js/common/darkMode";

const ID = "dark-mode-toggle-button";

function toggleDarkMode() {
  const curr = isCurrentlyDarkMode();
  const next = !curr;
  setAndSaveIsDarkMode(next);
}

function onPageParsed() {
  // @ts-ignore
  document.getElementById(ID).addEventListener("click", toggleDarkMode);
}

onPageParsed();

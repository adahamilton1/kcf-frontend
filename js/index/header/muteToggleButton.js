import { rerenderImg } from "@/js/common/darkMode";
import { isCurrentlyMuted, setAndSaveIsMuted } from "@/js/common/muted";

const ID = "mute-toggle-button";
const ICON_ID = "mute-toggle-button-icon";

function toggleMute() {
  const curr = isCurrentlyMuted();
  const next = !curr;
  setAndSaveIsMuted(next);
}

function rerenderIcon() {
  /** @type {HTMLImageElement} */
  // @ts-ignore
  const icon = document.getElementById(ICON_ID);
  const newIsMuted = isCurrentlyMuted();
  icon.setAttribute(
    "data-dark-img-src",
    newIsMuted
      ? "/images/icons/muted_white.svg"
      : "/images/icons/unmuted_white.svg"
  );
  icon.setAttribute(
    "data-light-img-src",
    newIsMuted
      ? "/images/icons/muted_black.svg"
      : "/images/icons/unmuted_black.svg"
  );
  rerenderImg(icon);
}

function onPageParsed() {
  // @ts-ignore
  document.getElementById(ID).addEventListener("click", () => {
    toggleMute();
    rerenderIcon();
  });
  // to apply loaded isMuted settings
  rerenderIcon();
}

onPageParsed();

import { setupDialog } from "@/js/index/dialogs/listeners";

function onPageParsed() {
  document.querySelectorAll("dialog").forEach(setupDialog);
}

onPageParsed();

/**
 * Source of truth is always data-attribute of parent <fieldset>
 */

import { ATTR_ONLY_OBSERVER_OPTIONS } from "@/js/common/consts";
import { zeroOneStrToBool } from "@/js/common/utils";
import {
  onClickGen,
  onDataChangedGen,
  setSelectedClassForButtons,
} from "@/js/index/flipForm/common";

const CHOICE_FIELDSET_ID = "choice-fieldset";

const DATA_CHOICE_IS_HEADS_KEY = "data-choice-is-heads";

// tailwind preprocessor can only detect const strings,
// not template-interpolated ones
const ROTATE_Y_180_CLASS = "rotate-y-180";
const ROTATE_Y_0_CLASS = "rotate-y-0";
const HOVER_ROTATE_Y_180_CLASS = "hover:rotate-y-180";
const FOCUS_ROTATE_Y_180_CLASS = "focus:rotate-y-180";
const HOVER_ROTATE_Y_0_CLASS = "hover:rotate-y-0";
const FOCUS_ROTATE_Y_0_CLASS = "focus:rotate-y-0";

/**
 * @returns {HTMLFieldSetElement}
 */
export function getChoiceFieldset() {
  const res = document.getElementById(CHOICE_FIELDSET_ID);
  if (!res) {
    throw new Error("choice fieldset undefined");
  }
  // @ts-ignore
  return res;
}

/**
 *
 * @returns {boolean}
 */
export function getCurrentChoiceIsHeads() {
  const val = getChoiceFieldset().getAttribute(DATA_CHOICE_IS_HEADS_KEY);
  if (val === null || val === undefined) {
    throw new Error("choice is heads is null");
  }
  return zeroOneStrToBool(val);
}

/**
 *
 * @param {boolean} isHeads
 */
function setHeroFlip(isHeads) {
  const heroImg = document.getElementById("hero-image");
  if (!heroImg) {
    throw new Error("heroImg null");
  }
  // tailwind preprocessor can only detect const strings,
  // not template-interpolated ones
  if (isHeads) {
    heroImg.classList.remove(ROTATE_Y_180_CLASS);
    heroImg.classList.remove(HOVER_ROTATE_Y_0_CLASS);
    heroImg.classList.remove(FOCUS_ROTATE_Y_0_CLASS);
    heroImg.classList.add(ROTATE_Y_0_CLASS);
    heroImg.classList.add(HOVER_ROTATE_Y_180_CLASS);
    heroImg.classList.add(FOCUS_ROTATE_Y_180_CLASS);
  } else {
    heroImg.classList.remove(ROTATE_Y_0_CLASS);
    heroImg.classList.remove(HOVER_ROTATE_Y_180_CLASS);
    heroImg.classList.remove(FOCUS_ROTATE_Y_180_CLASS);
    heroImg.classList.add(ROTATE_Y_180_CLASS);
    heroImg.classList.add(HOVER_ROTATE_Y_0_CLASS);
    heroImg.classList.add(FOCUS_ROTATE_Y_0_CLASS);
  }
}

function onPageParsed() {
  /** @type {HTMLFieldSetElement} */
  // @ts-ignore
  const choiceFieldset = getChoiceFieldset();
  new MutationObserver(onDataChangedGen(DATA_CHOICE_IS_HEADS_KEY)).observe(
    choiceFieldset,
    ATTR_ONLY_OBSERVER_OPTIONS
  );
  new MutationObserver((mutationList) => {
    mutationList.forEach(({ attributeName }) => {
      if (attributeName !== DATA_CHOICE_IS_HEADS_KEY) {
        return;
      }
      setHeroFlip(getCurrentChoiceIsHeads());
    });
  }).observe(choiceFieldset, ATTR_ONLY_OBSERVER_OPTIONS);
  // initial settings: head
  setHeroFlip(true);
  // choice buttons
  setSelectedClassForButtons(choiceFieldset, DATA_CHOICE_IS_HEADS_KEY);
  const choiceOnClickCb = onClickGen(DATA_CHOICE_IS_HEADS_KEY);
  choiceFieldset.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", choiceOnClickCb);
  });
}

onPageParsed();

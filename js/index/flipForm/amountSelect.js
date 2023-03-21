/**
 * Source of truth is always data-attribute of parent <fieldset>
 */

import { ATTR_ONLY_OBSERVER_OPTIONS } from "@/js/common/consts";
import {
  onClickGen,
  onDataChangedGen,
  setSelectedClassForButtons,
} from "@/js/index/flipForm/common";

const AMOUNT_FIELDSET_ID = "amount-fieldset";

const DATA_AMOUNT_KEY = "data-amount";

// tailwind preprocessor can only detect const strings,
// not conditional lets
// can only have 1 css transform, which we are using for
// rotate-y already so change size by changing width (aspect-square)
const SIZE_1_CLASS = "w-5/12";
const SIZE_2_CLASS = "w-6/12";
const SIZE_5_CLASS = "w-7/12";
const SIZE_10_CLASS = "w-8/12";
const SIZE_20_CLASS = "w-9/12";
const SIZE_50_CLASS = "w-10/12";

/**
 * @returns {HTMLFieldSetElement}
 */
export function getAmountFieldset() {
  const res = document.getElementById(AMOUNT_FIELDSET_ID);
  if (!res) {
    throw new Error("choice fieldset undefined");
  }
  // @ts-ignore
  return res;
}

/**
 *
 * @returns {number}
 */
export function getCurrentAmount() {
  const val = getAmountFieldset().getAttribute(DATA_AMOUNT_KEY);
  if (val === null || val === undefined) {
    throw new Error("amount is null");
  }
  return Number(val);
}

/**
 *
 * @param {number} kdaAmount
 */
function setHeroScale(kdaAmount) {
  const heroImg = document.getElementById("hero-image");
  if (!heroImg) {
    throw new Error("heroImg null");
  }
  // filter doesnt exist on DOMTokenList
  const currentScales = [];
  for (const c of heroImg.classList) {
    if (c.startsWith("w-")) {
      currentScales.push(c);
    }
  }
  currentScales.forEach((scaleClass) => heroImg.classList.remove(scaleClass));
  /** @type {string} */
  let newScaleClass;
  switch (kdaAmount) {
    case 1:
      newScaleClass = SIZE_1_CLASS;
      break;
    case 2:
      newScaleClass = SIZE_2_CLASS;
      break;
    case 5:
      newScaleClass = SIZE_5_CLASS;
      break;
    case 10:
      newScaleClass = SIZE_10_CLASS;
      break;
    case 20:
      newScaleClass = SIZE_20_CLASS;
      break;
    case 50:
      newScaleClass = SIZE_50_CLASS;
      break;
    default:
      throw new Error(`Unexpected amount ${kdaAmount}`);
  }
  heroImg.classList.add(newScaleClass);
}

function onPageParsed() {
  /** @type {HTMLFieldSetElement} */
  // @ts-ignore
  const amountFieldset = getAmountFieldset();
  new MutationObserver(onDataChangedGen(DATA_AMOUNT_KEY)).observe(
    amountFieldset,
    ATTR_ONLY_OBSERVER_OPTIONS
  );
  new MutationObserver((mutationList) => {
    mutationList.forEach(({ attributeName }) => {
      if (attributeName !== DATA_AMOUNT_KEY) {
        return;
      }
      setHeroScale(getCurrentAmount());
    });
  }).observe(amountFieldset, ATTR_ONLY_OBSERVER_OPTIONS);
  // initial settings: 1 KDA
  setHeroScale(1);
  // amount buttons
  setSelectedClassForButtons(amountFieldset, DATA_AMOUNT_KEY);
  const amountOnClickCb = onClickGen(DATA_AMOUNT_KEY);
  amountFieldset.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", amountOnClickCb);
  });
}

onPageParsed();

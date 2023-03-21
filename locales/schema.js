/**
 * Typedef for i18n schema to ensure all i18n keys are implemented for each lang
 * @typedef {Object} I18nSchema
 * @property {CommonI18nSchema} common
 * @property {LandingI18nSchema} landing
 */

/**
 * Common i18n words and terms
 * @typedef {Object} CommonI18nSchema
 * @property {string} selectLanguage "select language"
 * @property {OtherLangs} otherLangs
 */

/**
 * Other languages in the selected language
 * @typedef {Object} OtherLangs
 * @property {string} en
 */

/**
 * i18n values for the landing page (index.html)
 * @typedef {Object} LandingI18nSchema
 * @property {string} title <title>
 * @property {string} h1 the main h1 header
 */

const THIS_MAKES_THIS_FILE_A_MODULE = true;
export default THIS_MAKES_THIS_FILE_A_MODULE;

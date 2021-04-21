import * as Localization from "expo-localization";
import i18n from "i18n-js";
import {en, fr, rn } from "../translations";

// Set the key-value pairs for the different language support
i18n.translations = {
  en: en,
  fr: fr,
  rn: rn
}

// Set the locale once at the beginning of your app.
// Localization.locale = fr-BE and i18n need only the first part
i18n.locale = Localization.locale.split('-')[0];

// When a value is missing from a language it'll fallback to another language with the key present.
i18n.fallbacks = true;

export default i18n;


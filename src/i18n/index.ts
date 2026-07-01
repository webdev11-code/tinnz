import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationID from "./locales/id.json";
import translationEN from "./locales/en.json";

const resources = {
  id: {
    translation: translationID,
  },
  en: {
    translation: translationEN,
  },
};

const savedLang = localStorage.getItem("tinnz_lang") || "id";

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang,
    fallbackLng: "id",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

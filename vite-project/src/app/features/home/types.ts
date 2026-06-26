import type { AppLanguage } from "@/app/context/LanguageContext";
import type { homeText } from "@/app/i18n";

export type HomeText = (typeof homeText)[AppLanguage];

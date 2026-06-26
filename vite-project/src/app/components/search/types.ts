import type { AppLanguage } from "@/app/context/LanguageContext";
import type { searchModalText } from "@/app/i18n";

export type SearchModalText = (typeof searchModalText)[AppLanguage];

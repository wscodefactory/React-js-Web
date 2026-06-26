import type { AppLanguage } from "@/app/context/LanguageContext";
import type { shellText } from "@/app/i18n";

export type HeaderShellText = (typeof shellText)[AppLanguage];

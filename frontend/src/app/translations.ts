import en from "../locales/en.json";
import vi from "../locales/vi.json";
import cn from "../locales/cn.json";
import kr from "../locales/kr.json";
import fr from "../locales/fr.json";
import jp from "../locales/jp.json";

export type SupportedLang = "en" | "vi" | "cn" | "kr" | "fr" | "jp";

export type Translations = typeof en;

export const translations: Record<SupportedLang, Translations> = {
  en,
  vi: vi as Translations,
  cn: cn as Translations,
  kr: kr as Translations,
  fr: fr as Translations,
  jp: jp as Translations,
};

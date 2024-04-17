import { ITrConfig } from "./contracts";
import { TrLocal } from "./locale/tr-local";
/**
 * Trivule default configuration file
 */
export const TrConfig: ITrConfig = {
  invalidClass: "is-invalid", // Default invalid class for all input
  validClass: "", //Default valid class for all input
  local: {
    lang: TrLocal.DEFAULT_LANG,
  },
};

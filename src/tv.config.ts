import { ITvConfig } from "./contracts";
import { TvLocal } from "./locale/tv-local";
/**
 * Trivule default configuration file
 */
export const TvConfig: ITvConfig = {
  invalidClass: "is-invalid", // Default invalid class for all input
  validClass: "", //Default valid class for all input
  local: {
    lang: TvLocal.DEFAULT_LANG,
  },
};

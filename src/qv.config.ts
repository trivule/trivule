import { IQvConfig } from "./contracts";
import { QvLocal } from "./locale/qv-local";
/**
 * Quickv default configuration file
 */
export const QvConfig: IQvConfig = {
  invalidClass: "is-invalid", // Default invalid class for all input
  validClass: "", //Default valid class for all input
  local: {
    lang: QvLocal.DEFAULT_LANG,
  },
};

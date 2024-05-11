/**
 * Configuration interface
 */
export interface ITrConfig {
  invalidClass?: string;
  validClass?: string;
  local?: {
    lang: string;
  };
  realTime?: boolean;
}

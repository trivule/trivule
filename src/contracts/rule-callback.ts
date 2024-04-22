import { InputType } from ".";

/**
 * Rule callback
 */
export interface RuleCallBack {
  (input: any, param?: any, type?: InputType): boolean;
}

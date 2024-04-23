import { InputType, ValidationState } from ".";

/**
 * Rule callback
 */
export interface RuleCallBack {
  (input: any, param?: any, type?: InputType): ValidationState;
}

import { Rule } from "./rule";

export interface ITrivuleInputObject {
  value: any;
  name: string;
  valid: boolean;
  rules: Rule[];
  ruleExecuted: {
    rule: string;
    passed: boolean;
  }[];
}

export type InputType =
  | "text"
  | "date"
  | "boolean"
  | "number"
  | "file"
  | "date-local";
export type ValidationState = {
  passes: boolean;
  value: any;
  alias?: Rule;
  type?: InputType;
};
export * from "./rule";
export * from "./input-change-event";
export * from "./rule-callback";
export * from "./rules-bag.interface";
export * from "./config";
export * from "./types";

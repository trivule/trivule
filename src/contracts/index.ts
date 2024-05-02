import { Rule } from "./rule";

export interface ITrivuleInputObject {
  value: any;
  name: string;
  valid: boolean;
  rules: Rule[];
  errors: Record<Rule, string>;
  messages: string[];
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
  message?: string[];
};
export * from "./rule";
export * from "./input-change-event";
export * from "./rule-callback";
export * from "./rules-bag.interface";
export * from "./config";
export * from "./types";

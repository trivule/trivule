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
  | "string"
  | "date"
  | "boolean"
  | "number"
  | "file"
  | "date-local";
export * from "./rule";
export * from "./input-change-event";
export * from "./rule-callback";
export * from "./rules-bag.interface";
export * from "./config";
export * from "./types";

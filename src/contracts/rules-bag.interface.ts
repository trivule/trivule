import { Rule } from ".";
import { RuleCallBack } from "./rule-callback";

export type RulesBag = {
  [ruleName in Rule]: RuleCallBack;
};

export type RulesMessages = {
  [key: string]: string;
};

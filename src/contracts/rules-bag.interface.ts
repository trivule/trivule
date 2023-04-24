import { RuleCallBack } from "./rule-callback";
import { Rule } from "./rules";

export type RulesBag = {
  [ruleName in Rule]: RuleCallBack;
};

export type RulesMessages = {
  [ruleName in Rule]: string;
};

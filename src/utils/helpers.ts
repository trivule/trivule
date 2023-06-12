import { Rule } from "../contracts";

export const getRule = (
  rule: string
): { ruleName: Rule; params: string | undefined } => {
  const regex = /^(\w+):(.+)$/;
  const match = rule.match(regex);

  if (match) {
    const ruleName = match[1] as Rule;
    let params = match[2];
    return { ruleName, params };
  } else {
    const [ruleName, params] = rule.split(":") as [Rule, string | undefined];
    return { ruleName, params };
  }
};

export const eliminateDuplicates = (rules: string[]): string[] => {
  return rules.reduce((accumulator: string[], currentValue) => {
    const [currentRule, currentRuleValue] = currentValue.split(":");

    const existingRuleIndex = accumulator.findIndex((rule) => {
      const [existingRule, existingRuleValue] = rule.split(":");
      return existingRule === currentRule;
    });

    if (existingRuleIndex === -1) {
      accumulator.push(currentValue);
    } else {
      accumulator[existingRuleIndex] = currentValue;
    }

    return accumulator;
  }, []);
};

export const spliteParam = (value: string, carac: string = ","): any[] => {
  if (typeof value !== "string") {
    return [];
  }

  return value.split(carac).map((v) => v.trim());
};

export const throwEmptyArgsException = (fnc: string) => {
  throw new Error(`Please provide <<${fnc}>> rule arguments`);
};

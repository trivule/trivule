import { Rule, RulesBag } from "../contracts";
import { QvBag } from "./qv-bag";
import { getRule } from "../utils";
/**
 * @author Claude Fassinou
 */
export class QValidation {
  private rulesBag: RulesBag = QvBag.allRules();

  private errors: Rule[] = [];

  validate(input: any, rules: Rule[]) {
    if (!Array.isArray(rules)) {
      throw new Error("The rule provided must be an array of Rule");
    }

    rules.forEach((rule) => {
      const { ruleName, params } = this.getRule(rule);
      const ruleCallback = this.rulesBag[ruleName];

      if (!ruleCallback) {
        throw new Error(`The rule ${ruleName} is not defined`);
      }

      const isValid = ruleCallback(input, params);
      if (!isValid) {
        this.errors.push(ruleName);
      }
    });
    return !this.hasErrors();
  }

  getRule(rule: string) {
    return getRule(rule);
  }

  getErrors(): Rule[] {
    return this.errors;
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  isValid() {
    return !this.hasErrors();
  }

  setRules(rules: RulesBag) {
    this.rulesBag = { ...this.rulesBag, ...rules };
  }

  getRules() {
    return this.rulesBag;
  }
}

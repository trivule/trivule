import { QValidation } from ".";
import { Rule, RuleCallBack } from "../contracts";
import { QvMessages } from "../messages";
import { QvBag } from "./qv-bag";
/**
 * @author Claude Fassinou
 */
export class Qvalidator {
  errors: Record<string, string[]> = {};

  static rulesBag = QvBag.allRules();

  /**
   * Validates a set of inputs according to a set of rules.
   *
   * @param rules The rules to apply for each input.
   * @param inputs The inputs to validate.
   */
  static make(
    rules: Record<string, Rule[]>,
    inputs: Record<string, unknown>,
    qvMesssages?: QvMessages
  ): Qvalidator {
    const validator = new Qvalidator();

    for (const [inputName, inputRules] of Object.entries(rules)) {
      const inputValue = inputs[inputName];
      const validation = new QValidation();

      if (!Array.isArray(inputRules)) {
        throw new Error("The validator input must be an array");
      }

      const isValid = validation.validate(inputValue, inputRules);

      if (!isValid) {
        const qvMessages = qvMesssages ?? new QvMessages();
        const currentInputErrors: string[] = [];

        for (const errorRule of validation.getErrors()) {
          const rule = inputRules.find((r) => r.startsWith(errorRule));

          if (rule) {
            const ruleWithParams = validation.getRule(rule);

            //This will help qvMessages.parseMessage to parse :field
            const params = ruleWithParams.params;
            const message = qvMessages.parseMessage(
              inputName,
              rule,
              qvMessages.getRulesMessages([errorRule])[0],
              params
            );

            currentInputErrors.push(message);
          }
        }

        validator.errors[inputName] = currentInputErrors;
      }
    }

    return validator;
  }

  /**
   * Validates an input according to a single rule.
   *
   * @param input The input to validate.
   * @param rule The rule to apply.
   */
  static valid(input: unknown, rule: Rule[]): boolean {
    if (!Array.isArray(rule)) {
      throw new Error("The validator input must be an array");
    }

    const validation = new QValidation();

    validation.validate(input, rule);

    return validation.isValid();
  }
  /**
   * Return true if validation failed
   * @returns
   */
  fails(): boolean {
    return Object.keys(this.errors).length > 0;
  }

  /**
   * Get validations errors messages
   * @returns
   */
  getMessages(): Record<string, string[]> {
    return this.errors;
  }

  /**
   * Return true if data is valids
   * @returns
   */
  isValid() {
    return !this.fails();
  }

  rule(ruleName: string, call: RuleCallBack, message?: string) {
    QvBag.rule(ruleName, call, message);
  }
}

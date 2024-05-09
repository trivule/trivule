import { Rule, RuleCallBack } from "../../contracts";
import { BaseInputRule } from "./base-input-rule";

export class InputRule extends BaseInputRule {
  constructor(
    rules: Rule[] | string[] | Rule | string,
    messages?: string | string[] | Record<string, string> | null
  ) {
    super(rules, messages);
  }

  all() {
    return this.get();
  }

  push(
    rule: string,
    message?: string | null,
    param?: any,
    validate?: RuleCallBack,
    local?: string
  ): this {
    this.add(rule, message, param, validate, local);
    return this;
  }
  getMessages() {
    return this.messages;
  }
}

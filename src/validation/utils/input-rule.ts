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

  has(rule: string | Rule): boolean {
    return this.items.some((item) => item.name === rule);
  }

  append(
    rule: string,
    message?: string | null,
    param?: any,
    validate?: RuleCallBack,
    local?: string
  ) {
    this.push(rule, message, param, validate, local);
    return this;
  }
  prepend(
    rule: string,
    message?: string | null,
    param?: any,
    validate?: RuleCallBack,
    local?: string
  ) {
    this.items.unshift(this.createRule(rule, message, validate, param, local));
    return this;
  }

  insertBefore(
    existingRule: string,
    newRule: string,
    message?: string | null,
    param?: any,
    validate?: RuleCallBack,
    local?: string
  ): this {
    const existingIndex = this.items.findIndex(
      (item) => item.name === existingRule
    );
    if (existingIndex !== -1) {
      this.items.splice(
        existingIndex,
        0,
        this.createRule(newRule, message, validate, param, local)
      );
    }
    return this;
  }

  insertAfter(
    existingRule: string,
    newRule: string,
    message?: string | null,
    param?: any,
    validate?: RuleCallBack,
    local?: string
  ): this {
    const existingIndex = this.items.findIndex(
      (item) => item.name === existingRule
    );
    if (existingIndex !== -1) {
      this.items.splice(
        existingIndex + 1,
        0,
        this.createRule(newRule, message, validate, param, local)
      );
    }
    return this;
  }
}

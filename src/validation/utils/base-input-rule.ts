import { Rule, RuleCallBack, RuleParam, RuleType } from '../../contracts';
import { getRule } from '../../utils';
import { TrMessage, TrRule } from '../tr-bag';

export abstract class BaseInputRule {
  items: RuleType[] = [];
  messages: Record<string, string> = {};
  constructor(
    rules: Rule[] | string[] | Rule | string,
    messages?: string | string[] | Record<string, string> | null,
    private local?: string,
  ) {
    this.set(rules, messages, local);
  }

  remove(rule: string): this {
    const { ruleName } = getRule(rule);
    this.items = this.items.filter((item) => item.name !== ruleName);
    return this;
  }

  get() {
    return this.items;
  }
  get length() {
    return this.items.length;
  }
  atIndex(index: number) {
    return this.items[index];
  }
  clear() {
    this.items = [];
    return this;
  }
  ruleNameAsArray() {
    return this.items.map((rule) => rule.name);
  }
  messageAsArray() {
    return this.items.map((rule) => rule.message);
  }

  add(
    rule: string | Rule,
    message?: string | null,
    param?: RuleParam,
    validate?: RuleCallBack,
    local?: string,
  ) {
    if (this.has(rule)) {
      this.remove(rule);
    }
    this.items.push(this.createRule(rule, message, param, validate, local));
    return this;
  }
  has(rule: string | Rule): boolean {
    const { ruleName } = getRule(rule);
    return this.items.some((item) => item.name === ruleName);
  }

  createRule(
    originaleRule: string,
    message?: string | null,
    param?: RuleParam,
    validate?: RuleCallBack,
    local?: string,
  ): RuleType {
    const { ruleName, params } = getRule(originaleRule);

    if (!message) {
      message = TrMessage.get(ruleName, local);
    }
    const ruleCallback = TrRule.get(ruleName);
    validate = validate ?? ruleCallback;

    if (!validate) {
      throw new Error(`The rule ${ruleName} is not defined`);
    }
    this.messages[ruleName] = message;

    return {
      name: ruleName,
      message,
      params: param ?? params,
      validate,
    };
  }

  protected toArrayOrObject(
    messages?: string | string[] | Record<string, string> | null,
  ) {
    return ((Array.isArray(messages)
      ? messages
      : typeof messages === 'string'
        ? messages.split('|').map((r) => r.trim())
        : messages) ?? []) as string[] | Record<string, string>;
  }

  protected _sanitizeMessage(message?: string | null) {
    if (!message) {
      return message;
    }
    const regex = /{(\d+(?:,\s*\d+)*)}/g;
    // Iterate through each message and replace the regex pattern with an empty string
    return message.replace(regex, '');
  }

  /**
   *
   * Go catuper {1,2...} and transform them into an array
   * @param str
   * @returns
   */
  convertAcoladeGroupToArray(str: string) {
    const regex = /{(\d+(?:,\s*\d+)*)}/g;
    const matches = [...str.matchAll(regex)].map((match) =>
      match[1].split(',').map((num) => parseInt(num.trim())),
    );
    return matches[0] ?? [];
  }
  set(
    rules: Rule[] | string[] | Rule | string,
    messages?: string | string[] | Record<string, string> | null,
    local?: string,
  ) {
    rules = Array.isArray(rules)
      ? rules.map((r) => r.trim())
      : rules.split('|').map((r) => r.trim());
    //Convert to object or array
    messages = this.toArrayOrObject(messages);
    for (let i = 0; i < rules.length; i++) {
      const originaleRule = rules[i];
      let message: string | null = null;
      const { ruleName, params } = getRule(originaleRule);
      if (Array.isArray(messages)) {
        const indexes = this.convertAcoladeGroupToArray(messages[i] ?? '');
        for (const ii of indexes) {
          messages[ii] = this._sanitizeMessage(messages[i]) as string;
        }
        message = messages[i];
      } else if (typeof messages === 'object') {
        message = this._sanitizeMessage(messages[ruleName]) ?? null;
      }

      this.add(ruleName, message, params, undefined, local);
    }
    return this;
  }

  map<T = unknown>(call: (r: RuleType, i: number) => T) {
    return this.items.map(call);
  }

  replace(outgoing: string, incoming: string) {
    const { ruleName } = getRule(outgoing);
    const index = this.items.findIndex((r) => r.name === ruleName);
    if (index !== -1) {
      this.items[index] = this.createRule(incoming);
    }
    return this;
  }
}

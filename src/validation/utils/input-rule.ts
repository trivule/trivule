import { Rule, RuleCallBack, RuleParam, RuleType } from '../../contracts';
import { getRule } from '../../utils';
import { TrMessage, TrRule } from '../tr-bag';

export class InputRule {
  items: RuleType[] = [];
  messages: Record<string, string> = {};
  constructor(
    rules: Rule[] | string[] | Rule | string,
    messages?: string | string[] | Record<string, string> | null,
    private local?: string,
  ) {
    this.set(rules, messages, local);
  }

  /**
   * Removes a validation rule from the InputRule instance.
   * @param  rule - The name of the rule to remove.
   * @returns Returns the current InputRule instance for method chaining.
   */
  remove(rule: string): this {
    const { ruleName } = getRule(rule);
    this.items = this.items.filter((item) => item.name !== ruleName);
    //Delete the rule message
    delete this.messages[ruleName];
    return this;
  }
  /**
   * Retrieves a validation rule from the InputRule instance.
   * @param {string | Rule} rule - Optional. The name of the rule to retrieve.
   * @returns Returns the validation rule if found, an array of all rules if no specific rule is provided, or null if the rule is not found.
   */
  get(rule?: string | Rule) {
    if (rule) {
      const { ruleName } = getRule(rule);
      return this.items.find((item) => item.name === ruleName) ?? null;
    }
    return this.items;
  }
  /**
   * Gets the number of validation rules in the InputRule instance.
   */
  get length() {
    return this.items.length;
  }
  /**
   * Retrieves the validation rule at the specified index in the InputRule instance.
   * @param {number} index - The index of the rule to retrieve.
   * @returns The validation rule at the specified index.
   */
  atIndex(index: number) {
    return this.items[index];
  }
  /**
   * Clears all validation rules and associated messages from the InputRule instance.
   * @returns - Returns the current InputRule instance after clearing.
   */
  clear() {
    this.items = [];
    this.messages = {};
    return this;
  }
  ruleNameAsArray() {
    return this.items.map((rule) => rule.name);
  }
  messageAsArray() {
    return this.items.map((rule) => rule.message);
  }
  /**
   * Adds a new validation rule to the InputRule instance.
   * If the rule already exists, it is first removed and then added again.
   * @param {string | Rule} rule - The name of the rule to add or a valid Trivule rule.
   * @param {string | null} message - Optional. The custom error message for the rule.
   * @param {RuleParam} param - Optional. The parameters for the rule.
   * @param {RuleCallBack} validate - Optional. The validation callback function for the rule.
   * @param {string} local - Optional. The locale to use for retrieving localized error messages.
   * @returns - Returns the current InputRule instance after adding the rule.
   */
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
  /**
   * Checks if a validation rule exists in the InputRule instance.
   * @param {string | Rule} rule - The name of the rule to check or a valid Trivule rule.
   * @returns {boolean} - Returns true if the rule exists, otherwise returns false.
   */
  private createRule(
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
  /**
   * Sets validation rules and associated messages for the InputRule instance.
   * @param {Rule[] | string[] | Rule | string} rules - The validation rules to set.
   * @param {string | string[] | Record<string, string> | null} messages - Optional. Custom error messages for the validation rules.
   * @param {string} local - Optional. The locale to use for retrieving localized error messages.
   * @returns - Returns the current InputRule instance after setting the rules.
   */

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

  /**
   * Maps over the validation rules in the InputRule instance and applies a function to each rule.
   * @param {Function} call - The function to apply to each rule. It receives two parameters: the rule itself and its index in the array.
   * @returns An array containing the results of applying the function to each rule.
   */
  map<T = unknown>(call: (r: RuleType, i: number) => T) {
    return this.items.map(call);
  }
  /**
   * Replaces a validation rule with another rule in the InputRule instance.
   * @param {string} outgoing - The name of the rule to replace.
   * @param {string} incoming - The name of the rule to replace with.
   * @returns - Returns the current InputRule instance after replacing the rule.
   */
  replace(outgoing: string, incoming: string) {
    const { ruleName } = getRule(outgoing);
    const index = this.items.findIndex((r) => r.name === ruleName);
    if (index !== -1) {
      this.items[index] = this.createRule(incoming);
    }
    return this;
  }
  /**
   * Retrieves all validation rules stored in the InputRule instance.
   * @returns - An array containing all validation rules.
   */
  all() {
    return this.items;
  }
  /**
   * Adds a new validation rule to the InputRule instance and returns the current instance.
   * @param {string} rule - The name of the rule to add.
   * @param {string | null} message - Optional. The custom error message for the rule.
   * @param {RuleParam} param - Optional. The parameters for the rule.
   * @param {RuleCallBack} validate - Optional. The validation callback function for the rule.
   * @param {string} local - Optional. The locale to use for retrieving localized error messages.
   * @returns - Returns the current InputRule instance after adding the rule.
   */
  push(
    rule: string,
    message?: string | null,
    param?: RuleParam,
    validate?: RuleCallBack,
    local?: string,
  ): this {
    this.add(rule, message, param, validate, local);
    return this;
  }
  /**
   * Retrieves all custom error messages associated with validation rules in the InputRule instance.
   * @returns - An object containing all custom error messages.
   */
  getMessages() {
    return this.messages;
  }
  /**
   * Adds a new validation rule to the InputRule instance and returns the current instance.
   * @param {string} rule - The name of the rule to add.
   * @param {string | null} message - Optional. The custom error message for the rule.
   * @param {RuleParam} param - Optional. The parameters for the rule.
   * @param {RuleCallBack} validate - Optional. The validation callback function for the rule.
   * @param {string} local - Optional. The locale to use for retrieving localized error messages.
   * @returns - Returns the current InputRule instance after adding the rule.
   */
  append(
    rule: string,
    message?: string | null,
    param?: RuleParam,
    validate?: RuleCallBack,
    local?: string,
  ) {
    this.push(rule, message, param, validate, local);
    return this;
  }
  /**
   * Adds a new validation rule to the beginning of the InputRule instance and returns the current instance.
   * @param {string} rule - The name of the rule to add.
   * @param {string | null} message - Optional. The custom error message for the rule.
   * @param {RuleParam} param - Optional. The parameters for the rule.
   * @param {RuleCallBack} validate - Optional. The validation callback function for the rule.
   * @param {string} local - Optional. The locale to use for retrieving localized error messages.
   * @returns - Returns the current InputRule instance after adding the rule.
   */
  prepend(
    rule: string,
    message?: string | null,
    param?: RuleParam,
    validate?: RuleCallBack,
    local?: string,
  ) {
    this.items.unshift(this.createRule(rule, message, param, validate, local));
    return this;
  }
  /**
   * Inserts a new validation rule before an existing rule in the InputRule instance and returns the current instance.
   * @param {string} existingRule - The name of the existing rule before which the new rule will be inserted.
   * @param {string | Rule | { rule: string; message?: string | null; param?: RuleParam; validate?: RuleCallBack; local?: string; }} incomming - The new rule to insert.
   * @returns - Returns the current InputRule instance after inserting the new rule.
   */
  insertBefore(
    existingRule: string,
    incomming:
      | {
          rule: string;
          message?: string | null;
          param?: RuleParam;
          validate?: RuleCallBack;
          local?: string;
        }
      | string
      | Rule,
  ): this {
    const existingIndex = this.items.findIndex(
      (item) => item.name === existingRule,
    );
    if (existingIndex !== -1) {
      if (typeof incomming === 'string') {
        this.items.splice(existingIndex, 0, this.createRule(incomming));
        return this;
      }
      this.items.splice(
        existingIndex,
        0,
        this.createRule(
          incomming.rule,
          incomming.message,
          incomming.param,
          incomming.validate,
          incomming.local,
        ),
      );
    }
    return this;
  }
  /**
   * Inserts a new validation rule after an existing rule in the InputRule instance and returns the current instance.
   * @param {string} existingRule - The name of the existing rule after which the new rule will be inserted.
   * @param {string | Rule | { rule: string; message?: string | null; param?: RuleParam; validate?: RuleCallBack; local?: string; }} incomming - The new rule to insert.
   * @returns - Returns the current InputRule instance after inserting the new rule.
   */
  insertAfter(
    existingRule: string,
    incomming:
      | {
          rule: string;
          message?: string | null;
          param?: RuleParam;
          validate?: RuleCallBack;
          local?: string;
        }
      | string
      | Rule,
  ): this {
    const existingIndex = this.items.findIndex(
      (item) => item.name === existingRule,
    );
    if (existingIndex !== -1) {
      if (typeof incomming === 'string') {
        this.items.splice(existingIndex + 1, 0, this.createRule(incomming));
        return this;
      }
      this.items.splice(
        existingIndex + 1,
        0,
        this.createRule(
          incomming.rule,
          incomming.message,
          incomming.param,
          incomming.validate,
          incomming.local,
        ),
      );
    }
    return this;
  }

  /**
   * Assigns or updates the message for a specific rule.
   * @param rule - The rule name to update the message for.
   * @param message - The new message to assign to the rule.
   */
  assignMessage(rule: string, message: string) {
    const { ruleName } = getRule(rule);
    if (ruleName) {
      const r = this.get(ruleName) as RuleType;

      if (r) {
        this.messages[ruleName] = message;
        r.message = message;
      }
    }

    return this;
  }
  /**
   * Retrieves the message associated with a specific validation rule.
   * @param {string | Rule} rule - The name of the validation rule or the rule itself.
   * @returns {string | null} - The message associated with the specified rule, or null if the message is not found.
   */

  getMessage(rule: string | Rule): string | null {
    const { ruleName } = getRule(rule);
    return this.messages[ruleName] || null;
  }
}

import { dateBetween } from "./../rules/date";
import { endWithString, stringBetween } from "../rules/string";
import { fileBetween, isMimes, minFileSize } from "../rules/file";
import { Rule, RuleCallBack, RulesBag, RulesMessages } from "../contracts";
import {
  between,
  contains,
  email,
  endWith,
  inInput,
  integer,
  isNumber,
  is_string,
  maxRule,
  maxlength,
  minRule,
  minlength,
  required,
  startWith,
  length,
  url,
  isFile,
  maxFileSize,
  size,
  isBoolean,
  startWithUpper,
  nullable,
  startWithLower,
  passwordRule,
  startWithString,
  excludes,
  containsLetter,
  regex,
  lower,
  upper,
  modulo,
  only,
  digitRule,
  minDigitRule,
  lessthan,
  maxDigitRule,
  greaterthan,
  numberBetween,
} from "../rules";
import { dateAfter, dateBefore, isDate, isTime } from "../rules/date";
import { TrLocal } from "../locale/tr-local";
import { phone } from "../rules/phone";

export class TrBag {
  private static rules: RulesBag = {
    required: required,
    email: email,
    maxlength: maxlength,
    minlength: minlength,
    min: minRule,
    max: maxRule,
    string: is_string,
    between: between,
    startWith: startWith,
    endWith: endWith,
    contains: contains,
    in: inInput,
    integer: integer,
    int: integer,
    modulo: modulo,
    number: isNumber,
    numeric: isNumber,
    url: url,
    length: length,
    len: length,
    file: isFile,
    maxFileSize: maxFileSize,
    minFileSize: minFileSize,
    size: size,
    boolean: isBoolean,
    startWithUpper: startWithUpper,
    nullable: nullable,
    startWithLower: startWithLower,
    password: passwordRule,
    date: isDate,
    before: dateBefore,
    after: dateAfter,
    phone: phone,
    time: isTime,
    startWithString: startWithString,
    endWithString: endWithString,
    excludes: excludes,
    hasLetter: containsLetter,
    regex: regex,
    lower: lower,
    upper: upper,
    stringBetween: stringBetween,
    mod: modulo,
    only: only,
    mimes: isMimes,
    digit: digitRule,
    minDigit: minDigitRule,
    lessThan: lessthan,
    lthan: lessthan,
    maxDigit: maxDigitRule,
    greaterThan: greaterthan,
    gthan: greaterthan,
    fileBetween: fileBetween,
    dateBetween: dateBetween,
    numberBetween: numberBetween,
  };

  /**
   * Add a custom validation rule to the rules bag
   * @param rule - The name of the custom rule
   * @param callback - The callback function for the custom rule
   * @param message - The error message for the custom rule
   */
  static rule(
    rule: string,
    callback: RuleCallBack,
    message?: string,
    local?: string
  ) {
    TrBag.addRule(rule, callback);
    TrBag.addMessage(rule, message, local);
  }
  /**
   * Add a custom validation rule to the rules bag
   * @param rule - The name of the custom rule
   * @param callback - The callback function for the custom rule
   */
  static addRule(rule: string, callback: RuleCallBack) {
    TrBag.rules[rule as keyof RulesBag] = callback;
  }

  /**
   * Add a custom error message for a validation rule to the messages bag
   * @param rule - The name of the validation rule
   * @param message - The error message for the validation rule
   */
  static addMessage(rule: string, message?: string, local?: string) {
    TrLocal.addMessage(rule, message, local);
  }

  /**
   * Check if a validation rule exists in the rules bag
   * @param rule - The name of the validation rule
   * @returns True if the rule exists, false otherwise
   */
  static hasRule(rule: string): boolean {
    return rule in TrBag.rules;
  }

  static getRule(name: string) {
    return TrBag.rules[name as Rule];
  }
  static getMessage(name: string | Rule, local?: string): string {
    return TrLocal.getRuleMessage(name, local);
  }

  static allRules() {
    return TrBag.rules;
  }
  static allMessages(local?: string) {
    return TrLocal.getMessages(local);
  }
}

/**
 * Class representing custom validation rule management.
 * @extends TrBag
 */
export class TrRule extends TrBag {
  /**
   * Adds a custom validation rule to the rule bag.
   * @param rule - The name of the custom rule.
   * @param callback - The callback function for the custom rule.
   * @example
   * ```typescript
   * TrRule.add("customRule", (input) => {
   *   // Custom validation logic here
   *   return {
   *     passes: true,
   *     value: input
   *   };
   * });
   * ```
   */
  static add(rule: string, callback: RuleCallBack): void {
    TrRule.addRule(rule, callback);
  }

  /**
   * Checks if a validation rule exists in the rule bag.
   * @param rule - The name of the validation rule.
   * @returns True if the rule exists, otherwise false.
   * @example
   * ```typescript
   * const exists = TrRule.has("required");
   * ```
   */
  static has(rule: string): boolean {
    return TrRule.hasRule(rule);
  }

  /**
   * Retrieves all validation rules from the rule bag.
   * @returns An object containing all validation rules.
   * @example
   * ```typescript
   * const allRules = TrRule.all();
   * ```
   */
  static all(): RulesBag {
    return TrRule.allRules();
  }

  /**
   * Retrieves a specific validation rule from the rule bag.
   * @param name - The name of the validation rule to retrieve.
   * @returns The callback function associated with the validation rule.
   * @example
   * ```typescript
   * const ruleFunction = TrRule.get("required");
   * ```
   */
  static get(name: string): RuleCallBack {
    return TrRule.getRule(name);
  }
}

/**
 * Class representing error message management for validation rules.
 * @extends TrBag
 */
export class TrMessage extends TrBag {
  /**
   * Retrieves the error message for a validation rule.
   * @param rule - The name of the validation rule.
   * @param local - The locale for the error message (optional).
   * @returns The error message for the validation rule.
   * @example
   * ```typescript
   * const errorMessage = TrMessage.get("required", "en");
   * ```
   */
  static get(rule: string, local?: string): string {
    return TrBag.getMessage(rule, local);
  }

  /**
   * Retrieves all error messages for validation rules.
   * @param local - The locale for the error messages (optional).
   * @returns An object containing all error messages for validation rules.
   * @example
   * ```typescript
   * const allMessages = TrMessage.all("en");
   * ```
   */
  static all(local?: string): RulesMessages {
    return TrBag.allMessages(local);
  }

  /**
   * Adds a custom error message for a validation rule.
   * @param rule - The name of the validation rule.
   * @param message - The custom error message (optional).
   * @param local - The locale for the error message (optional).
   * @example
   * ```typescript
   * TrMessage.add("customRule", "Custom error message", "en");
   * ```
   */
  static add(rule: string, message?: string, local?: string): void {
    TrBag.addMessage(rule, message, local);
  }
}

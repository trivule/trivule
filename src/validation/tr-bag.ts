import { dateBetween } from "./../rules/date";
import { endWithLetter, stringBetween } from "../rules/string";
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
  startWithLetter,
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
interface ITrBag {
  [key: string | Rule]: any;
}
export class TrBag implements ITrBag {
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
    startWithLetter: startWithLetter,
    endWithLetter: endWithLetter,
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

import { minFileSize } from "./../rules/file";
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
} from "../rules";
import { afterDate, beforeDate, isDate } from "../rules/date";
import { QvLocal } from "../locale/qv-local";
import { phone } from "../rules/phone";
interface IQvBag {
  [key: string | Rule]: any;
}
export class QvBag implements IQvBag {
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
    before: beforeDate,
    after: afterDate,
    phone: phone,
  };

  /**
   * Add a custom validation rule to the rules bag
   * @param rule - The name of the custom rule
   * @param callback - The callback function for the custom rule
   * @param message - The error message for the custom rule
   */
  static rule(rule: string, callback: RuleCallBack, message?: string) {
    QvBag.addRule(rule, callback);
    QvBag.addMessage(rule, message ?? "This input is invalide");
  }
  /**
   * Add a custom validation rule to the rules bag
   * @param rule - The name of the custom rule
   * @param callback - The callback function for the custom rule
   */
  static addRule(rule: string, callback: RuleCallBack) {
    QvBag.rules[rule as keyof RulesBag] = callback;
  }

  /**
   * Add a custom error message for a validation rule to the messages bag
   * @param rule - The name of the validation rule
   * @param message - The error message for the validation rule
   */
  static addMessage(rule: string, message: string, local?: string) {
    QvLocal.addMessage(rule, message, local);
  }

  /**
   * Check if a validation rule exists in the rules bag
   * @param rule - The name of the validation rule
   * @returns True if the rule exists, false otherwise
   */
  static hasRule(rule: string): boolean {
    return rule in QvBag.rules;
  }

  static getRule(name: string) {
    return QvBag.rules[name as Rule];
  }
  static getMessage(name: string | Rule, local?: string): string {
    return QvLocal.getRuleMessage(name, local);
  }

  static allRules() {
    return QvBag.rules;
  }
  static allMessages(local?: string) {
    return QvLocal.getMessages(local);
  }
}

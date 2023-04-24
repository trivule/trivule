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
interface IQvBag {
  [key: string | Rule]: any;
}
export class QvBag implements IQvBag {
  private static messages: RulesMessages = {
    required: "The :field field is required",
    email: "Please enter a valid email address",
    maxlength: "The maximum number of characters allowed has been exceeded",
    minlength: "The minimum number of characters allowed has not been reached",
    min: "The :field field must be greater than or equal to ':min'",
    max: "The :field field must be less than or equal to ':max'",
    string: "Please enter a string of characters",
    between: "This field value must be in ':min' and ':max'",
    startWith: "The :field field must be started with ':startWith'",
    endWith: "The :field field must be ended with ':endWith'",
    contains: "The :field field must contain the value ':contains'",
    in: "Please choose a correct value for the :field field",
    integer: "The :field field must an integer",
    int: "The :field field must an integer",
    number: "This field must be a number",
    numeric: "This field must be a number",
    file: "This field must be a file",
    url: "This field must be a valid url",
    length: "The size of this must be :size",
    len: "The size of this must be :size",
    maxFileSize: "The file size must be smaller than :maxFileSize.",
    minFileSize: "The file size must be larger than :minFileSize.",
    size: "This field's size should be less than or equal to :size ",
    boolean: "This field must be a boolean (yes or no) included",
    startWithUpper: "This field must be started with capitale letter",
    startWithLower: "This field must be started with capitale letter",
    nullable: "",
    password:
      "The password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a digit, and a special character.",
    date: "This field must be a valid date",
    before: "The date must be before (:beforeDate)",
    after: "The date must be after (:afterDate)",
  };

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
  static addMessage(rule: string, message: string) {
    QvBag.messages[rule as Rule] = message;
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
  static getMessage(name: string | Rule): string {
    return QvBag.messages[name as Rule];
  }

  static allRules() {
    return QvBag.rules;
  }
  static allMessages() {
    return QvBag.messages;
  }
}

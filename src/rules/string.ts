import { isNumber } from ".";
import { spliteParam, throwEmptyArgsException } from "../utils";
import { RuleCallBack } from "./../contracts/rule-callback";
export const email: RuleCallBack = (input, ...options) => {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(input);
};

export const minlength: RuleCallBack = (input, length) => {
  if (!input) {
    return false;
  }
  return is_string(input) ? input.length >= Number(length) : false;
};

export const maxlength: RuleCallBack = (input, length) => {
  if (!input) {
    return true;
  }
  return is_string(input) ? input.length <= Number(length) : false;
};

export const is_string: RuleCallBack = (val: any) => {
  return typeof val === "string";
};

export const url: RuleCallBack = (input) => {
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  return urlRegex.test(input);
};

export const startWithUpper: RuleCallBack = (input) => {
  if (typeof input !== "string" || input.length === 0) {
    return false;
  }
  const regex = /^[A-Z]/;
  return regex.test(input);
};

export const startWithLower: RuleCallBack = (input) => {
  if (typeof input !== "string" || input.length === 0) {
    return false;
  }
  const regex = /^[a-z]/;
  return regex.test(input);
};
export const startWith: RuleCallBack = (input, prefix) => {
  if (!prefix) {
    throwEmptyArgsException("startWith");
  }
  const prefixes = spliteParam(prefix ?? "");
  if (!is_string(input)) {
    return false;
  }
  return prefixes.some((p) => input.startsWith(p));
};

export const endWith: RuleCallBack = (input, suffix) => {
  if (!suffix) {
    throwEmptyArgsException("endWith");
  }
  const suffixes = spliteParam(suffix ?? "");
  if (!is_string(input)) {
    return false;
  }
  return suffixes.some((s) => input.endsWith(s));
};

export const contains: RuleCallBack = (input, substring) => {
  if (!substring) {
    throwEmptyArgsException("contains");
  }
  const substrs = spliteParam(substring ?? "");
  if (!is_string(input)) {
    return false;
  }
  return substrs.some((substr) => input.includes(substr));
};
export const length: RuleCallBack = (input: any, size: any) => {
  if (!isNumber(size)) {
    throw new Error("The length rule argument must be an integer");
  }
  size = parseInt(size);
  if (typeof input == "string" || typeof input == "number") {
    input = input.toString().split("");
  } else if (
    typeof input === "object" &&
    input !== null &&
    input !== undefined
  ) {
    input = [];
  }

  if (Array.isArray(input)) {
    return input.length === size;
  }
  return false;
};

export const passwordRule: RuleCallBack = (input) => {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(input);
  const hasLowercase = /[a-z]/.test(input);
  const hasNumber = /\d/.test(input);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(input);

  if (
    input.length < minLength ||
    !hasUppercase ||
    !hasLowercase ||
    !hasNumber ||
    !hasSpecialChar
  ) {
    return false;
  }

  return true;
};

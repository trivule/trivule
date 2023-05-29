import {
  isFile,
  maxFileSize,
  minFileSize,
  length,
  isNumber,
  maxRule,
  minRule,
} from ".";
import { spliteParam, throwEmptyArgsException } from "../utils";
import { RuleCallBack } from "./../contracts/rule-callback";
import { dateBetween } from "./date";
/**
 * Checks if the input is required.
 *
 * @param input - The input to check.
 * @param options - Optional parameters.
 * @returns `true` if the input is not empty, `false` otherwise.
 */
export const required: RuleCallBack = (input, ...options) => {
  return !!input && input !== "";
};

export const nullable: RuleCallBack = (input) => {
  return true;
};

/**
 * Checks if the input is in the specified list.
 *
 * @param input - The input to check.
 * @param params - The list of values to check against.
 * @returns `true` if the input is in the list, `false` otherwise.
 */
export const inInput: RuleCallBack = (input, params) => {
  if (!params) {
    throwEmptyArgsException("in");
  }
  const list = spliteParam(params as string);
  return list.includes(input);
};
/**
 * Checks if the input is at most the specified size.
 *
 * @param input - The input to check.
 * @param maxSize - The maximum size.
 * @returns `true` if the input is at most the specified size, `false` otherwise.
 */
export const size: RuleCallBack = (input, maxSize) => {
  if (isFile(input)) {
    return maxFileSize(input, maxSize);
  } else {
    return length(input, maxSize); // Apply length rule for non-file inputs
  }
};
/**
 * Checks if the input is a boolean value.
 *
 * @param value - The input to check.
 * @returns `true` if the input is a boolean value, `false` otherwise.
 */
export const isBoolean: RuleCallBack = (value) => {
  if (typeof value === "boolean") {
    return true;
  }
  if (typeof value === "string") {
    value = value.toLowerCase();
    if (
      value === "true" ||
      value === "false" ||
      value === "0" ||
      value === "1" ||
      value === "yes" ||
      value === "no"
    ) {
      return true;
    }
  }
  return false;
};
/**
 * Checks if the input is between the specified minimum and maximum values.
 *
 * @param input - The input to check.
 * @param min_max - The minimum and maximum values, separated by a comma.
 * @returns `true` if the input is between the specified values, `false` otherwise.
 */
export const between: RuleCallBack = (input, min_max) => {
  var [min, max] = spliteParam(min_max ?? "");
  //for file
  if (isFile(input)) {
    return maxFileSize(input, max) && minFileSize(input, min);
  }
  // for date
  if (!isNumber(input) && !isFile(input)) {
    return dateBetween(input, min_max);
  }
  //for number
  min = Number(min);
  max = Number(max);
  if (input !== undefined && input !== Number && input !== "") {
    if (isNumber(min) && isNumber(max)) {
      input = Number(input);
      if (!isNumber(input)) {
        return false;
      }
      return maxRule(input, max) && minRule(input, min);
    }
  }
  return false;
};
/**
 * Checks if the input matches the specified regular expression.
 *
 * @param input - The input to check.
 * @param pattern - The regular expression to match against.
 * @returns `true` if the input matches the regular expression, `false` otherwise.
 * @example
 * ```html
 *  <input qv-rules="regex:^[A-Z]+$"/>
 * ```
 */
export const regex: RuleCallBack = (input: string, pattern?: string) => {
  if (!pattern) {
    throw new Error("The regex rule argument must not be empty");
  }
  const regex = new RegExp(pattern);
  return regex.test(input);
};

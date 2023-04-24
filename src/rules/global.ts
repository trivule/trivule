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

export const required: RuleCallBack = (input, ...options) => {
  return !!input;
};
export const nullable: RuleCallBack = (input) => {
  return true;
};

export const inInput: RuleCallBack = (input, params) => {
  if (!params) {
    throwEmptyArgsException("in");
  }
  const list = spliteParam(params as string);
  return list.includes(input);
};

export const size: RuleCallBack = (input, maxSize) => {
  if (isFile(input)) {
    return maxFileSize(input, maxSize);
  } else {
    return length(input, maxSize); // Apply length rule for non-file inputs
  }
};

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

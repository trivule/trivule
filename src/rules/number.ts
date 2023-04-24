import { maxlength, minlength } from "./string";
import { RuleCallBack } from "../contracts/rule-callback";
import { isFile, maxFileSize, minFileSize } from "./file";

export const minRule: RuleCallBack = (input, min) => {
  if (isFile(input)) {
    return minFileSize(input, min);
  }
  if (input === undefined || input === null) {
    input = 0;
  }

  if (!isNumber(min)) {
    throw new Error("Min rule parameter must be an integer");
  }
  if (isNumber(input)) {
    return Number(input) >= Number(min);
  } else {
    return minlength(input, min);
  }
};

export const maxRule: RuleCallBack = (input, max) => {
  if (isFile(input)) {
    return maxFileSize(input, max);
  }
  if (!isNumber(max)) {
    throw new Error("Min rule parameter must be an integer");
  }
  if (input === undefined || input === null) {
    input = 0;
  }
  if (isNumber(input)) {
    return Number(input) <= Number(max);
  } else {
    return maxlength(input, max);
  }
};

export const integer: RuleCallBack = (input) => {
  if (isNumber(input)) {
    return Number.isInteger(Number(input));
  }
  return false;
};

export const isNumber: RuleCallBack = (input) => {
  if (input === "" || input === null) {
    return false;
  }

  if (input === "0" || input === 0) {
    return true;
  }

  if (input === "1" || input === 1) {
    return true;
  }
  return (
    !isNaN(Number(input)) &&
    typeof input !== "boolean" &&
    typeof input !== "object"
  );
};

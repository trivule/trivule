import { maxlength, minlength } from "./string";
import { RuleCallBack } from "../contracts/rule-callback";
import { isFile, maxFileSize, minFileSize } from "./file";
/**
 * Checks if the input is at least the specified length.
 *
 * @param input - The input to check.
 * @param min - The minimum length.
 * @returns `true` if the input is at least the specified length, `false` otherwise.
 */
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
/**
 * Checks if the input is at most the specified length.
 *
 * @param input - The input to check.
 * @param max - The maximum length.
 * @returns `true` if the input is at most the specified length, `false` otherwise.
 */
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

/**
 * Checks if the input is an integer.
 *
 * @param input - The input to check.
 * @returns `true` if the input is an integer, `false` otherwise.
 */
export const integer: RuleCallBack = (input) => {
  if (isNumber(input)) {
    return Number.isInteger(Number(input));
  }
  return false;
};

/**
 * Checks if the input is a number.
 *
 * @param input - The input to check.
 * @returns `true` if the input is a number, `false` otherwise.
 */
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

export const modulo: RuleCallBack = (input, mod) => {
  if (!isNumber(mod)) {
    throw new Error("Modulo rule parameter must be an integer");
  }

  if (isNumber(input)) {
    return Number(input) % Number(mod) === 0;
  }

  return false;
};

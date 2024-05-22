import {
  isFile,
  length,
  isNumber,
  maxRule,
  minRule,
  stringBetween,
  fileBetween,
} from ".";
import { RuleCallBack } from "../contracts";
import {
  calculateFileSize,
  convertFileSize,
  explodeFileParam,
  spliteParam,
  throwEmptyArgsException,
} from "../utils";
import { ArgumentParser } from "../validation/utils/argument-parser";
import { dateBetween } from "./date";
/**
 * Checks if the input is required.
 *
 * @param input - The input to check.
 * @example
 *  ```html
 * <input data-tr-rules="required" />
 * ```
 * @param options - Optional parameters.
 */
export const required: RuleCallBack = (input) => {
  return {
    passes: !!input && input != "",
    value: input,
  };
};

export const nullable: RuleCallBack = (input) => {
  return {
    passes: true,
    value: input,
  };
};

/**
 * Checks if the input is in the specified list.
 * @param input - The input to check.
 * @param params - The list of values to check against.
 * @example
 *  ```html
 * <input data-tr-rules="in:active,inactive" />
 * ```
 */
export const inInput: RuleCallBack = (input, params) => {
  if (typeof params !== "string") {
    throwEmptyArgsException("in");
  }
  if (params === "") {
    throwEmptyArgsException("in"), "The in rule parameter must be a string";
  }
  const list = spliteParam(params as string);
  return {
    passes: list.includes(input as string | number),
    value: input,
  };
};
/**
 * Checks if the input is at most the specified size.
 * If the input value is not a file, then the number of characters must be exactly maxSize
 * @param input - The input to check.
 * @param maxSize - The maximum size.
 *  @example
 *  ```html
 * <input data-tr-rules="size:6" />
 * ```
 */
export const size: RuleCallBack = (input, maxSize) => {
  if (typeof maxSize !== "number" && typeof maxSize !== "string") {
    throwEmptyArgsException("size");
  }
  if (isFile(input).passes) {
    let numericValue, unit;
    // eslint-disable-next-line no-useless-catch
    try {
      [numericValue, unit] = explodeFileParam(maxSize as string);
    } catch (error) {
      throw error;
    }
    let fileSize = calculateFileSize(input);

    if (isNaN(fileSize)) {
      fileSize = 0;
    }
    numericValue = convertFileSize(numericValue as number, unit as string);
    return {
      passes: fileSize <= numericValue,
      value: input,
    };
  } else {
    return {
      passes: length(input, maxSize).passes,
      value: input,
      alias: "length",
    }; // Apply length rule for non-file inputs
  }
};
/**
 * Checks if the input is a boolean value.
 *
 * @param value - The input to check.
 * @example
 *  ```html
 * <input data-tr-rules="boolean" />
 * ```
 */
export const isBoolean: RuleCallBack = (value) => {
  if (typeof value === "boolean") {
    return { passes: true, value: Boolean(value) };
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
      return {
        passes: true,
        value: value == "true" || value == "1" || value == "yes" ? true : false,
      };
    }
  }
  return {
    passes: false,
    value: value,
  };
};
/**
 * Checks if the input is between the specified minimum and maximum values.
 * This rule between validates data according to its type. It can be used to validate numbers, strings, dates, file size, etc.
 * @param input - The input to check.
 * @param min_max - The minimum and maximum values, separated by a comma.
 * @example
 * ```html
 * <!--valide number-->
 * <input type="number" data-tr-rules="between:6,7" />
 * <!--valide string-->
 * <input type="text" data-tr-rules="between:6,7" />
 * <!--valide date-->
 * <input type="date-local" data-tr-rules="between:01-01-2021,now" />
 * <!--valide file size-->
 * <input type="file" data-tr-rules="between:2MB,3MB" />
 * ```
 */
export const between: RuleCallBack = (input, min_max, type) => {
  if (typeof min_max !== "number" && typeof min_max !== "string") {
    throwEmptyArgsException("between");
  }
  let [min, max] = spliteParam(min_max as string);
  //for file
  if (type === "file") {
    return {
      passes: fileBetween(input, min_max, type).passes,
      value: input,
      alias: "fileBetween",
    };
  }
  // for date
  if (type == "date" || type == "date-local") {
    return {
      passes: dateBetween(input, min_max).passes,
      value: input,
      alias: "dateBetween",
    };
  }

  if (type == "number") {
    min = Number(min);
    max = Number(max);
    if (input !== undefined && input !== "") {
      if (isNumber(min).passes && isNumber(max).passes) {
        if (!isNumber(input).passes) {
          return {
            passes: false,
            value: input,
          };
        }
        return {
          passes: maxRule(input, max).passes && minRule(input, min).passes,
          value: Number(input),
          alias: "numberBetween",
        };
      }
    }
  }

  return {
    passes: stringBetween(input, min_max).passes,
    value: input,
    alias: "stringBetween",
  };
};
/**
 * Checks if the input matches the specified regular expression.
 *
 * @param input - The input to check.
 * @param pattern - The regular expression to match against.
 * @example
 * ```html
 *  <input data-tr-rules="regex:^[A-Z]+$"/>
 * ```
 */
export const regex: RuleCallBack = (input, pattern) => {
  if (!pattern || typeof pattern !== "string") {
    throw new Error("The regex rule argument must not be empty");
  }
  const parser = new ArgumentParser(pattern);
  const regex = new RegExp(parser.replacePipes());
  return {
    passes: regex.test(input as string),
    value: input,
  };
};

/**
 * Only accepts inputs of a specific type.
 *
 * @param input - The input to check.
 * @param param - The parameter specifying the expected type ("string" or "number").
 *  ```html
 *  <input data-tr-rules="only:digit"/>
 * ```
 */
export const only: RuleCallBack = (input, param) => {
  let passes = false;
  if (param === "string") {
    if (typeof input !== "string" || input.length === 0) {
      passes = false;
    } else {
      passes = !/\d/.test(input);
    }
  } else {
    if (param === "digit") {
      passes = isNumber(input).passes;
    }
  }

  return {
    passes: passes,
    value: input,
  }; // Invalid parameter, return false
};

/**
 * Checks if the input is a digit (numeric value) with the specified number of digits.
 *
 * @param input - The input to check.
 * @param digitCount - The number of digits.
 * @example
 * ```html
 * <input data-tr-rules="digit:8"/>
 * ```
 */
export const digitRule: RuleCallBack = (input, digitCount) => {
  if (!isNumber(digitCount).passes) {
    throw new Error("Digit rule parameter must be a number");
  }
  let passes = false;
  if (isNumber(input).passes) {
    const inputralue = String(input);
    passes =
      /^\d+$/.test(inputralue) && inputralue.length === Number(digitCount);
  }

  return {
    passes: passes,
    value: input,
  };
};

/**
 * Checks if the input is a digit (numeric value) with a number of digits less than or equal to the specified maximum.
 *
 * @param input - The input to check.
 * @param maxDigitCount - The maximum number of digits.
 * @example
 * ```html
 * <input data-tr-rules="max_digit:10"/>
 * ```
 */
export const maxDigitRule: RuleCallBack = (input, maxDigitCount) => {
  if (!isNumber(maxDigitCount).passes) {
    throw new Error("Max_digit rule parameter must be a number");
  }

  let passes = false;
  if (isNumber(input).passes) {
    const inputralue = String(input);
    passes =
      /^\d+$/.test(inputralue) && inputralue.length <= Number(maxDigitCount);
  }

  return {
    passes: passes,
    value: input,
  };
};

/**
 * Checks if the input is a digit (numeric value) with a number of digits greater than or equal to the specified minimum.
 *
 * @param input - The input to check.
 * @param minDigitCount - The minimum number of digits.
 * @example
 * ```html
 * <input data-tr-rules="min_digit:5"/>
 * ```
 */
export const minDigitRule: RuleCallBack = (input, minDigitCount) => {
  if (!isNumber(minDigitCount).passes) {
    throw new Error("Min_digit rule parameter must be a number");
  }

  let passes = false;
  if (isNumber(input).passes) {
    const inputralue = String(input);
    passes =
      /^\d+$/.test(inputralue) && inputralue.length >= Number(minDigitCount);
  }

  return {
    passes: passes,
    value: input,
  };
};

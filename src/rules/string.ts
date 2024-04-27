import { isNumber } from ".";
import { spliteParam, throwEmptyArgsException } from "../utils";
import { ArgumentParser } from "../validation/utils/argument-parser";
import { RuleCallBack } from "./../contracts/rule-callback";
/**
 * Validates an email address.
 *
 * @param input The email address to validate.
 * @param options Optional parameters
 *  @param param - The parameter specifying the expected type ("string" or "number").
 * @example
 *  ```html
 *  <input data-tr-rules="email"/>
 * ```
 * @returns Whether the email address is valid.
 */
export const email: RuleCallBack = (input, ...options) => {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return {
    passes: emailRegex.test(input),
    value: input,
  };
};

/**
 * Validates that the input is at least a certain length.
 *
 * @param input The input to validate.
 * @param length The minimum length.
 * @example
 *  ```html
 *  <input data-tr-rules="minlength:8"/>
 * ```
 * @returns Whether the input is at least the specified length.
 */
export const minlength: RuleCallBack = (input, length) => {
  return {
    passes: is_string(input).passes ? input.length >= Number(length) : false,
    value: input,
  };
};

/**
 * Validates that the input is no more than a certain length.
 *
 * @param input The input to validate.
 * @param length The maximum length.
 * @example
 *  ```html
 *  <input data-tr-rules="maxlength:8"/>
 * ```
 * @returns Whether the input is no more than the specified length.
 */
export const maxlength: RuleCallBack = (input, length) => {
  return {
    passes: is_string(input).passes ? input.length <= Number(length) : true,
    value: input,
  };
};
/**
 * Checks if the input is a string.
 *
 * @param val The input to check.
 * @returns Whether the input is a string.
 */
export const is_string: RuleCallBack = (val: any) => {
  return {
    passes: typeof val === "string",
    value: val,
  };
};

/**
 * Validates a URL.
 *
 * @param input The URL to validate.
 *  @example
 *  ```html
 *  <input data-tr-rules="url"/>
 * ```
 * @returns Whether the URL is valid.
 */
export const url: RuleCallBack = (input) => {
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  return {
    passes: urlRegex.test(input),
    value: input,
  };
};

/**
 * Checks if the input starts with an uppercase letter.
 *
 * @param input The input to check.
 *  @example
 *  ```html
 *  <input data-tr-rules="startWithUpper"/>
 * ```
 * @returns Whether the input starts with an uppercase letter.
 */
export const startWithUpper: RuleCallBack = (input, local = "EN") => {
  if (typeof input !== "string" || input.length === 0) {
    return {
      passes: false,
      value: input,
    };
  }
  const regex = /^[A-Z]/;
  return {
    passes: regex.test(input),
    value: input,
  };
};

/**
 * Checks if the input starts with a lowercase letter.
 *
 * @param input The input to check.
 *  @example
 *  ```html
 *  <input data-tr-rules="startWithLower"/>
 * ```
 * @returns Whether the input starts with a lowercase letter.
 */

export const startWithLower: RuleCallBack = (input) => {
  if (
    typeof input !== "string" ||
    input.length === 0 ||
    input.charAt(0) === " "
  ) {
    return {
      passes: false,
      value: input,
    };
  }
  return {
    passes: input[0] == input[0].toLocaleLowerCase(),
    value: input,
  };
};

/**
 * Checks whether a given string starts with any of the given prefixes.
 *
 * @param input - The string to check.
 * @param prefix - The prefixes to check for, as a comma-separated list of strings.
 *  @example
 *  ```html
 *  <input data-tr-rules="startWith"/>
 * ```
 * @returns `true` if the input string starts with any of the given prefixes, `false` otherwise.
 * @throws An exception with the message "Missing required argument: startWith" if the `prefix` parameter is falsy.
 */
export const startWith: RuleCallBack = (input, prefix) => {
  if (!prefix) {
    throwEmptyArgsException("startWith");
  }
  const prefixes = spliteParam(prefix ?? "");
  if (!is_string(input).passes) {
    return {
      passes: false,
      value: input,
    };
  }
  return {
    passes: prefixes.some((p) => input.startsWith(p)),
    value: input,
  };
};

/**
 * Checks whether a given string ends with one of the specified suffixes.
 *
 * @param input - The string to check.
 * @param suffix - A comma-separated list of suffixes to check against.
 *  @example
 *  ```html
 *  <input data-tr-rules="endWith"/>
 * ```
 * @returns `true` if the input string ends with one of the specified suffixes, `false` otherwise.
 * @throws An exception with the message "Missing required argument: endWith" if the `suffix` parameter is falsy.
 */
export const endWith: RuleCallBack = (input, suffix) => {
  if (!suffix) {
    throwEmptyArgsException("endWith");
  }
  const suffixes = spliteParam(suffix ?? "");
  if (!is_string(input).passes) {
    return {
      passes: false,
      value: input,
    };
  }
  return {
    passes: suffixes.some((s) => input.endsWith(s)),
    value: input,
  };
};

/**
 * Checks if the input contains all the specified substrings.
 *
 * @param input - The input to check.
 * @param substrings - A comma-separated  substrings to check for.
 *  @example
 *  ```html
 *  <input data-tr-rules="contains:thanks,yes"/>
 * ```
 * @returns `true` if the input contains all of the specified substrings, `false` otherwise.
 * @throws An exception with the message "Missing required argument: contains" if the `substrings` parameter is falsy.
 */
export const contains: RuleCallBack = (input, substring) => {
  if (!substring) {
    throwEmptyArgsException("contains");
  }
  const substrs = spliteParam(substring ?? "");
  if (!is_string(input).passes) {
    return {
      passes: false,
      value: input,
    };
  }
  let passes = substrs.every((substr) => {
    return input.includes(new ArgumentParser(substr).replaceSpaces());
  });
  return {
    passes: passes,
    value: input,
  };
};

/**
 * Checks if the input has the specified length. Has alias (len)
 *
 * @param input - The input to check.
 * @param size - The desired length of the input.
 * @example
 *  ```html
 *  <input data-tr-rules="length:9"/>
 *  <input data-tr-rules="len:9"/>
 * ```
 * @returns `true` if the input has the specified length, `false` otherwise.
 * @throws An exception with the message "The length rule argument must be an integer" if the `size` parameter is not an integer.
 */
export const length: RuleCallBack = (input: any, size: any) => {
  if (!isNumber(size).passes) {
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
  let passes = false;
  if (Array.isArray(input)) {
    passes = input.length === size;
  }
  return {
    passes: passes,
    value: input,
  };
};
/**
 * Checks if the input is a valid password.
 *
 * A valid password is at least 8 characters long and contains at least one uppercase letter, one lowercase letter, one number, and one special character.
 *
 * @param input - The input to check.
 * @example
 *  ```html
 *  <input data-tr-rules="password"/>
 * ```
 * @returns `true` if the input is a valid password, `false` otherwise.
 */
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
    return {
      passes: false,
      value: input,
    };
  }

  return {
    passes: true,
    value: input,
  };
};

/**
 * Checks if the input starts with a letter.
 *
 * @param input - The input to check.
 * @example
 *  ```html
 *  <input data-tr-rules="startWithString"/>
 * ```
 * @returns `true` if the input starts with a letter, `false` otherwise.
 */
export const startWithString: RuleCallBack = (input) => {
  if (
    !is_string(input).passes ||
    input.length === 0 ||
    input.charAt(0) === " "
  ) {
    return {
      passes: false,
      value: input,
    };
  }
  const regex = /^[0-9]/;
  return {
    passes: !regex.test(input),
    value: input,
  };
};

/**
 * Checks if the input ends with a letter.
 *
 * @param input - The input to check.
 * @example
 *  ```html
 *  <input data-tr-rules="endWithString"/>
 * ```
 */
export const endWithString: RuleCallBack = (input) => {
  if (!is_string(input).passes || input.length === 0) {
    return {
      passes: false,
      value: input,
    };
  }
  const regex = /[0-9]$/;
  return {
    passes: !regex.test(input),
    value: input,
  };
};

/**
 * Checks if the input contains a letter.
 *
 * @param input - The input to check.
 * @example
 *  ```html
 *  <input data-tr-rules="containsLetter"/>
 * ```
 * @returns `true` if the input contains a letter, `false` otherwise.
 */
export const containsLetter: RuleCallBack = (input) => {
  if (typeof input !== "string") {
    return {
      passes: false,
      value: input,
    };
  }
  const letterRegex = /^[0-9]$/;
  return {
    passes: !letterRegex.test(input),
    value: input,
  };
};

/**
 * Checks if the input does not contain any of the specified characters.
 *
 * @param input - The input to check.
 * @param excludedChars - The characters to exclude, separated by comma.
 *  @example
 *  ```html
 *  <input data-tr-rules="excludes:-,@,&esp;"/>
 * ```
 * @returns `true` if the input does not contain any of the specified characters, `false` otherwise.
 */
export const excludes: RuleCallBack = (input, excludedChars) => {
  const chars = spliteParam(excludedChars);
  if (!chars.length) {
    throwEmptyArgsException("excludes");
  }
  if (!is_string(input).passes) {
    return {
      passes: true,
      value: input,
    };
  }

  return {
    passes: !chars.some((char) => {
      return input.includes(new ArgumentParser(char).replaceSpaces());
    }),
    value: input,
  };
};

/**
 * Checks if the input is all uppercase.
 *
 * @param input - The input to check.
 * @param param - The locale to use.
 *   @example
 *  ```html
 *  <input data-tr-rules="upper"/>
 * ```
 * @returns `true` if the input is all uppercase, `false` otherwise.
 */
export const upper: RuleCallBack = (input, param?: string) => {
  return {
    passes: input === input.toLocaleUpperCase(),
    value: input,
  };
};

/**
 * Checks if the input is all lowercase.
 *
 * @param input - The input to check.
 * @param param - The locale to use.
 *   @example
 *  ```html
 *  <input data-tr-rules="lower"/>
 * ```
 * @returns `true` if the input is all lowercase, `false` otherwise.
 */
export const lower: RuleCallBack = (input: string, param?: string) => {
  return {
    passes: input === input.toLocaleLowerCase(),
    value: input,
  };
};

/**
 * Checks whether the length of a given string is between the specified minimum and maximum values.
 *
 * @param input - The string to check.
 * @param min_max - The string containing the minimum and maximum values, separated by a delimiter.
 * @example
 * ```html
 * <input data-tr-rules="stringBetween:2,5" />
 * ```
 * @returns `true` if the length of the input string is between the minimum and maximum values, `false` otherwise.
 */
export const stringBetween: RuleCallBack = (input: string, min_max) => {
  const [min, max] = spliteParam(min_max ?? "");
  return {
    passes: minlength(input, min).passes && maxlength(input, max).passes,
    value: input,
  };
};

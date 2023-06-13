import { Rule } from "../contracts";

/**
 * Parses a rule string and extracts the rule name and parameters.
 * @param rule - The rule string in the format "ruleName:params" or "ruleName".
 * @returns An object containing the rule name and parameters.
 */
export const getRule = (
  rule: string
): { ruleName: Rule; params: string | undefined } => {
  const regex = /^(\w+):(.+)$/;
  const match = rule.match(regex);

  if (match) {
    const ruleName = match[1] as Rule;
    let params = match[2];
    return { ruleName, params };
  } else {
    const [ruleName, params] = rule.split(":") as [Rule, string | undefined];
    return { ruleName, params };
  }
};
/**
 * Splits a string into an array of values using a specified delimiter.
 * @param value - The string to be split.
 * @param carac - The delimiter used to split the string. Defaults to ",".
 * @returns An array containing the split values.
 */
export const spliteParam = (value: string, carac: string = ","): any[] => {
  if (typeof value !== "string") {
    return [];
  }

  return value.split(carac).map((v) => v.trim());
};

/**
 * Throws an exception indicating that required arguments are empty.
 * @param fnc - The name of the function or rule.
 * @throws An error with a message indicating that arguments are empty.
 */
export const throwEmptyArgsException = (fnc: string) => {
  throw new Error(`Please provide <<${fnc}>> rule arguments`);
};

/**
 * Returns the current date and time in ISO 8601 format.
 * @returns The current date and time as a string in ISO 8601 format.
 */
export function now(): string {
  const now = new Date();
  return now.toISOString();
}

/**
 * Checks if the given sub object is a sub-object of the obj object.
 * This function compares the key-value pairs of sub with the key-value pairs of obj.
 * Returns true if all the key-value pairs in sub are present and equal in obj, and false otherwise.
 * @param sub - The sub-object to compare.
 * @param obj - The object to compare against.
 * @returns true if sub is a sub-object of obj, false otherwise.
 */
export function isSubObject(
  sub: Record<string, any>,
  obj: Record<string, any>
): boolean {
  if (typeof sub !== "object" || sub === null || Array.isArray(sub)) {
    return false;
  }

  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
    return false;
  }

  for (const key in sub) {
    if (!(key in obj) || sub[key] !== obj[key]) {
      return false;
    }
  }

  return true;
}

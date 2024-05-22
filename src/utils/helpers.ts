import { CssSelector, Rule, RuleParam } from '../contracts';
import { is_string, isFile } from '../rules';

/**
 * Parses a rule string and extracts the rule name and parameters.
 * @param rule - The rule string in the format "ruleName:params" or "ruleName".
 * @returns An object containing the rule name and parameters.
 */
export const getRule = (
  rule: string,
): { ruleName: Rule; params: RuleParam } => {
  const regex = /^(\w+):(.+)$/;
  const match = rule.match(regex);

  if (match) {
    const ruleName = match[1] as Rule;
    const params = match[2];
    return { ruleName, params };
  } else {
    const [ruleName, params] = rule.split(':') as [Rule, string | undefined];
    return { ruleName, params };
  }
};
/**
 * Splits a string into an array of values using a specified delimiter.
 * @param value - The string to be split.
 * @param carac - The delimiter used to split the string. Defaults to ",".
 * @returns An array containing the split values.
 */
export const spliteParam = (
  value: string,
  carac: string = ',',
): RuleParam[] => {
  if (typeof value !== 'string') {
    return [];
  }

  return value.split(carac).map((v) => v.trim());
};

/**
 * Throws an exception indicating that required arguments are empty.
 * @param fnc - The name of the function or rule.
 * @throws An error with a message indicating that arguments are empty.
 */
export const throwEmptyArgsException = (fnc: string, message?: string) => {
  throw new Error(
    message ?? `Please provide a valid <<${fnc}>> rule arguments`,
  );
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
  sub: Record<string, unknown>,
  obj: Record<string, unknown>,
): boolean {
  if (typeof sub !== 'object' || sub === null || Array.isArray(sub)) {
    return false;
  }

  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return false;
  }

  for (const key in sub) {
    if (!(key in obj) || sub[key] !== obj[key]) {
      return false;
    }
  }

  return true;
}

export function dataset_get<T = unknown>(
  element: HTMLElement | null | undefined,
  name: string,
  defaults: unknown = null,
  toJson = false,
): T {
  if (!element) {
    return defaults as T;
  }
  let value = element.getAttribute(`data-${name}`);
  if (!!value && toJson) {
    try {
      value = JSON.parse(value);
    } catch (error) {
      return defaults as T;
    }
  }

  return (
    !!value || (is_string(value) && !!value?.length) ? value : defaults
  ) as T;
}

export function tr_attr_get<T = unknown>(
  element: HTMLElement | null | undefined,
  name: string,
  defaults: unknown = null,
  toJson = false,
): T {
  return dataset_get<T>(element, `tr-${name}`, defaults, toJson);
}

export function calculateFileSize(file: unknown): number {
  const files = fileToArray(file);
  let count = 0;
  if (!files.length) {
    return count;
  }

  for (const input of files) {
    if (isFile(input).passes) {
      const file = input as File;
      count += file.size;
    } else {
      count += 0;
    }
  }

  return count;
}

export function fileToArray(file: unknown) {
  if (Array.isArray(file)) {
    return file;
  } else if (file instanceof FileList) {
    return Array.from(file);
  } else if (file instanceof File || file instanceof Blob) {
    return [file];
  }

  return [];
}
export function convertFileSize(numericValue: number, unit: string) {
  unit = unit.toUpperCase();
  numericValue = Number(numericValue);

  // Convert minSize to bytes based on unit
  if (unit == 'KB') {
    numericValue = numericValue * 1024;
  } else if (unit == 'MB') {
    numericValue = numericValue * 1024 * 1024;
  } else if (unit == 'GB') {
    numericValue = numericValue * 1024 * 1024 * 1024;
  }
  return numericValue;
}

export function explodeFileParam(value: string) {
  const match = value.match(/^(\d+(\.\d+)?)\s*(B|KB|MB|GB)$/i);

  if (!match) {
    throw new Error(
      "Invalid size format. Please use valid format like '1KB', '1MB', etc.",
    );
  }

  const numericValue = parseFloat(match[1]);
  const unit = match[3].toUpperCase();
  return [numericValue, unit];
}

export function getHTMLElementBySelector<T>(
  selector: CssSelector,
  from?: HTMLElement | null,
): T | null {
  const parent = from ?? document;
  if (typeof selector === 'string') {
    try {
      return parent.querySelector<HTMLElement>(selector) as T;
    } catch (error) {
      return selector as T;
    }
  }
  if (selector instanceof HTMLElement) {
    return selector as T;
  }

  return null;
}

type TransformCallback<T, R> = (p: T, key: string | number) => R;

export function transformToArray<T, R = T>(
  p: T[] | Record<string | number, T>,
  call: TransformCallback<T, R>,
): R[] {
  const result: R[] = [];
  if (Array.isArray(p)) {
    for (let i = 0; i < p.length; i++) {
      const it = p[i];
      result.push(call(it, i));
    }
  } else {
    for (const key in p) {
      if (Object.prototype.hasOwnProperty.call(p, key)) {
        const i = p[key];
        result.push(call(i, key));
      }
    }
  }
  return result;
}

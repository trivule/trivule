import { Rule } from "../contracts";

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

export const spliteParam = (value: string, carac: string = ","): any[] => {
  if (typeof value !== "string") {
    return [];
  }

  return value.split(carac).map((v) => v.trim());
};

export const throwEmptyArgsException = (fnc: string) => {
  throw new Error(`Please provide <<${fnc}>> rule arguments`);
};

export function now(): string {
  const now = new Date();
  return now.toISOString();
}

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

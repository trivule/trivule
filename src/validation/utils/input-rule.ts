export class InputRule {
  constructor(private rules: string[]) {
    this.rules = rules;
  }

  push(rule: string): this {
    this.rules.push(rule);
    return this;
  }

  merge(rules: string[] | string): this {
    if (typeof rules === "string") {
      this.fromString(rules);
    } else if (Array.isArray(rules)) {
      this.rules = [...this.rules, ...rules];
    }

    return this;
  }

  remove(rule: string): this {
    const index = this.rules.indexOf(rule);
    if (index !== -1) {
      this.rules.splice(index, 1);
    }
    return this;
  }

  toString(): string {
    return this.rules.join("|");
  }

  fromString(rule: string): this {
    if (!rule) {
      return this;
    }
    if (typeof rule === "string" && rule.length > 0) {
      this.rules = rule.split("|");
    }

    return this;
  }

  get() {
    return this.rules;
  }
  get length() {
    return this.rules.length;
  }
  atIndex(index: number) {
    return this.rules[index];
  }
  clear() {
    this.rules = [];
    return this;
  }
}

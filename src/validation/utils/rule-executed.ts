import { InputValueType, Rule } from "../../contracts";

export class RuleExecuted {
  passed: boolean = false;
  valueTested: InputValueType;
  ruleName!: Rule | string;
  message: string | null = null;
  params: any;

  run = false;

  constructor(ruleName: string) {
    this.ruleName = ruleName;
  }
  /**
   * Returns true if for the given value, the validation was run and passed
   * @param value
   */
  wasRunWith(value: InputValueType) {
    return this.valueTested === value && this.run;
  }

  isNamed(name: string | Rule): boolean {
    return this.ruleName === name;
  }
}

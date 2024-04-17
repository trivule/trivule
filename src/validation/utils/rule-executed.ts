import { InputralueType, Rule } from "../../contracts";

export class RuleExecuted {
  passed: boolean = false;
  valueTested: InputralueType;
  ruleName!: Rule | string;
  message: string | null = null;
  params: any;
  orignalName!: Rule | string;
  run = false;

  constructor(ruleName: string, originalRuleName: string | Rule) {
    this.ruleName = ruleName;
    this.orignalName = originalRuleName;
  }
  /**
   * Returns true if for the given value, the validation was run and passed
   * @param value
   */
  wasRunWith(value: InputralueType) {
    return this.valueTested === value && this.run;
  }

  isNamed(name: string | Rule): boolean {
    return this.ruleName === name;
  }
}

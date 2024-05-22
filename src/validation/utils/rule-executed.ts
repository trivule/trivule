import { InputValueType, Rule, RuleParam } from '../../contracts';

export class RuleExecuted {
  /**
   * Test if the rule passed
   */
  passed: boolean = false;
  valueTested: InputValueType;
  ruleName!: Rule | string;
  message: string | null = null;
  params: RuleParam;
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
  wasRunWith(value: InputValueType) {
    return this.valueTested === value && this.run;
  }

  isNamed(name: string | Rule): boolean {
    return this.ruleName === name;
  }
}

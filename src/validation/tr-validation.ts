import { InputRule } from "./utils/input-rule";
import { InputValueType, InputType, Rule, RulesMessages } from "../contracts";

import { RuleExecuted } from ".";
import { TrMessages } from "../messages";
import { TrLocal } from "../locale/tr-local";

export class TrValidation {
  private _inputType = "text";
  /**
   * The list of rules that should be executed on the value
   */
  private _rules!: InputRule;

  /**
   * The current value to validate
   */
  private _value: InputValueType = undefined;

  /**
   * A list of rules run
   */
  private _ruleExecuted: RuleExecuted[] = [];
  /**
 
  /**
   * A boolean value indicating whether the validation rules should
   * fail on the first error or continue executing all rules
   */
  private _failOnfirst = true;

  /**
   * The attrabute name that should be used to display the validation errors
   */
  private _attr = "";

  /**
   * An object containing the original validation rules errors as key-value pairs (record) of rule names and error
   * messages
   */
  private _trmessages: Record<string, any> = {};

  /**
   * This method performs the validation process. It iterates over the _rules array and executes each rule on the
   * _value. If _failOnfirst is set to true, the method stops executing rules after the first failure. The method
   * updates the _ruleExecuted array with the result of each rule execution.
   * It returns a boolean value indicating whether the validation passed (true) or not (false)
   * @example
   * const tralidation = new TRalidation(param)
   * tralidation.validate()
   */
  validate() {
    const rules = this._rules.all();

    if (!Array.isArray(rules)) {
      throw new Error("The rule provided must be an array of Rule");
    }

    let inputType = this._inputType as InputType;
    for (const rule of rules) {
      const ruleName = rule.name;
      const params = rule.params;
      const ruleCallback = rule.validate;
      const message = rule.message;

      let ruleToRun = ruleName;

      const ruleExec = this._makeRuleExcutedInstance(ruleToRun, ruleName);

      ruleExec.params = params;

      if (!ruleCallback || typeof ruleCallback !== "function") {
        throw new Error(`The rule ${ruleName} is not defined`);
      }

      const state = ruleCallback(this._value, params, inputType);

      //Indicate if the rule passed
      ruleExec.passed = state.passes;
      //Get the value after validation
      //The value may be converted by the validation callback
      this._value = state.value;

      inputType = state.type ?? inputType;
      ruleToRun = state.alias ?? ruleName;
      //
      ruleExec.valueTested = this._value;
      ruleExec.run = true;
      this._addRuleExecuted(ruleExec);
      // If rule is setup to stop on first fails
      if (this._failOnfirst) {
        if (!ruleExec.passed) {
          this._parseRuleMessage(ruleExec, ruleToRun, message);
          break;
        }
      } else {
        if (!ruleExec.passed) {
          this._parseRuleMessage(ruleExec, ruleToRun, message);
        } else {
          ruleExec.message = null;
        }
      }
    }

    return !this.hasErrors();
  }
  /**
   * Get rule/message error
   * @returns
   */
  getErrors() {
    const r: Record<string, string> = {};
    for (const rx of this._ruleExecuted) {
      if (!rx.passed) {
        r[rx.orignalName] = rx.message ?? "";
      }
    }
    return r;
  }
  /**
   * Check if validation failed
   * @returns
   */
  hasErrors(): boolean {
    return this._ruleExecuted.some((rx) => !rx.passed);
  }

  /**
   * This method is an alias for hasErrors(). It returns true if there are no errors, false otherwise
   */
  passes() {
    return !this.hasErrors();
  }

  /**
   * Set rules to run
   * @param rules
   */
  setRules(rules: InputRule): void {
    this._rules = rules;
  }

  /**
   * Get rules to run
   * @returns
   */
  getRules() {
    return this._rules;
  }

  /**
   * Create an instance of RuleExcuted
   * @param r
   * @returns
   */
  private _makeRuleExcutedInstance(r: string | Rule, originalRuleName: string) {
    let re = this._ruleExecuted.find((rx) => {
      return rx.isNamed(r);
    });
    return re ?? new RuleExecuted(r, originalRuleName);
  }

  private _addRuleExecuted(ruleExecuted: RuleExecuted) {
    if (!this._ruleExecuted.includes(ruleExecuted)) {
      this._ruleExecuted.push(ruleExecuted);
    }
  }
  private _parseRuleMessage(
    ruleExec: RuleExecuted,
    aliasRule: string,
    message: any
  ) {
    const orgMesage = TrLocal.getRuleMessage(ruleExec.orignalName);

    if (message !== orgMesage) {
      this._trmessages[ruleExec.ruleName] = message;
    } else {
      this._trmessages[ruleExec.ruleName] = TrLocal.getRuleMessage(
        aliasRule ?? ruleExec.ruleName
      );
    }

    const trMessages = new TrMessages().setMessages(
      this._trmessages as RulesMessages
    );

    message = TrMessages.parseMessage(
      this._attr,
      ruleExec.ruleName as Rule,
      trMessages.getRulesMessages([ruleExec.ruleName as Rule])[0],
      ruleExec.params
    );

    ruleExec.message = message;

    return ruleExec;
  }

  /**
   * Set the value and validate it automatically
   */
  set value(v: InputValueType) {
    this._value = v;
    this.validate();
  }

  set failsOnFirst(fails: boolean) {
    this._failOnfirst = fails;
  }

  get value(): InputValueType {
    return this._value;
  }

  set attribute(attr: string) {
    this._attr = attr;
  }

  get attribute() {
    return this._attr;
  }
  /**
   * Set validation parameters
   * @param param
   */

  set(rules: InputRule, failsOnfirst: boolean, type: string) {
    this._failOnfirst = failsOnfirst;

    this._rules = rules;
    this._inputType = type ?? this._inputType;
  }

  getRuleExecuted(): RuleExecuted[] {
    return this._ruleExecuted;
  }
  set rules(rules: InputRule) {
    this.setRules(rules);
  }
}

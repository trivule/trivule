import { Rule } from "./rule";
import { CssSelector, TrivuleInputParms, ValidatableInput } from "./types";
export type ITrivuleInputCallback<P, R> = (param: P) => R;

export interface ITrivuleInputObject {
  value: any;
  name: string;
  valid: boolean;
  rules: Rule[] | string[] | Rule | string;
  errors: Record<Rule, string>;
  messages: string[];
  ruleExecuted: {
    rule: string;
    passed: boolean;
  }[];
}

export type InputType =
  | "text"
  | "date"
  | "boolean"
  | "number"
  | "file"
  | "date-local";
export type ValidationState = {
  passes: boolean;
  value: any;
  alias?: Rule;
  type?: InputType;
  message?: string[];
};
export interface ITrivuleInput {
  /**
   * Resets the Trivule input to its initial state.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.reset(); // Resets the Trivule input to its initial state
   */
  reset(): void;

  /**
   * Removes a specific validation rule from the Trivule input.
   * @param rule The name of the rule to be removed.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.removeRule("required"); // Removes the "required" validation rule from the Trivule input
   */
  removeRule(rule: string): this;

  /**
   * Removes multiple validation rules from the Trivule input.
   * @param rules An array of rule names or a single rule name to be removed.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.removeRules(["required", "minlength"]); // Removes the "required" and "minlength" validation rules from the Trivule input
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.removeRules("required"); // Removes the "required" validation rule from the Trivule input
   */
  removeRules(rules: string[] | string): this;

  /**
   * Replaces an existing validation rule with a new one.
   * @param oldRule The rule to be replaced, either as a string, a rule object, or an array of rule names.
   * @param newRule The new rule to replace the old one, optional if oldRule is an object.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.replaceRule("required", "minlength"); // Replaces the "required" rule with the "minlength" rule
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.replaceRule({required: "This field is required", minlength: "Field length must be at least 5 characters"}); // Replaces the existing rules with the new rules provided
   */
  replaceRule(
    oldRule: string | Record<string, string> | string[],
    newRule?: string
  ): this;

  /**
   * Assigns a specific error message to a validation rule for this Trivule input.
   * @param message The error message to assign.
   * @param rule The name of the rule for which the error message will be assigned.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.assignMessage("This field is required", "required"); // Assigns the error message to the "required" rule
   */
  setMessage(message: string, rule: string): this;

  /**
   * Assigns multiple error messages to validation rules for this Trivule input.
   * @param messages An object containing rule names as keys and error messages as values.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.assignMessagesByRules({required: "This field is required", minlength: "Field length must be at least 5 characters"}); // Assigns error messages to the specified rules
   */
  setMessagesByRules(messages: Record<string, string>): this;

  /**
   * Sets the CSS class to be applied when the input is considered invalid.
   * @param className The CSS class name to set.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.setInvalidClass("error"); // Sets the CSS class "error" to be applied when the input is invalid
   */
  setInvalidClass(className: string): this;

  /**
   * Sets the CSS class to be applied when the input is considered valid.
   * @param className The CSS class name to set.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.setValidClass("success"); // Sets the CSS class "success" to be applied when the input is valid
   */
  setValidClass(className: string): this;

  /**
   * Sets an attribute on the Trivule input element.
   * @param attrName The name of the attribute to set.
   * @param value The value to assign to the attribute.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.setAttribute("data-custom", "value"); // Sets the custom attribute "data-custom" with the value "value"
   */
  setAttribute(attrName: string, value: any): this;

  /**
   * Removes an attribute from the Trivule input element.
   * @param attrName The name of the attribute to remove.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.removeAttribute("data-custom"); // Removes the custom attribute "data-custom"
   */
  removeAttribute(attrName: string): this;

  /**
   * Sets whether the input should be automatically validated as the user interacts with it.
   * @param autoValidate A boolean value indicating whether auto-validation should be enabled.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.setAutoValidate(true); // Enables auto-validation for the input
   */
  setAutoValidate(autoValidate: boolean): this;

  /**
   * Sets the value of the input element.
   * @param value The value to set for the input element.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.setValue("example"); // Sets the value of the input element to "example"
   */
  setValue(value: any): this;

  /**
   * Sets the element used to display feedback messages for this input.
   * @param selector The CSS selector or element representing the feedback element.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.setFeedbackElement(".feedback"); // Sets the feedback element using CSS selector ".feedback"
   */
  setFeedbackElement(selector: any): this;

  /**
   * Sets the events that trigger validation of the input.
   * @param eventTriggers The event or events that trigger validation.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.setEventTriggers(["input", "change"]); // Sets events "input" and "change" to trigger validation
   */
  setEventTriggers(eventTriggers: string | string[]): this;

  /**
   * Sets the attribute name used to identify feedback messages for this input.
   * @param attrName The name of the attribute used for feedback messages.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.setMessageAttributeName("data-feedback"); // Sets the feedback message attribute to "data-feedback"
   */
  setMessageAttributeName(attrName?: string): this;

  /**
   * Sets the type of the input element.
   * @param type The type of the input element.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.setType("email"); // Sets the type of the input element to "email"
   */
  setType(type: string): this;

  /**
   * Sets whether validation should stop after the first error is encountered.
   * @param boolean A boolean value indicating whether validation should stop on the first error.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.failsOnfirst(true); // Stops validation on the first error encountered
   */
  failsOnfirst(boolean: boolean): this;

  /**
   * Sets the valid attributes for the input element.
   * @param attrs The valid attributes to be set.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.setValidAttributes({ required: "true", minlength: "5" }); // Sets valid attributes
   */
  setValidAttributes(attrs: Record<string, string>): this;

  /**
   * Sets the invalid attributes for the input element.
   * @param attrs The invalid attributes to be set.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.setInvalidAttributes({ invalid: "true", minlength: "5" }); // Sets invalid attributes
   */
  setInvalidAttributes(attrs: Record<string, string>): this;

  /**
   * Triggers the validation event manually.
   * @param boolean A boolean value indicating whether to trigger the validation event.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.triggerValidateEvent(true); // Manually triggers the validation event
   */
  triggerValidateEvent(boolean: boolean): this;

  /**
   * Sets a callback function to execute when a rule fails for this input.
   * @param rule The rule name for which the callback is set.
   * @param callback The callback function to execute.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.onRuleFail("required", (input) => { console.log("Rule failed:", input); }); // Sets a callback for when the "required" rule fails
   */

  onRuleFail(
    rule: string,
    callback: ITrivuleInputCallback<ITrivuleInput, ITrivuleInput>
  ): this;
  /**
   * Sets a callback function to execute when a rule passes for this input.
   * @param rule The rule name for which the callback is set.
   * @param callback The callback function to execute.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.onRulePass("required", (input) => { console.log("Rule passed:", input); }); // Sets a callback for when the "required" rule passes
   */
  onRulePass(
    rule: string,
    callback: ITrivuleInputCallback<ITrivuleInput, ITrivuleInput>
  ): this;

  /**
   * Sets a callback function to execute before initializing the Trivule input.
   * @param callback The callback function to execute.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.beforeInit((input) => { console.log("Before init:", input); }); // Sets a callback to execute before initializing the Trivule input
   */
  beforeInit(callback: ITrivuleInputCallback<ITrivuleInput, any>): void;

  /**
   * Sets a callback function to execute after initializing the Trivule input.
   * @param callback The callback function to execute.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.afterInit((input) => { console.log("After init:", input); }); // Sets a callback to execute after initializing the Trivule input
   */
  afterInit(callback: ITrivuleInputCallback<ITrivuleInput, any>): void;

  /**
   * Sets a callback function to execute before running a rule on the Trivule input.
   * @param rule The rule name for which the callback is set.
   * @param callback The callback function to execute.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.beforeRunRule("required", (input) => { console.log("Before rule:", input); }); // Sets a callback to execute before running the "required" rule
   */
  beforeRunRule(
    rule: string,
    callback: ITrivuleInputCallback<ITrivuleInput, ITrivuleInput>
  ): this;

  /**
   * Sets a callback function to execute after running a rule on the Trivule input.
   * @param rule The rule name for which the callback is set.
   * @param callback The callback function to execute.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.afterRunRule("required", (input) => { console.log("After rule:", input); }); // Sets a callback to execute after running the "required" rule
   */
  afterRunRule(
    rule: string,
    callback: ITrivuleInputCallback<ITrivuleInput, ITrivuleInput>
  ): this;

  /**
   * Gets the feedback element associated with this Trivule input.
   * @returns The feedback element if set, otherwise null.
   */
  getFeedbackElement(): HTMLElement | null;

  /**
   * Sets the input element for this Trivule input instance.
   * @param element The input element to set.
   * @returns This Trivule input instance.
   */
  setInputElement(element: ValidatableInput): this;

  /**
   * Sets the parameters for this Trivule input instance.
   * @param params The parameters to set.
   * @returns This Trivule input instance.
   */
  setParams(params?: TrivuleInputParms): this;

  /**
   * Sets the validation rules for this Trivule input instance.
   * @param rules The validation rules to set.
   * @returns This Trivule input instance.
   */
  setRules(rules?: Rule[] | string[] | Rule | string): this;

  /**
   * Pushes an additional validation rule to the existing rules for this Trivule input instance.
   * @param existingRuleName The name of the existing rule to add to.
   * @returns This Trivule input instance.
   */
  pushRule(existingRuleName: string): this;
}

export * from "./rule";
export * from "./input-change-event";
export * from "./rule-callback";
export * from "./rules-bag.interface";
export * from "./config";
export * from "./types";

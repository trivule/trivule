import { Rule } from "./rule";
export type ITrivuleInputCallback<P, R> = (param: P) => R;

/**
 * Configuration interface
 */
export interface ITrConfig {
  invalidClass?: string;
  validClass?: string;
  local?: {
    lang: string;
  };
  realTime?: boolean;
}

export type RuleParam = string | number | undefined;

export interface ITrivuleInputObject {
  value: InputValueType;
  name: string;
}
export type RuleType = {
  name: string;
  message?: string;
  params?: RuleParam;
  validate?: RuleCallBack;
};

export type InputType =
  | "text"
  | "date"
  | "boolean"
  | "number"
  | "file"
  | "date-local";
export type ValidationState = {
  passes: boolean;
  value: unknown;
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
  setAttribute(attrName: string, value: string | Record<string, string>): this;

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
  setValue(value: InputValueType): this;

  /**
   * Sets the element used to display feedback messages for this input.
   * @param selector The CSS selector or element representing the feedback element.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.setFeedbackElement(".feedback"); // Sets the feedback element using CSS selector ".feedback"
   */
  setFeedbackElement(selector: CssSelector): this;

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
    rule: string | Rule,
    callback: ITrivuleInputCallback<ITrivuleInput, ITrivuleInput>
  ): this;

  /**
   * Sets a callback function to execute before initializing the Trivule input.
   * @param callback The callback function to execute.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.beforeInit((input) => { console.log("Before init:", input); }); // Sets a callback to execute before initializing the Trivule input
   */
  beforeInit(callback: ITrivuleInputCallback<ITrivuleInput, unknown>): void;

  /**
   * Sets a callback function to execute after initializing the Trivule input.
   * @param callback The callback function to execute.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.afterInit((input) => { console.log("After init:", input); }); // Sets a callback to execute after initializing the Trivule input
   */
  afterInit(callback: ITrivuleInputCallback<ITrivuleInput, unknown>): void;

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
   * @param rule The rule to add to.
   * @returns This Trivule input instance.
   */
  pushRule(rule: {
    rule: string;
    message?: string | null;
    param?: RuleParam;
    validate?: RuleCallBack;
    local?: string;
  }): this;

  getMessages(): string | string[] | Record<string, string> | undefined;
  getMessageAttributeName(): string;
  hasRule(rule: Rule | string): boolean;
  prependRule(ule: {
    rule: string;
    message?: string | null;
    param?: RuleParam;
    validate?: RuleCallBack;
    local?: string;
  }): this;
  appendRule(rule: {
    rule: string;
    message?: string | null;
    param?: RuleParam;
    validate?: RuleCallBack;
    local?: string;
  }): this;
  insertBeforeRule(rule: {
    oldRule: string | Rule;
    newRule: string | Rule;
    message?: string | null;
    param?: RuleParam;
    validate?: RuleCallBack | undefined;
    local?: string;
  }): this;
  insertAfterRule(rule: {
    oldRule: string | Rule;
    newRule: string | Rule;
    message?: string | null;
    param?: RuleParam;
    validate?: RuleCallBack | undefined;
    local?: string;
  }): this;
  getRules(): RuleType[];
}

/**
 * tr.input.validated event details
 */
export type InputEventDetails = {
  rules: Rule[];
  element: HTMLInputElement | HTMLTextAreaElement;
  input: Record<string, string>;
};

/**
 * Input change event
 */
export interface InputChangeEvent {
  details: InputEventDetails;
}

/**
 * Rule callback
 */
export interface RuleCallBack {
  (input: unknown, param?: RuleParam, type?: InputType): ValidationState;
}

export type RulesBag = {
  [ruleName in Rule]: RuleCallBack;
};

export type RulesMessages = {
  [key: string]: string;
};
import { TrivuleForm } from "../validation";

/**
 * Represents a CSS selector that can be either an HTMLElement or a string.
 * @typedef {HTMLElement | string} CssSelector
 */
export type CssSelector = HTMLElement | string;

/**
 * Represents a validatable HTML form input element.
 */
export type ValidatableInput =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLElement
  | HTMLSelectElement
  | "select"
  | "textarea"
  | "input"
  | string;

/**
 * Represents a validatable HTML form element.
 */
export type ValidatableForm = HTMLElement | string | "form";
/**
 * The possible input types expected to be gotten
 */
export type InputValueType =
  | string
  | Blob
  | File
  | number
  | null
  | boolean
  | undefined
  | FileList
  | File[]
  | Blob[]
  | Record<string, unknown>;

/**
 * An Element or null type
 */
export type ElementOrNull = HTMLElement | null;

/**
 * Indicates whether the message should be displayed
 */
export type WayDisplayError = "first" | "last" | "full";

/**
 * Input parameters that can be passed to TrivuleInput instance
 */
export type TrivuleInputParms = {
  selector?: ValidatableInput | null;
  /**
   * The HTML element that will be used to display error messages for this input element.
   */
  feedbackElement?: CssSelector | null;
  /**
   * An array of rules that will be used to validate the input element.
   */
  rules?: Rule[] | string[] | Rule | string;
  /**
   * An object that maps rule names to error messages.
   */
  messages?: string[] | string | Record<string, string>;
  /**
   * The name of the input element.
   */
  name?: string;
  /**
   * The way that error messages will be displayed.
   */
  showMessage?: WayDisplayError;
  /**
   * An array of events that will trigger validation of the input element.
   */
  events?: string[];
  /**
   * Check if input will be validated when user tape into input
   */
  autoValidate?: boolean;

  /**
   * The attribute that will be used to display the error message instead of using the input name directly
   */
  attribute?: string;

  /**
   *If this field is true, the validation will stop at the first error. And will display the error at the same time
   */
  failsOnfirst?: boolean;
  /**
   * If this field is true, each time the validation has been performed,
   * a tr.input.validated event will be emitted, on which we can connect listeners for example
   */
  emitEvent?: boolean;

  /**
   * The css class that will be added to the input each time the form is valid
   */
  validClass?: string;

  /**
   * The css class that will be added to the input each time the form is invalid
   */
  invalidClass?: string;
  /**
   * Indicates input type
   */
  type?: string;

  realTime?: boolean;
};

/**
 * Callback function for handling events.
 *
 * @param event - The event object.
 */
export type EventCallback = (event: Event) => unknown;

/**
 * Callback function for handling events.
 *
 * @param details - The event object.
 */
export type EventCallbackWithDetails<T> = (details: T) => void;
export type TrivuleFormConfig = {
  /**
   * Specifies whether the form will be validated as the user types in the form fields
   */
  auto?: boolean;

  local?: {
    lang?: string;
  };
  /**
   * The css valid class  that will be added to all the input in  the form
   */
  validClass?: string;

  /**
   * The css invalid class that will be added to all the input in the form
   */
  invalidClass?: string;

  feedbackSelector?: string;
  realTime?: boolean;
};

export type TrivuleFormHandler = (tr: TrivuleForm) => unknown;

export * from "./rule";

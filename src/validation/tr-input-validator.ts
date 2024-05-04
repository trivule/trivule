import { AbstractInputralidator } from "./abstract-input";
import {
  EventCallback,
  TrivuleInputParms,
  ValidatableInput,
} from "../contracts/types";
import { RuleExecuted } from "./utils/rule-executed";
import { ITrivuleInput, ITrivuleInputCallback } from "../contracts";

export class TrivuleInputValidator
  extends AbstractInputralidator
  implements ITrivuleInput
{
  /**
   * Check if pass event should be emitted
   */
  private _emitOnPasses = true;
  /**
   * Check if fails event should be emitted
   */
  private _emitOnFails = true;

  constructor(inputElement: ValidatableInput, params?: TrivuleInputParms) {
    super(inputElement, params);
  }
  /**
   * Performs validation on the input element. And emits tr.input.validated event if necessary.
   * @returns true if the input element is valid, false otherwise.
   * Example:
   * ```
   * const trivuleInput = new TrivuleInput(inputElement);
   * const isValid = trivuleInput.validate();
   * if (isValid) {
   *   // Proceed with form submission or handle valid input
   * } else {
   *   // Display error messages or handle invalid input
   * }
   * ```
   */
  validate(emitEmit = true) {
    this.valid();
    this.setralidationClass();
    this.errors = this.validator.getMessages();
    if (emitEmit) {
      this.emitChangeEvent();
    }
    return this._passed;
  }

  /**
   * Returns the validation rules defined for the input element.
   * @returns An array of validation rules.
   * Example:
   * ```
   * const trivuleInput = new TrivuleInput(inputElement);
   * const rules = trivuleInput.getRules();
   * console.log(rules); // Output: ['required', 'email']
   * ```
   */
  getRules() {
    return this.rules;
  }
  /**
   * Checks if the input element has validation rules.
   * @returns A boolean indicating if rules are defined.
   * Example:
   * ```
   * const trivuleInput = new TrivuleInput(inputElement);
   * const hasRules = trivuleInput.hasRules();
   * console.log(hasRules); // Output: true or false
   * ```
   */
  hasRules() {
    return this.rules.length > 0;
  }

  /**
   * Get the validation messages associated with the input element.
   * @returns An object containing the validation messages.
   * Example:
   * ```
   * const trivuleInput = new TrivuleInput(inputElement);
   * const messages = trivuleInput.getMessages();
   * console.log(messages);
   * ```
   */
  getMessages(): (string | null)[] {
    return this.validator.getMessages();
  }

  /**
   * Performs validation on the input element using the defined validation rules. Don't emit tr.input.passes or tr.input.fails event
   * @returns true if the input element is valid, false otherwise.
   * Example:
   * ```
   * const trivuleInput = new TrivuleInput(inputElement);
   * const isValid = trivuleInput.valid();
   * if (isValid) {
   *   // Proceed with form submission or handle valid input
   * } else {
   *   // Display error messages or handle invalid input
   * }
   * ```
   */
  valid() {
    this.validator.value = this.getValue();
    return (this._passed = this.validator.passes());
  }

  /**
   * Emits a custom event to the inputElement element.
   *
   * @param e - The name of the custom event to emit.
   * @param data - The additional data to pass with the event.
   */
  emit(e: string, data?: any): void {
    const event = new CustomEvent(e, { detail: data });
    this.inputElement.dispatchEvent(event);
  }

  /**
   * Attach an event listener to the inputElement element.
   *
   * @param e - The name of the event to listen to.
   * @param fn - The callback function to execute when the event occurs.
   * This function takes an event of type `Event` as a parameter and returns nothing.
   * Example: `(event) => { ... }`
   */
  on(e: string, fn: EventCallback): void {
    this.inputElement.addEventListener(e, fn);
  }
  /**
   * Emit event if input change
   */
  private emitChangeEvent() {
    if (this.param.emitEvent) {
      if (this._passed) {
        if (this._emitOnPasses) {
          this.emit("tr.input.passes", {
            detail: {
              rules: this.rules,
              input: {},
              element: this.inputElement,
            },
          });
          //Disable on passes emition until, validation failed
          this._emitOnPasses = false;
          //Enable on fails emitions
          this._emitOnFails = true;
        }
      } else {
        if (this._emitOnFails) {
          this.emit("tr.input.fails", {
            detail: {
              rules: this.rules,
              input: {},
              element: this.inputElement,
            },
          });
          //Enable on passes emitions
          this._emitOnPasses = true;
          // Disable on fails emitions, until validation passes
          this._emitOnFails = false;
        }
      }
    }
  }

  getErrors(): Record<string, string> {
    return this.validator.getErrors();
  }
  /**
   * Check if the input element has failed validation.
   * @returns `true` if the input element has failed validation, `false` otherwise.
   * Example:
   * ```
   * const trivuleInput = new TrivuleInput(inputElement);
   * if (trivuleInput.fails()) {
   *   console.log('Validation failed');
   * } else {
   *   console.log('Validation succeeded');
   * }
   * ```
   */
  fails(): boolean {
    return !this.passes();
  }
  /**
   *  Check if the validation was successful passed
   * @returns
   */
  passes() {
    return this.valid();
  }
  /**
   * Invokes the provided function with the given parameters if it is a valid function.
   * @param fn - The function to be called.
   * @param params - The parameters to be passed to the function.
   */
  protected __call(fn?: CallableFunction, ...params: any) {
    if (typeof fn == "function") {
      fn(...params);
    }
  }

  getRuleExecuted(): RuleExecuted[] {
    return this.validator.getRuleExecuted();
  }

  filledErrors(errors?: string[]) {
    this.errors = errors ?? this.validator.getMessages();
  }
  reset(): void {}
  removeAttribute(attrName: string): this {
    return this;
  }
  removeRule(rule: string): this {
    return this;
  }

  removeRules(rules: string[] | string): this {
    return this;
  }

  replaceRule(
    oldRule: string | Record<string, string> | string[],
    newRule?: string
  ): this {
    return this;
  }

  setAttribute(attrName: string, value: any): this {
    return this;
  }

  setMessage(message: string, rule: string): this {
    return this;
  }
  setMessagesByRules(messages: Record<string, string>): this {
    return this;
  }
  setInvalidAttributes(attrs: Record<string, string>): this {
    return this;
  }
  setInvalidClass(className: string): this {
    return this;
  }
  setValidAttributes(attrs: Record<string, string>): this {
    return this;
  }
  setValue(value: any): this {
    return this;
  }
  setValidClass(className: string): this {
    return this;
  }
  setAutoValidate(autoValidate: boolean): this {
    return this;
  }
  setEventTriggers(eventTriggers: string | string[]): this {
    return this;
  }
  setType(type: string): this {
    return this;
  }
  beforeRunRule(
    rule: string,
    callback: ITrivuleInputCallback<ITrivuleInput, ITrivuleInput>
  ): this {
    return this;
  }
  afterRunRule(
    rule: string,
    callback: ITrivuleInputCallback<ITrivuleInput, ITrivuleInput>
  ): this {
    return this;
  }
  beforeInit(callback: ITrivuleInputCallback<ITrivuleInput, any>): void {}

  afterInit(callback: ITrivuleInputCallback<ITrivuleInput, any>): void {}

  onRuleFail(
    rule: string,
    callback: ITrivuleInputCallback<ITrivuleInput, ITrivuleInput>
  ): this {
    return this;
  }
  onRulePass(
    rule: string,
    callback: ITrivuleInputCallback<ITrivuleInput, ITrivuleInput>
  ): this {
    return this;
  }

  triggerValidateEvent(boolean: boolean = true): this {
    return this;
  }
  failsOnfirst(boolean: boolean = true): this {
    return this;
  }
  getFeedbackElement(): HTMLElement | null {
    return this.feedbackElement;
  }
  pushRule(existingRuleName: string): this {
    return this;
  }
}

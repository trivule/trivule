import {
  EventCallback,
  InputType,
  ITrivuleInput,
  ITrivuleInputCallback,
  Rule,
  RuleCallBack,
  RuleParam,
  TrivuleHooks,
  TrivuleInputParms,
  ValidatableInput,
} from '../contracts';
import { AbstractInputralidator } from './abstract-input';
import { TrBag } from './tr-bag';
import { TrParameter } from './utils/parameter';
import { RuleExecuted } from './utils/rule-executed';

/**
 * TrivuleInput is responsible for applying live validation to an HTML input element.
 * Creates an instance of TrivuleInput.
 * @param inputElement The HTML input element to apply live validation to.
 * @param config Optional configuration object for TrivuleInput.
 * Example:
 * ```
 * const inputElement = document.getElementById("myInput") as HTMLInputElement;
 * const trivuleInput = new TrivuleInput(inputElement);
 * trivuleInput.init();
 * ```
 */
export class TrivuleInput extends AbstractInputralidator {
  constructor(
    inputElement: ValidatableInput | TrivuleInputParms,
    param?: TrivuleInputParms,
    parameter?: TrParameter,
  ) {
    super(inputElement, param, parameter);
    this.init();
  }

  /**
   * Initializes live validation on the input element.
   * Example:
   * ```
   * const trivuleInput = new TrivuleInput(inputElement);
   * trivuleInput.init();
   * ```
   */
  init() {
    if (!this.__wasInit) {
      this.executeHooks('before.init');
      if (this.autoValidate) {
        this.__wasInit = true;
        this.events.forEach((e) => {
          this.inputElement.addEventListener(e, () => {
            if (!this.realTime) {
              if (e != 'input' && e != 'keyup' && e != 'keydown') {
                this.value = this.getInputElemenyValue();
                this.emit('tr.input.update', {
                  detail: {
                    rules: this.rules,
                    input: {},
                    element: this.inputElement,
                  },
                });
              }
            } else {
              this.value = this.getInputElemenyValue();
              this.emit('tr.input.update', {
                detail: {
                  rules: this.rules,
                  input: {},
                  element: this.inputElement,
                },
              });
            }
          });
        });
      }
      this.executeHooks('after.init');
    }
  }
  /**
   * Add new rule to input element
   * @param ruleName
   * @param call
   * @param message
   */
  rule(ruleName: string, call: RuleCallBack, message?: string) {
    TrBag.rule(ruleName, call, message);
  }

  with(param: TrivuleInputParms) {
    this.setParams(param);
  }

  whereName(inputName: string): boolean {
    return this.name === inputName;
  }

  onFails(fn: EventCallback) {
    this.on('tr.input.fails', () => {
      this.__call(fn, this);
    });
  }

  onPasses(fn: EventCallback) {
    this.on('tr.input.passes', () => {
      this.__call(fn, this);
    });
  }

  onUpdate(fn: EventCallback) {
    this.on('tr.input.update', () => {
      this.__call(fn, this);
    });
  }

  destroy() {
    this.param.events?.forEach((e) => {
      this.inputElement.removeEventListener(e, () => {
        this.validate();
      });
    });
    this.param.events = [];
    this.rules.clear();
    this.param.rules = [];
    this.executeHooks('destroy');
  }

  is(input: HTMLInputElement) {
    return input === this.inputElement;
  }
  private hooks: Record<TrivuleHooks, ITrivuleInputCallback<ITrivuleInput>[]> =
    {
      'before.init': [],
      'after.init': [],
      destroy: [],
    };
  _validateCount = 0;
  /**
   * Check if pass event should be emitted
   */
  private _emitOnPasses = true;
  /**
   * Check if fails event should be emitted
   */
  private _emitOnFails = true;

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
  validate() {
    this.valid();
    this.setralidationClass();
    this.errors = this.validator.getErrors();
    if (this.emitOnValidate) {
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
    return this.rules.all();
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
  getMessages() {
    return this.messages;
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
    this.validator.value = this.value;
    this._validateCount++;
    return (this._passed = this.validator.passes());
  }

  /**
   * Emits a custom event to the inputElement element.
   *
   * @param e - The name of the custom event to emit.
   * @param data - The additional data to pass with the event.
   */
  emit(e: string, data?: unknown): void {
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
    if (this._passed) {
      if (this._emitOnPasses) {
        this.emit('tr.input.passes', {
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
        this.emit('tr.input.fails', {
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
  protected __call(fn?: CallableFunction, ...params: unknown[]) {
    if (typeof fn == 'function') {
      fn(...params);
    }
  }

  getRuleExecuted(): RuleExecuted[] {
    return this.validator.getRuleExecuted();
  }

  filledErrors(errors?: string[]) {
    this.errors = errors ?? this.validator.getErrors();
  }
  /**
   * Removes an attribute from the Trivule input element.
   * @param attrName The name of the attribute to remove.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.removeNativeAttribute("data-custom"); // Removes the custom attribute "data-custom"
   */
  removeNativeAttribute(attrName: string): this {
    this.inputElement?.removeAttribute(attrName);
    return this;
  }
  /**
   * Retrieves the value of a native attribute from the Trivule input element.
   *
   * This method attempts to get the attribute value using the `getAttribute` method
   * of the underlying `inputElement`. If the element doesn't have the attribute,
   * it returns `undefined`.
   *
   * @param attrName The name of the attribute to retrieve.
   * @returns The value of the attribute if it exists, otherwise `undefined`.
   */
  getNativeAttribute(attrName: string) {
    return this.inputElement?.getAttribute(attrName);
  }
  /**
   * Checks if the Trivule input element has a specific native attribute.
   * @param attrName The name of the attribute to check.
   * @returns `true` if the attribute exists, `false` otherwise.
   */
  hasNativeAttribute(attrName: string): boolean {
    return this.inputElement?.hasAttribute(attrName) ?? false;
  }
  /**
   * Sets the value of a native attribute on the Trivule input element.
   *
   * This method uses the `setAttribute` method of the underlying `inputElement`
   * to set the value of the specified attribute.
   *
   * @param attrName The name of the attribute to set.
   * @param value The value to assign to the attribute.
   * @returns This Trivule input instance for method chaining.
   */
  setNativeAttribute(attrName: string, value: string): this {
    this.inputElement?.setAttribute(attrName, value);
    return this;
  }
  /**
   * Removes a specific validation rule from the Trivule input.
   * @param rule The name of the rule to be removed.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.removeRule("required"); // Removes the "required" validation rule from the Trivule input
   */
  removeRule(rule: string): this {
    this.rules.remove(rule);
    return this;
  }

  /**
   * Removes multiple validation rules from the Trivule input.
   * @param rules An array of rule names.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.removeRules(["required", "minlength"]); // Removes the "required" and "minlength" validation rules from the Trivule input
   */
  removeRules(rules: string[]): this {
    if (Array.isArray(rules)) {
      rules.forEach((rule) => this.removeRule(rule));
    }
    return this;
  }

  /**
   * Replaces an existing validation rule with a new one.
   * @param oldRule The rule to be replaced.
   * @param newRule The new rule to replace the old one
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.replaceRule("required", "minlength"); // Replaces the "required" rule with the "minlength" rule
   */
  replaceRule(oldRule: string, newRule: string): this {
    this.$rules.replace(oldRule, newRule);
    return this;
  }
  /**
   * Sets the CSS class to be applied when the input is considered invalid.
   * @param className The CSS class name to set.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.setInvalidClass("error"); // Sets the CSS class "error" to be applied when the input is invalid
   */
  setInvalidClass(className: string): this {
    this.invalidClass = className;
    return this;
  }
  /**
   * Sets the value of the input element.
   * @param value The value to set for the input element.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.setValue("example"); // Sets the value of the input element to "example"
   */
  setValue(value: string): this {
    this.value = value;
    return this;
  }
  /**
   * Sets the CSS class to be applied when the input is considered valid.
   * @param className The CSS class name to set.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.setValidClass("success"); // Sets the CSS class "success" to be applied when the input is valid
   */
  setValidClass(className: string): this {
    this.validClass = className;
    return this;
  }
  /**
   * Sets whether the input should be automatically validated as the user interacts with it.
   * @param autoValidate A boolean value indicating whether auto-validation should be enabled.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.setAutoValidate(true); // Enables auto-validation for the input
   */
  setAutoValidate(autoValidate: boolean): this {
    this.autoValidate = autoValidate;
    return this;
  }
  /**
   * Sets the events that trigger validation of the input.
   * @param eventTriggers The event or events that trigger validation.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.setEventTriggers(["input", "change"]); // Sets events "input" and "change" to trigger validation
   */
  setEventTriggers(eventTriggers: string | string[]): this {
    this.events = this.eventToArray(eventTriggers);
    return this;
  }

  /**
   * Sets the type of the input element.
   * @param type The type of the input element.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.setType("email"); // Sets the type of the input element to "email"
   */
  setType(type: string): this {
    this._type = type as InputType;
    return this;
  }
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
    callback: ITrivuleInputCallback<ITrivuleInput>,
  ): this {
    this.addHook(`before.run.${rule}`, callback);
    return this;
  }
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
    callback: ITrivuleInputCallback<ITrivuleInput>,
  ): this {
    this.addHook(`after.run.${rule}`, callback);
    return this;
  }
  /**
   * Sets a callback function to execute before initializing the Trivule input.
   * @param callback The callback function to execute.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.beforeInit((input) => { console.log("Before init:", input); }); // Sets a callback to execute before initializing the Trivule input
   */
  beforeInit(callback: ITrivuleInputCallback<ITrivuleInput>): this {
    this.addHook('before.init', callback);
    return this;
  }

  /**
   * Sets a callback function to execute after initializing the Trivule input.
   * @param callback The callback function to execute.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.afterInit((input) => { console.log("After init:", input); }); // Sets a callback to execute after initializing the Trivule input
   */
  afterInit(callback: ITrivuleInputCallback<ITrivuleInput>): this {
    this.addHook('after.init', callback);
    return this;
  }
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
    rule: string | Rule,
    callback: ITrivuleInputCallback<ITrivuleInput>,
  ): this {
    this.addHook(`after.fails.${rule}`, callback);
    return this;
  }
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
    callback: ITrivuleInputCallback<ITrivuleInput>,
  ): this {
    this.addHook(`after.passes.${rule}`, callback);
    return this;
  }
  /**
   * Triggers the validation event manually.
   * @param boolean A boolean value indicating whether to trigger the validation event.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.triggerValidateEvent(true); // Manually triggers the validation event
   */
  triggerValidateEvent(boolean: boolean = true): this {
    this.emitOnValidate = boolean;
    return this;
  }
  /**
   * Sets whether validation should stop after the first error is encountered.
   * @param boolean A boolean value indicating whether validation should stop on the first error.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.failsOnfirst(true); // Stops validation on the first error encountered
   */
  failsOnfirst(boolean: boolean = true): this {
    this.validator.failsOnFirst = boolean;
    return this;
  }
  /**
   * Gets the feedback element associated with this Trivule input.
   * @returns The feedback element if set, otherwise null.
   */
  getFeedbackElement() {
    return this.feedbackElement;
  }
  getRealTimeState() {
    return this.realTime;
  }
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
  }): this {
    this.appendRule(rule);
    return this;
  }
  hasRule(rule: string): boolean {
    return this.rules.has(rule);
  }
  appendRule(rule: {
    rule: string;
    message?: string | null;
    param?: RuleParam;
    validate?: RuleCallBack;
    local?: string;
  }): this {
    this.rules.append(
      rule.rule,
      rule.message,
      rule.param,
      rule.validate,
      rule.local,
    );
    return this;
  }
  prependRule(rule: {
    rule: string;
    message?: string | null;
    param?: RuleParam;
    validate?: RuleCallBack;
    local?: string;
  }): this {
    this.rules.prepend(
      rule.rule,
      rule.message,
      rule.param,
      rule.validate,
      rule.local,
    );
    return this;
  }
  insertAfterRule(rule: {
    oldRule: string | Rule;
    newRule: string | Rule;
    message?: string | null;
    param?: RuleParam;
    validate?: RuleCallBack | undefined;
    local?: string;
  }): this {
    this.rules.insertAfter(
      rule.oldRule,
      rule.newRule,
      rule.message,
      rule.param,
      rule.validate,
      rule.local,
    );
    return this;
  }
  insertBeforeRule(rule: {
    oldRule: string | Rule;
    newRule: string | Rule;
    message?: string | null;
    param?: RuleParam;
    validate?: RuleCallBack | undefined;
    local?: string;
  }): this {
    this.rules.insertBefore(
      rule.oldRule,
      rule.newRule,
      rule.message,
      rule.param,
      rule.validate,
      rule.local,
    );
    return this;
  }

  enableRealTime() {
    this.realTime = true;
    return this;
  }
  disableRealTime() {
    this.realTime = false;
    this.events = this._events;
    return this;
  }
  isRealTimeEnabled() {
    return this.realTime;
  }
  /**
   * Adds a callback to be executed for a specific hook.
   * @param hook The name of the hook.
   * @param callback The callback function to be executed when the hook is triggered.
   */
  private addHook(
    hook: TrivuleHooks,
    callback: ITrivuleInputCallback<ITrivuleInput>,
  ): void {
    if (!this.hooks[hook]) {
      this.hooks[hook] = [];
    }
    this.hooks[hook].push(callback);
  }

  /**
   * Execute all callbacks for a specific hook.
   * @param hook The name of the hook.
   */
  private executeHooks(hook: TrivuleHooks): void {
    const callbacks = this.hooks[hook];
    if (callbacks) {
      callbacks.forEach((callback) => callback(this));
    }
  }
}

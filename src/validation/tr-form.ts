import {
  EventCallback,
  TrivuleFormConfig,
  TrivuleFormHandler,
  TrivuleInputParms,
  RuleCallBack,
  ValidatableForm,
  ITrivuleInputObject,
  ITrivuleInputCallback,
  ValidatableInput,
} from "../contracts";
import { TrLocal } from "../locale/tr-local";
import { isBoolean, isNumber } from "../rules";
import { FormValidator } from "../rules/form/form-validator";
import {
  getHTMLElementBySelector,
  tr_attr_get,
  transformToArray,
} from "../utils";
import { TrBag } from "./tr-bag";
import { TrivuleInput } from "./tr-input";
import { TrParameter } from "./utils/parameter";

/**
 * TrivuleForm is responsible for applying live validation to an HTML form.
 * Creates an instance of TrivuleForm.
 * @param formElement The HTML form element to apply live validation to.
 * Example:
 * ```
 * const formElement = document.getElementById("myForm") as HTMLFormElement;
 * const trivuleForm = new TrivuleForm(formElement);
 * trivuleForm.init();
 * ```
 */
export class TrivuleForm {
  private __calledCount = 0;
  /**
   * This status indicates the current state of the form
   */
  private _passed = false;
  /**
   * Form validator instance
   */
  private _formValidator!: FormValidator;
  /***
   * Check that if passes event can be emitted
   */
  private _emitOnPasses = true;
  /***
   * Check that if passes event can be emitted
   */
  private _emitOnFails = true;

  /**
   * The class that indicates the submit button is enabled
   */
  private _trEnabledClass = "etr-enabled";
  /**
   * The class that indicates the submit button is disabled
   */
  private _trDisabledClass = "tr-disabled";

  /**
   * The html form
   */
  private container!: HTMLElement;

  /**
   * The inputs rules
   */
  private _trivuleInputs: Record<string, TrivuleInput> = {};
  /**
   * The submition input
   */
  submitButton!: HTMLElement;

  /**
   * Tr Config object
   */
  protected config: TrivuleFormConfig = {
    auto: true,
    realTime: true,
  };

  parameter!: TrParameter;

  private _onUpdateCallbacks: TrivuleFormHandler[] = [];

  private _wasInit = false;
  constructor(container: ValidatableForm, config?: TrivuleFormConfig) {
    this.parameter = new TrParameter();
    this.setContainer(container);
    this._formValidator = new FormValidator(this.container);
    this.setConfig(config);
    this._initTrivuleInputs();
    this.init();
  }

  private setContainer(container: ValidatableForm) {
    if (!(container instanceof HTMLElement)) {
      const el = document.querySelector<HTMLFormElement>(container);
      if (el) {
        container = el;
      }
    }

    if (!(container instanceof HTMLElement)) {
      throw new Error("The 'html container or html form' doesn't exist.");
    }

    this.container = container;

    const submitButton =
      this.container.querySelector<HTMLElement>("[data-tr-submit]");

    if (submitButton) {
      this.submitButton = submitButton;
    }
  }
  /**
   * Initializes live validation on the form element.
   * Example:
   * ```
   * const trivuleForm = new TrivuleForm(formElement);
   * trivuleForm.init();
   * ```
   */
  init() {
    if (!this._wasInit) {
      this._wasInit = true;
      if (this.config.auto) {
        this.disableButton();
      }

      this.emit("tr.form.init", this);

      this._onSubmit();

      this.onFails((e) => {
        this.disableButton();
      });

      this.onPasses((e) => {
        this.enableButton();
      });
    }
  }
  /**
   * Disable submission  button on failed
   */
  disableButton() {
    if (this.submitButton) {
      if (this.config.auto) {
        this.submitButton.setAttribute("disabled", "true");
      }
      if (this._trDisabledClass) {
        //removeClass enable
        const classArrayEnabled: string[] = this._trEnabledClass.split(" ");
        for (const value of classArrayEnabled) {
          this.submitButton.classList.remove(value);
        }
        //add class en disabled dataset
        this._trDisabledClass = tr_attr_get(
          this.submitButton,
          "disabled-class",
          this._trDisabledClass
        );
        const classArray: string[] = this._trDisabledClass.split(" ");
        for (const value of classArray) {
          this.submitButton.classList.add(value);
        }
      }
    }
  }

  /**
   * Enable submission button on success
   */
  enableButton() {
    if (this.submitButton) {
      this.submitButton.removeAttribute("disabled");
      if (this._trEnabledClass) {
        //removeClass disabled
        const classArrayDisabled: string[] = this._trDisabledClass.split(" ");
        for (const value of classArrayDisabled) {
          this.submitButton.classList.remove(value);
        }
        //add class en enabled dataset
        this._trEnabledClass = tr_attr_get(
          this.submitButton,
          "enabled-class",
          this._trEnabledClass
        );
        const classArray: string[] = this._trEnabledClass.split(" ");
        for (const value of classArray) {
          this.submitButton.classList.add(value);
        }
      }
    }
  }

  /**
   * Retrieves all inputs from the form.
   * @param strict - If true, returns objects with only name, value, and validation status of each input; otherwise, returns TrivuleInput instances.
   * @returns An array of all inputs based on the strict flag.
   */

  inputs(strict = true): ITrivuleInputObject[] | TrivuleInput[] {
    if (strict) {
      return this.inputsToArray().map(this.getInputsMap);
    }
    return this.inputsToArray();
  }
  /**
   * Retrieves the list of validated inputs.
   * @param strict - If true, returns objects with only name, value, and validation status of each input; otherwise, returns TrivuleInput instances.
   * @returns An array of validated inputs based on the strict flag.
   */

  validated(strict: boolean = false): ITrivuleInputObject[] | TrivuleInput[] {
    if (strict) {
      return this.inputsToArray()
        .filter((t) => t.passes())
        .map(this.getInputsMap);
    }
    return this.inputsToArray().filter((t) => t.passes());
  }
  /**
   * Retrieves the list of failed inputs.
   * @param strict - If true, returns objects with only name, value, and validation status of each input; otherwise, returns TrivuleInput instances.
   * @returns An array of failed inputs based on the strict flag.
   */

  failed(strict: boolean = false): ITrivuleInputObject[] | TrivuleInput[] {
    if (strict) {
      return this.inputsToArray()
        .filter((t) => t.fails())
        .map(this.getInputsMap);
    }
    return this.inputsToArray().filter((t) => t.fails());
  }
  /**
   * Converts a TrivuleInput instance into an ITrivuleInputObject format.
   * @param trivuleInput - The TrivuleInput instance to convert.
   * @returns An object representing the input data: name, value, and validation status.
   */
  private getInputsMap(trivuleInput: TrivuleInput): ITrivuleInputObject {
    return {
      name: trivuleInput.getName(),
      value: trivuleInput.getValue(),
      valid: trivuleInput.passes(),
      rules: trivuleInput.getRules(),
      ruleExecuted: trivuleInput.getRuleExecuted().map((rule) => {
        return { rule: rule.ruleName, passed: rule.passed };
      }),
      errors: trivuleInput.getErrors(),
    };
  }

  /**
   * Check if the form is valid
   * @returns
   */
  isValid() {
    const passes: boolean[] = [];
    this.each((trInput) => {
      passes.push(trInput.passes());
    });
    return passes.every((pass) => pass);
  }

  passes() {
    return this.isValid();
  }
  /**
   * Handle validation before process submtion
   */
  private _onSubmit() {
    var validateCallback = () => {
      let results: boolean[] = [];
      this.each((trInput) => {
        trInput.emitOnValidate = false;
        results.push(trInput.validate());
      });

      // Test whether each rule passed
      if (!results.every((passed) => passed)) {
        //submitEvent.preventDefault();
        this._emitTrOnFailsEvent();
      } else {
        this._emitTrOnPassesEvent();
      }

      return this._passed;
    };
    if (this.submitButton) {
      this.submitButton.addEventListener("click", (submitEvent) => {
        validateCallback();
      });
    }
    this.on("submit", (e) => {
      if (!validateCallback()) {
        e.preventDefault();
      }
    });
  }

  /**
   * Add new rule
   * @param ruleName
   * @param call
   * @param message
   */
  rule(ruleName: string, call: RuleCallBack, message?: string) {
    TrBag.rule(ruleName, call, message);
  }

  protected setConfig(config?: TrivuleFormConfig) {
    let lang =
      tr_attr_get(document.querySelector("html"), "lang") ||
      document.querySelector("html")?.getAttribute("lang");

    lang = tr_attr_get(this.container, "lang", lang);

    let auto = tr_attr_get(this.container, "auto");
    if (auto) {
      this.config.auto = isBoolean(auto).value;
    }
    if (config && typeof config === "object") {
      this.config = { ...this.config, ...config };
      if (config.local) {
        const local = config.local;
        if (local.lang) {
          lang = local.lang;
        }
      }
    }

    TrLocal.LANG = lang ?? TrLocal.DEFAULT_LANG;

    this._syncRules();
  }

  /**
   * Attach an event listener to the container element.
   *
   * @param e - The name of the event to listen to.
   * @param fn - The callback function to execute when the event occurs.
   * This function takes an event of type `Event` as a parameter and returns nothing.
   * Example: `(event) => { ... }`
   */
  on(e: string, fn: EventCallback): void {
    this.container.addEventListener(e, fn);
  }

  /**
   * Emits a custom event to the container element.
   *
   * @param e - The name of the custom event to emit.
   * @param data - The additional data to pass with the event.
   */
  emit(e: string, data?: any): void {
    const event = new CustomEvent(e, { detail: data });
    this.container.dispatchEvent(event);
  }

  /**
   * Attaches an event listener to the "tr.form.fails" event.
   * This event is triggered when the form fails validation.
   * @param fn - The callback function to execute when the event occurs.
   * Example:
   * ```typescript
   * trivuleForm.onFails((trivuleForm) => {
   *   console.log("Form validation failed", trivuleForm);
   * });
   * ```
   */
  onFails(fn: TrivuleFormHandler): void {
    this.on("tr.form.fails", (e) => {
      this.__call(fn, (e as CustomEvent).detail);
    });
  }

  /**
   * Attaches an event listener to the "tr.form.passes" event.
   * This event is triggered when the form passes validation.
   * @param fn - The callback function to execute when the event occurs.
   * Example:
   * ```typescript
   * trivuleForm.onPasses((trivuleForm) => {
   *   console.log("Form validation passed", trivuleForm);
   * });
   * ```
   */
  onPasses(fn: TrivuleFormHandler): void {
    this.on("tr.form.passes", (e) => {
      this.__call(fn, (e as CustomEvent).detail);
    });
  }

  /**
   * Attaches an event listener to the "tr.form.validate" event.
   * This event is triggered when the form is validated.
   * @param fn - The callback function to execute when the event occurs.
   * Example:
   * ```typescript
   * trivuleForm.onValidate((trivuleForm) => {
   *   console.log("Form validation executed", trivuleForm);
   * });
   * ```
   */
  onValidate(fn: TrivuleFormHandler): void {
    this.on("tr.form.validate", (e) => {
      this.__call(fn, (e as CustomEvent).detail);
    });
  }

  /**
   * Attaches an event listener to the "tr.form.updated" event.
   * When this event is triggered, the method initializes and runs the TrivuleInputs for the form,
   * and then calls the provided function with the form instance as a parameter.
   * @param fn - The function to be called when the event occurs.
   * This function takes the form instance as a parameter and returns nothing.
   * Example:
   * ```typescript
   * trivuleForm.observeChanges((form) => {
   *   console.log("Form updated", form);
   * });
   * ```
   */
  observeChanges(fn?: EventCallback): void {
    this.on("tr.form.updated", (e) => {
      this.destroyInputs();
      this._initTrivuleInputs();
      this.__call(fn, this);
    });
  }
  /**
   * Triggers the validation process for the form.
   * This method emits the "tr.form.update" event, which initiates the validation of all form inputs.
   * Example:
   * ```typescript
   * trivuleForm.update ();
   * ```
   */
  update() {
    this.emit("tr.form.updated", this);
  }

  /**
   * Initializes TrivuleInputs for the form.
   */
  private _initTrivuleInputs(trivuleInputs?: HTMLElement[]) {
    this._trivuleInputs = {};
    trivuleInputs = !!trivuleInputs
      ? trivuleInputs
      : Array.from(
          this.container.querySelectorAll<HTMLElement>("[data-tr-rules]")
        );
    trivuleInputs.forEach((el) => this.add({ selector: el }));
  }

  /**
   * Invokes the provided function with the given parameters if it is a valid function.
   * @param fn - The function to be called.
   * @param params - The parameters to be passed to the function.
   */
  private __call(fn?: CallableFunction, ...params: any) {
    if (typeof fn == "function") {
      fn(...params);
    }
  }

  /**
   * Destroys the TrivuleForm instance and performs any necessary cleanup.
   * This method removes event handlers, destroys TrivuleInput instances,
   * and clears the internal array of TrivuleInput instances.
   *
   * Example:
   * ```typescript
   * const formElement = document.getElementById("myForm") as HTMLFormElement;
   * const trivuleForm = new TrivuleForm(formElement);
   * trivuleForm.init();
   *
   * // Use the form...
   *
   * // When the form is no longer needed, destroy the TrivuleForm instance
   * trivuleForm.destroy();
   * ```
   */
  destroy(): void {
    // Remove event handlers
    this.container.removeEventListener("submit", this._onSubmit);

    this.destroyInputs();
    this._trivuleInputs = {};
    this.emit("tr.form.destroy");
  }

  /**
   * Emits the "tr.form.fails" event if the form fails validation.
   * This method is called when the form is considered invalid, meaning at least one input fails validation.
   */
  private _emitTrOnFailsEvent() {
    //If tr.form.fails
    if (this._emitOnFails) {
      this.emit("tr.form.fails", this);
      this._emitOnFails = false;
      //Open _emitOnPasses, for the next tr.form.passes event
      this._emitOnPasses = true;
    }
  }
  /**
   * Emits the "tr.form.passes" event if the form passes validation.
   * This method is called when the form is considered valid, meaning all inputs pass validation.
   */
  private _emitTrOnPassesEvent() {
    //If tr.form.passes
    if (this._emitOnPasses) {
      this.emit("tr.form.passes", this);
      this._emitOnPasses = false;
      //Open _emitOnFails, for the next tr.form.fails event
      this._emitOnFails = true;
    }
  }
  /**
   * Syncronize form rules with the global rules
   */
  private _syncRules() {
    this._formValidator.getFormRules().forEach((r) => {
      this.rule(r.ruleName, r.call.bind(this._formValidator));
    });
  }

  /**
   * Validate form input using javascript code.
   * Use this method to configure or update the parameters for a particular input in the form.
   *
   * @param inputName - The name of the input for which to specify the parameters.
   * @param params - The additional parameters to set for the input.
   *
   * @example
   * const formElement = document.getElementById("myForm") as HTMLFormElement;
   * const trivuleForm = new TrivuleForm(formElement);
   * // Configure additional parameters for an input
   * trivuleForm.with("inputName", { rules: ['required','email']});
   * trivuleForm.init();
   *
   */
  with(inputName: string, params: TrivuleInputParms) {
    const trivuleInput = this.get(inputName);
    if (trivuleInput) {
      trivuleInput.with(params);
      this._trivuleInputs[inputName] = trivuleInput;
    }
  }
  /**
   * Sets multiple input parameters for multiple inputs in the form.
   * @param inputs - An object containing input names as keys and their corresponding parameters as values.
   * Example:
   * ```typescript
   * const inputs = {
   *   input1: {  TrivuleInputParms for input1   },
   *   input2: {  TrivuleInputParms for input2   },
   *   // ...
   * };
   * trivuleForm.withMany(inputs);
   * ```
   */
  withMany(inputs: Record<string, TrivuleInputParms>) {
    for (const [inputName, params] of Object.entries(inputs)) {
      this.with(inputName, params);
    }
  }

  onInit(fn: TrivuleFormHandler) {
    this.on("tr.form.init", (event: any) => {
      this.__call(fn, event.detail);
    });
  }

  onUpdate(fn: TrivuleFormHandler) {
    this._onUpdateCallbacks.push(fn);
  }

  private destroyInputs() {
    this.each((trInput) => {
      trInput.destroy();
    });
  }

  each(call: ITrivuleInputCallback<TrivuleInput, any>) {
    for (const name in this._trivuleInputs) {
      if (Object.prototype.hasOwnProperty.call(this._trivuleInputs, name)) {
        call(this._trivuleInputs[name]);
      }
    }
  }
  get(name: string): TrivuleInput | null {
    return this._trivuleInputs[name] ?? null;
  }
  inputsToArray() {
    return Object.keys(this._trivuleInputs).map(
      (key) => this._trivuleInputs[key]
    );
  }

  addTrivuleInput(trInput: TrivuleInput) {
    const oldInput = this._trivuleInputs[trInput.getName()];
    if (oldInput) {
      oldInput.destroy();
    }
    this._trivuleInputs[trInput.getName()] = trInput;

    /**
     * Listen for each input and update form state
     */
    trInput.onFails(() => {
      this.valid = this.isValid();
    });
    trInput.onPasses(() => {
      this.valid = this.isValid();
    });

    trInput.onUpdate((tr) => {
      this._onUpdateCallbacks.forEach((fn) => {
        this.__call(fn, this);
      });
    });
    //Update the form when adding new fields
    this.valid = this.isValid();
  }

  make(input: TrivuleInputParms[] | Record<string, TrivuleInputParms>) {
    if (typeof input != "object" || input === undefined || input === null) {
      throw new Error("Invalid arguments passed to make method");
    }

    transformToArray(input, (param, indexOrInputName) => {
      let selector: any =
        getHTMLElementBySelector(param.selector as any, this.container) ??
        param.selector;
      if (typeof selector === "string") {
        const s = this.parameter.getInputSelector(selector);
        selector = getHTMLElementBySelector(s as string, this.container);
      }

      if (!selector) {
        selector = isNumber(indexOrInputName).passes
          ? undefined
          : indexOrInputName;
        if (selector) {
          const s = this.parameter.getInputSelector(selector);
          selector =
            getHTMLElementBySelector(s as string, this.container) ?? undefined;
        }
      } else {
        param.selector = undefined;
      }

      param.selector = selector;
      this.add(param);
      return param;
    });

    return this;
  }

  set valid(boolean: boolean) {
    if (this._passed !== boolean) {
      this._passed = boolean;
      this.__calledCount++;
      if (this._passed) {
        this._emitTrOnPassesEvent();
      } else {
        this._emitTrOnFailsEvent();
      }
    }
    this.emit("tr.form.validate", this);
  }

  get valid() {
    //this._passed = this.isValid();
    return this._passed;
  }

  all() {
    return this.inputs();
  }

  getNativeElement() {
    return this.container;
  }
  setAttrToNativeElement(name: string, value: any) {
    this.container.setAttribute(name, value);
    return this;
  }
  setClassToNativeElement(name: string) {
    this.container.classList.add(name);
    return this;
  }

  removeClassFromNativeElement(name: string) {
    this.container.classList.remove(name);
    return this;
  }

  add(params: TrivuleInputParms, input?: ValidatableInput) {
    const i = new TrivuleInput(params);

    if (typeof this.config.realTime === "boolean") {
      params.realTime = this.config.realTime;
    }
    const inputFeedback = i.getFeedbackElement();
    if (!inputFeedback) {
      i.setFeedbackElement(this.config.feedbackSelector);
    }
    params.validClass = params.validClass ?? this.config.validClass;
    params.invalidClass = params.invalidClass ?? this.config.invalidClass;
    params.autoValidate = params.autoValidate ?? this.config.auto;
    params.feedbackElement =
      params.feedbackElement ?? this.config.feedbackSelector;

    if (input) {
      params.selector = input;
    }
    this.addTrivuleInput(i);
    return this;
  }
}

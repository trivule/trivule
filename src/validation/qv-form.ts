import {
  EventCallback,
  QvFormConfig,
  QvInputParms,
  RuleCallBack,
  ValidatableForm,
} from "../contracts";
import { QvLocal } from "../locale/qv-local";
import { FormValidator } from "../rules/form/form-validator";
import { QvBag } from "./qv-bag";
import { QvInput } from "./qv-input";

/**
 * @author Claude Fassinou
 * QvForm is responsible for applying live validation to an HTML form.
 * Creates an instance of QvForm.
 * @param formElement The HTML form element to apply live validation to.
 * Example:
 * ```
 * const formElement = document.getElementById("myForm") as HTMLFormElement;
 * const qvForm = new QvForm(formElement);
 * qvForm.init();
 * ```
 */
export class QvForm {
  private _emitOnFails = true;

  private _formValidator!: FormValidator;
  private _emitOnPasses = true;
  /**
   * The html form
   */
  private container!: HTMLFormElement;

  /**
   * The inputs rules
   */
  private _qvInputs: QvInput[] = [];
  /**
   * The submition input
   */
  submitButton!: HTMLElement;

  /**
   * Qv Config object
   */
  protected config: QvFormConfig = {
    auto: true,
  };

  constructor(container: ValidatableForm, config?: QvFormConfig) {
    this.setContainer(container);
    this._formValidator = new FormValidator(this.container);
    this.setConfig(config);
    this._initQvInputs();
  }

  private setContainer(container: ValidatableForm) {
    if (!(container instanceof HTMLElement)) {
      const el = document.querySelector<HTMLFormElement>(container);
      if (el) {
        container = el;
      }
    }

    if (!(container instanceof HTMLElement)) {
      throw new Error("The 'container' parameter must be of type HTMLElement.");
    }

    this.container = container;

    const submitButton =
      this.container.querySelector<HTMLElement>("[data-qv-submit]");

    if (submitButton) {
      this.submitButton = submitButton;
    }
  }
  /**
   * Initializes live validation on the form element.
   * Example:
   * ```
   * const qvForm = new QvForm(formElement);
   * qvForm.init();
   * ```
   */
  init() {
    this._runQvInputs();
    if (this.config.auto) {
      this.disableButton();
      this.validateOnChange();
      this.validateOnQvValidated();
    }

    this.onSubmit();

    this.onFails((e) => {
      this.disableButton();
    });

    this.onPasses((e) => {
      this.enableButton();
    });

    this.emit("qv.form.init");
  }

  private disableButton() {
    if (this.submitButton) {
      this.submitButton.setAttribute("disabled", "true");
    }
  }
  private enableButton() {
    if (this.submitButton) {
      this.submitButton.removeAttribute("disabled");
    }
  }
  /**
   * Registers an event listener for the "change" event on the container element.
   * If a callback function is provided, it will be executed befor validated the form.
   *
   * @param fn - The callback function to execute before Quickv will handle the form validation.
   *            Its takes the current instance of QvForm as argument
   * @example
   * const qvForm = new QvForm(formElement);
   *
   * qvForm.validateOnChange((qvFormInstance) => {
   *  // Some code
   * });
   *
   */
  validateOnChange(fn?: CallableFunction) {
    this.__call(fn, this);
    this.on("change", this._handle.bind(this));
  }
  /**
   * Registers an event listener for the "qv.input.validated" event on the container element.
   * If a callback function is provided, it will be executed before Quickv handle the form validation.
   *
   * @param fn - The callback function to execute.
   *
   * @example
   * const qvForm = new QvForm(formElement);
   *
   * qvForm.validateOnQvValidated((qvFormInstance) => {
   *   // Some code
   * });
   *
   */
  validateOnQvValidated(fn?: CallableFunction) {
    this.__call(fn, this);
    this.on("qv.input.validated", this._handle.bind(this));
  }
  /**
   * Listen for change events, qv.input.validated and validate the form each time
   */
  private _handle(e: Event) {
    e.stopPropagation();
    if (this.isValid()) {
      this._emitQvOnPassesEvent();
    } else {
      this._emitQvOnFailsEvent();
    }
  }

  /**
   * Check if the form is valid
   * @returns
   */
  isValid() {
    return this._qvInputs.every((qiv) => {
      return qiv.valid();
    });
  }
  /**
   * Handle validation before process submtion
   */
  private onSubmit() {
    this.on("submit", (submitEvent) => {
      this.container
        .querySelectorAll<HTMLElement>("[data-qv-rules]")
        .forEach((el) => {
          new QvInput(
            el as HTMLInputElement,
            {},
            {
              emitEvent: false,
            }
          ).validate();
        });
      if (!this.isValid()) {
        this._emitQvOnFailsEvent();
        submitEvent.preventDefault();
      } else {
        this._emitQvOnPassesEvent();
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
    QvBag.rule(ruleName, call, message);
  }

  protected setConfig(config?: QvFormConfig) {
    let lang =
      document.querySelector("html")?.getAttribute("data-qv-lang") ||
      document.querySelector("html")?.getAttribute("lang");

    if (this.container.dataset.qvLang) {
      lang = this.container.dataset.qvLang;
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

    QvLocal.LANG = lang ?? QvLocal.DEFAULT_LANG;

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
   * Attaches an event listener to the "qv.form.fails" event.
   * This event is triggered when the form fails validation.
   * @param fn - The callback function to execute when the event occurs.
   * Example:
   * ```typescript
   * qvForm.onFails((e) => {
   *   console.log("Form validation failed", e);
   * });
   * ```
   */
  onFails(fn: EventCallback): void {
    this.on("qv.form.fails", fn);
  }

  /**
   * Attaches an event listener to the "qv.form.passes" event.
   * This event is triggered when the form passes validation.
   * @param fn - The callback function to execute when the event occurs.
   * Example:
   * ```typescript
   * qvForm.onPasses((e) => {
   *   console.log("Form validation passed", e);
   * });
   * ```
   */
  onPasses(fn: EventCallback): void {
    this.on("qv.form.passes", fn);
  }

  /**
   * Attaches an event listener to the "qv.form.updated" event.
   * When this event is triggered, the method initializes and runs the QvInputs for the form,
   * and then calls the provided function with the form instance as a parameter.
   * @param fn - The function to be called when the event occurs.
   * This function takes the form instance as a parameter and returns nothing.
   * Example:
   * ```typescript
   * qvForm.observeChanges((form) => {
   *   console.log("Form updated", form);
   * });
   * ```
   */
  observeChanges(fn?: EventCallback): void {
    this.on("qv.form.updated", (e) => {
      this.destroy();
      this.setContainer(this.container);
      this._initQvInputs();
      this._runQvInputs();
      this.__call(fn, this);
    });
  }
  /**
   * Triggers the validation process for the form.
   * This method emits the "qv.input.validated" event, which initiates the validation of all form inputs.
   * Example:
   * ```typescript
   * qvForm.validate();
   * ```
   */
  validate() {
    this.emit("qv.input.validated");
  }
  /**
   * Attaches an event listener to the "qv.form.init" event.
   * This event is triggered when the form is initialized.
   * @param fn - The callback function to execute when the event occurs.
   * Example:
   * ```typescript
   * qvForm.onInit((e) => {
   *   console.log("Form initialized", e);
   * });
   * ```
   */
  onInit(fn?: EventCallback) {
    if (typeof fn == "function") {
      this.__call(fn, this);
    }
  }

  /**
   * Initializes QvInputs for the form.
   */
  private _initQvInputs() {
    const qvInputs = Array.from(
      this.container.querySelectorAll<HTMLElement>("[data-qv-rules]")
    ).map((el) => new QvInput(el as HTMLInputElement));

    this._qvInputs.push(...qvInputs);
  }

  /**
   * Runs the init method on each QvInput instance.
   */
  private _runQvInputs() {
    for (const qiv of this._qvInputs) {
      qiv.init();
    }
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
   * Destroys the QvForm instance and performs any necessary cleanup.
   * This method removes event handlers, destroys QvInput instances,
   * and clears the internal array of QvInput instances.
   *
   * Example:
   * ```typescript
   * const formElement = document.getElementById("myForm") as HTMLFormElement;
   * const qvForm = new QvForm(formElement);
   * qvForm.init();
   *
   * // Use the form...
   *
   * // When the form is no longer needed, destroy the QvForm instance
   * qvForm.destroy();
   * ```
   */
  destroy(): void {
    // Remove event handlers
    this.container.removeEventListener("submit", this.onSubmit);

    // Supprimer les gestionnaires d'événements pour les changements
    ["change", "qv.input.validated"].forEach((ev) => {
      this.container.removeEventListener(ev, this._handle);
    });

    for (const qvInput of this._qvInputs) {
      qvInput.destroy();
    }
    this._qvInputs = [];
    this.emit("qv.form.destroy");
  }

  /**
   * Emits the "qv.form.fails" event if the form fails validation.
   * This method is called when the form is considered invalid, meaning at least one input fails validation.
   */
  private _emitQvOnFailsEvent() {
    //If qv.form.fails
    if (this._emitOnFails) {
      this.emit("qv.form.fails");
      this._emitOnFails = false;
      //Open _emitOnPasses, for the next qv.form.passes event
      this._emitOnPasses = true;
    }
  }
  /**
   * Emits the "qv.form.passes" event if the form passes validation.
   * This method is called when the form is considered valid, meaning all inputs pass validation.
   */
  private _emitQvOnPassesEvent() {
    //If qv.form.passes
    if (this._emitOnPasses) {
      this.emit("qv.form.passes");
      this._emitOnPasses = false;
      //Open _emitOnFails, for the next qv.form.fails event
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
   * const qvForm = new QvForm(formElement);
   * // Configure additional parameters for an input
   * qvForm.with("inputName", { rules: ['required','email']});
   * qvForm.init();
   *
   */
  with(inputName: string, params: QvInputParms) {
    const qvInput = this._qvInputs.find((qiv) => qiv.whereName(inputName));
    if (qvInput) {
      const qvInputIndex = this._qvInputs.indexOf(qvInput);
      qvInput.with(params);
      this._qvInputs[qvInputIndex] = qvInput;
    }
  }
  /**
   * Sets multiple input parameters for multiple inputs in the form.
   * @param inputs - An object containing input names as keys and their corresponding parameters as values.
   * Example:
   * ```typescript
   * const inputs = {
   *   input1: {  QvInputParms for input1   },
   *   input2: {  QvInputParms for input2   },
   *   // ...
   * };
   * qvForm.withMany(inputs);
   * ```
   */
  withMany(inputs: Record<string, QvInputParms>) {
    for (const [inputName, params] of Object.entries(inputs)) {
      this.with(inputName, params);
    }
  }
}

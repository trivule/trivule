import {
  EventCallback,
  EventCallbackWithDetails,
  TrivuleFormConfig,
  TrivuleFormHandler,
  TrivuleInputParms,
  RuleCallBack,
  ValidatableForm,
} from "../contracts";
import { TvLocal } from "../locale/tv-local";
import { FormValidator } from "../rules/form/form-validator";
import { TvBag } from "./tv-bag";
import { TrivuleInput } from "./tv-input";

/**
 * @author Claude Fassinou
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
  private _tvEnabledClass = "tvEnabled";
  /**
   * The class that indicates the submit button is disabled
   */
  private _tvDisabledClass = "tvDisabled";

  private _triggerValidationEvents = ["change", "tv.form.updated"];
  /**
   * The html form
   */
  private container!: HTMLElement;

  /**
   * The inputs rules
   */
  private _trivuleInputs: TrivuleInput[] = [];
  /**
   * The submition input
   */
  submitButton!: HTMLElement;

  /**
   * Tv Config object
   */
  protected config: TrivuleFormConfig = {
    auto: true,
  };

  constructor(container: ValidatableForm, config?: TrivuleFormConfig) {
    this.setContainer(container);
    this._formValidator = new FormValidator(this.container);
    this.setConfig(config);
    this._initTrivuleInputs();
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
      this.container.querySelector<HTMLElement>("[data-tv-submit]");

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
    if (this.config.auto) {
      this.disableButton();
      this.validateOnTvEvent();
    }

    this.emit("tv.form.init", this);

    this._onSubmit();

    this.onFails((e) => {
      this.disableButton();
    });

    this.onPasses((e) => {
      this.enableButton();
    });
  }
  /**
   * Disable submission  button on failed
   */
  disableButton() {
    if (this.submitButton) {
      this.submitButton.setAttribute("disabled", "true");
      if (this._tvDisabledClass) {
        //removeClass enable
        const classArrayEnabled: string[] = this._tvEnabledClass.split(" ");
        for (const value of classArrayEnabled) {
          this.submitButton.classList.remove(value);
        }
        //add class en disabled dataset
        this._tvDisabledClass =
          this.submitButton.dataset.tvDisabledClass ?? "tvDisabled";
        const classArray: string[] = this._tvDisabledClass.split(" ");
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
      if (this._tvEnabledClass) {
        //removeClass disabled
        const classArrayDisabled: string[] = this._tvDisabledClass.split(" ");
        for (const value of classArrayDisabled) {
          this.submitButton.classList.remove(value);
        }
        //add class en enabled dataset
        this._tvEnabledClass =
          this.submitButton.dataset.tvEnabledClass ?? "tvEnabled";
        const classArray: string[] = this._tvEnabledClass.split(" ");
        for (const value of classArray) {
          this.submitButton.classList.add(value);
        }
      }
    }
  }

  /**
   * Registers an event listener for  this this._triggerValidationEvents event on the container element.
   * If a callback function is provided, it will be executed before Trivule handle the form validation.
   * For each TrivuleInput instance attached to this class, the onPass and onFails methods will be executed with this handle method
   * @param fn - The callback function to execute.
   *
   * @example
   * const trivuleForm = new TrivuleForm(formElement);
   *
   * trivuleForm.validateOnTvEvent((trivuleFormInstance) => {
   *   // Some code
   * });
   *
   */
  validateOnTvEvent(fn?: CallableFunction) {
    this.__call(fn, this);
    this._triggerValidationEvents.forEach((e) => {
      this.on(e, (e) => {
        this._handle();
      });
    });
    // Validates the entire form whenever a tv.input.passes or tv.input.fails event is listened to
    this._trivuleInputs.forEach((trivuleInput) => {
      trivuleInput.onFails(this._handle.bind(this));
      trivuleInput.onPasses(this._handle.bind(this));
    });
  }
  /**
   * Check if inputs are valid, and emit the corresponding event if necessary
   */
  private _handle() {
    this._passed = this.isValid();
    if (this._passed) {
      this._emitTvOnPassesEvent();
    } else {
      this._emitTvOnFailsEvent();
    }
  }

  /**
   * Check if the form is valid
   * @returns
   */
  isValid() {
    return this._trivuleInputs.every((qiv) => {
      return qiv.passes();
    });
  }

  passes() {
    return this.isValid();
  }
  /**
   * Handle validation before process submtion
   */
  private _onSubmit() {
    if (this.submitButton) {
      this.submitButton.addEventListener("click", (submitEvent) => {
        //A validation will be made only if very recently, the form was not valid
        if (!this._passed) {
          let results: boolean[] = [];
          //Don't use every method because, we need to run all validation and get it result
          // It will help also to display errors messages
          for (const qi of this._trivuleInputs) {
            // Validate each input
            // The false argument passed, tell that to input to not emit validation event
            results.push(qi.validate(false));
          }
          // Test whether each rule passed
          if (!results.every((passed) => passed)) {
            submitEvent.preventDefault();
            this._emitTvOnFailsEvent();
          } else {
            this._emitTvOnPassesEvent();
          }
        }
      });
    }
  }

  /**
   * Add new rule
   * @param ruleName
   * @param call
   * @param message
   */
  rule(ruleName: string, call: RuleCallBack, message?: string) {
    TvBag.rule(ruleName, call, message);
  }

  protected setConfig(config?: TrivuleFormConfig) {
    let lang =
      document.querySelector("html")?.getAttribute("data-tv-lang") ||
      document.querySelector("html")?.getAttribute("lang");

    if (this.container.dataset.tvLang) {
      lang = this.container.dataset.tvLang;
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

    TvLocal.LANG = lang ?? TvLocal.DEFAULT_LANG;

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
   * Attaches an event listener to the "tv.form.fails" event.
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
    this.on("tv.form.fails", (e) => {
      this.__call(fn, (e as CustomEvent).detail);
    });
  }

  /**
   * Attaches an event listener to the "tv.form.passes" event.
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
    this.on("tv.form.passes", (e) => {
      this.__call(fn, (e as CustomEvent).detail);
    });
  }

  /**
   * Attaches an event listener to the "tv.form.validate" event.
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
    this.on("tv.form.validate", (e) => {
      this.__call(fn, (e as CustomEvent).detail);
    });
  }

  /**
   * Attaches an event listener to the "tv.form.updated" event.
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
    this.on("tv.form.updated", (e) => {
      this.destroyInputs();
      this._initTrivuleInputs();
      this.__call(fn, this);
    });
  }
  /**
   * Triggers the validation process for the form.
   * This method emits the "tv.form.update" event, which initiates the validation of all form inputs.
   * Example:
   * ```typescript
   * trivuleForm.update ();
   * ```
   */
  update() {
    this.emit("tv.form.updated", this);
  }

  /**
   * Initializes TrivuleInputs for the form.
   */
  private _initTrivuleInputs(trivuleInputs?: HTMLElement[]) {
    this._trivuleInputs = [];
    trivuleInputs = !!trivuleInputs
      ? trivuleInputs
      : Array.from(
          this.container.querySelectorAll<HTMLElement>("[data-tv-rules]")
        );

    for (const el of trivuleInputs) {
      const qiv = new TrivuleInput(el as HTMLInputElement, {
        validClass: this.config.validClass,
        invalidClass: this.config.invalidClass,
      });
      qiv.init();
      this._trivuleInputs.push(qiv);
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

    const evs = this._triggerValidationEvents.filter(
      (event) => event !== "tv.form.updated"
    );
    evs.forEach((ev) => {
      this.container.removeEventListener(ev, this._handle);
    });

    this.destroyInputs();
    this._trivuleInputs = [];
    this.emit("tv.form.destroy");
  }

  /**
   * Emits the "tv.form.fails" event if the form fails validation.
   * This method is called when the form is considered invalid, meaning at least one input fails validation.
   */
  private _emitTvOnFailsEvent() {
    //If tv.form.fails
    if (this._emitOnFails) {
      this.emit("tv.form.fails", this);
      this.emit("tv.form.validate", this);
      this._emitOnFails = false;
      //Open _emitOnPasses, for the next tv.form.passes event
      this._emitOnPasses = true;
    }
  }
  /**
   * Emits the "tv.form.passes" event if the form passes validation.
   * This method is called when the form is considered valid, meaning all inputs pass validation.
   */
  private _emitTvOnPassesEvent() {
    //If tv.form.passes
    if (this._emitOnPasses) {
      this.emit("tv.form.passes", this);
      this.emit("tv.form.validate", this);
      this._emitOnPasses = false;
      //Open _emitOnFails, for the next tv.form.fails event
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
    const trivuleInput = this._trivuleInputs.find((qiv) =>
      qiv.whereName(inputName)
    );
    if (trivuleInput) {
      const trivuleInputIndex = this._trivuleInputs.indexOf(trivuleInput);
      trivuleInput.with(params);
      this._trivuleInputs[trivuleInputIndex] = trivuleInput;
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
    this.on("tv.form.init", (event: any) => {
      this.__call(fn, event.detail);
    });
  }

  onUpdate(fn: TrivuleFormHandler) {
    this.on("tv.form.updated", (event: any) => {
      this.__call(fn, event.detail);
    });
  }

  private destroyInputs() {
    for (const trivuleInput of this._trivuleInputs) {
      trivuleInput.destroy();
    }
  }
}

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
  CssSelector,
} from '../contracts';
import { TrLocal } from '../locale/tr-local';
import { isBoolean, isNumber } from '../rules';
import { FormValidator } from '../rules/form/form-validator';
import {
  getHTMLElementBySelector,
  tr_attr_get,
  transformToArray,
} from '../utils';
import { TrBag } from './tr-bag';
import { TrivuleInput } from './tr-input';
import { TrParameter } from './utils/parameter';

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
  private _eventCallbacks: Record<string, EventCallback[]> = {};
  private _registerInputs: Record<string | number, TrivuleInputParms> = {};
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
  private _trEnabledClass = 'etr-enabled';
  /**
   * The class that indicates the submit button is disabled
   */
  private _trDisabledClass = 'tr-disabled';

  /**
   * The html form
   */
  private container: HTMLElement | null = null;

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
  private _wasBound = false;
  constructor(
    containerOrConfig?: ValidatableForm | TrivuleFormConfig,
    config?: TrivuleFormConfig,
  ) {
    this.parameter = new TrParameter();
    //If the container is provided and is resolvable we bind it automatically
    //if the container is config, we check if element attribut exists and bind it
    //If config is provided we assign it
    if (
      typeof containerOrConfig === 'string' ||
      containerOrConfig instanceof HTMLElement
    ) {
      this.bind(containerOrConfig);
      this.setConfig(config);
    } else {
      if (config?.element) {
        this.bind(config.element);
      }
      this.setConfig(config ?? containerOrConfig);
    }
  }

  setSubmitButton(selector?: CssSelector) {
    let submitButton: HTMLButtonElement | null = null;
    if (selector) {
      submitButton = getHTMLElementBySelector<HTMLButtonElement>(selector);
    }
    if (!submitButton && this.container) {
      submitButton =
        this.container?.querySelector<HTMLButtonElement>('[data-tr-submit]');
    }

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

      this.emit('tr.form.init', this);

      this._onSubmit();

      this.onFails(() => {
        this.disableButton();
      });

      this.onPasses(() => {
        this.enableButton();
      });
    }
  }
  /**
   * Disables the submit button and updates its CSS classes based on the configuration.
   *
   * This method checks if the submit button exists and, if the auto configuration is enabled,
   * it disables the button by setting the 'disabled' attribute to 'true'. It also manages
   * the CSS classes by removing the enabled classes and adding the disabled classes.
   *
   * @remarks
   * - If the `auto` configuration is enabled, the submit button will be disabled.
   * - The enabled and disabled CSS classes are managed by removing the enabled classes
   *   and adding the disabled classes based on the configuration.
   *
   * @example
   * ```typescript
   * this.disableButton();
   * ```
   */
  disableButton() {
    if (this.submitButton) {
      if (this.config.auto) {
        this.submitButton.setAttribute('disabled', 'true');
      }
      if (this._trDisabledClass) {
        //removeClass enable
        const classArrayEnabled: string[] = this._trEnabledClass.split(' ');
        for (const value of classArrayEnabled) {
          this.submitButton.classList.remove(value);
        }
        //add class en disabled dataset
        this._trDisabledClass = tr_attr_get(
          this.submitButton,
          'disabled-class',
          this._trDisabledClass,
        );
        const classArray: string[] = this._trDisabledClass.split(' ');
        for (const value of classArray) {
          this.submitButton.classList.add(value);
        }
      }
    }
  }

  /**
   * Enables the submit button and updates its CSS classes based on the configuration.
   *
   * This method checks if the submit button exists and removes the 'disabled' attribute,
   * making the button clickable. It also manages the CSS classes by removing the disabled
   * classes and adding the enabled classes.
   *
   * @remarks
   * - The method will remove the 'disabled' attribute from the submit button, thus enabling it.
   * - It manages the CSS classes by removing the disabled classes and adding the enabled classes
   *   based on the configuration.
   *
   * @example
   * ```typescript
   * this.enableButton();
   * ```
   */
  enableButton() {
    if (this.submitButton) {
      this.submitButton.removeAttribute('disabled');
      if (this._trEnabledClass) {
        //removeClass disabled
        const classArrayDisabled: string[] = this._trDisabledClass.split(' ');
        for (const value of classArrayDisabled) {
          this.submitButton.classList.remove(value);
        }
        //add class en enabled dataset
        this._trEnabledClass = tr_attr_get(
          this.submitButton,
          'enabled-class',
          this._trEnabledClass,
        );
        const classArray: string[] = this._trEnabledClass.split(' ');
        for (const value of classArray) {
          this.submitButton.classList.add(value);
        }
      }
    }
  }

  /**
   * Retrieves all inputs from the form.
   *
   * @param strict If true, returns objects with only the name, value, and validation status of each input; otherwise, returns `TrivuleInput` instances.
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
  validated(strict: boolean = true): ITrivuleInputObject[] | TrivuleInput[] {
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

  failed(strict: boolean = true): ITrivuleInputObject[] | TrivuleInput[] {
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
    };
  }

  /**
   * Validate each input and check if the form is valid.
   * @returns A boolean indicating whether the form is valid after validating each input.
   */
  isValid() {
    const passes: boolean[] = [];
    this.each((trInput) => {
      passes.push(trInput.passes());
    });
    return passes.every((pass) => pass);
  }

  /**
   * Validate each input and check if the form is valid.
   * @returns A boolean indicating whether the form is valid after validating each input.
   */
  passes() {
    return this.isValid();
  }
  /**
   * Handle validation before process submtion
   */
  private _onSubmit() {
    const validateCallback = () => {
      const results: boolean[] = [];
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
      this.submitButton.addEventListener('click', () => {
        validateCallback();
      });
    }
    this.on('submit', (e: Event) => {
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
      tr_attr_get<string | undefined>(document.querySelector('html'), 'lang') ||
      document.querySelector('html')?.getAttribute('lang');

    lang = tr_attr_get(this.container, 'lang', lang);

    const auto = tr_attr_get<string>(this.container, 'auto');
    if (auto) {
      this.config.auto = isBoolean(auto).passes;
    }
    if (config && typeof config === 'object') {
      this.config = { ...this.config, ...config };
      if (config.local) {
        const local = config.local;
        if (local.lang) {
          lang = local.lang;
        }
      }
    }

    TrLocal.LANG = lang ?? TrLocal.DEFAULT_LANG;

    this.parameter.setFeedbackSelector(this.config.feedbackSelector);
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
    if (this.container) {
      this.container.addEventListener(e, fn);
    } else {
      this._addEvents(e, fn);
    }
  }

  /**
   * Emits a custom event to the container element.
   *
   * @param e - The name of the custom event to emit.
   * @param data - The additional data to pass with the event.
   */
  emit(e: string, data?: unknown): void {
    const event = new CustomEvent(e, { detail: data });
    this.container?.dispatchEvent(event);
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
    this.on('tr.form.fails', (e) => {
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
    this.on('tr.form.passes', (e) => {
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
    this.on('tr.form.validate', (e) => {
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
    this.on('tr.form.updated', () => {
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
    this.emit('tr.form.updated', this);
  }

  /**
   * Initializes TrivuleInputs for the form.
   */
  private _initTrivuleInputs(inputs?: HTMLElement[]) {
    if (this.container) {
      inputs = inputs
        ? inputs
        : Array.from(
            this.container.querySelectorAll<HTMLElement>('[data-tr-rules]'),
          );
      inputs.forEach((el) => this.add({ selector: el }));
    }
  }

  /**
   * Invokes the provided function with the given parameters if it is a valid function.
   * @param fn - The function to be called.
   * @param params - The parameters to be passed to the function.
   */
  private __call(fn?: CallableFunction, ...params: unknown[]) {
    if (typeof fn == 'function') {
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
    if (this.container) {
      this.container.removeEventListener('submit', this._onSubmit);
      this.destroyInputs();
      this._trivuleInputs = {};
      this.emit('tr.form.destroy');
    }
  }

  /**
   * Emits the "tr.form.fails" event if the form fails validation.
   * This method is called when the form is considered invalid, meaning at least one input fails validation.
   */
  private _emitTrOnFailsEvent() {
    //If tr.form.fails
    if (this._emitOnFails) {
      this.emit('tr.form.fails', this);
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
      this.emit('tr.form.passes', this);
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

  /**
   *  The onInit(fn: TrivuleFormHandler) method registers a callback function to be executed
   *  when the Trivule form is initialized. It listens for the 'tr.form.init'
   * @param fn
   */
  onInit(fn: TrivuleFormHandler) {
    this.on('tr.form.init', (event: Event) => {
      if (event instanceof CustomEvent) {
        this.__call(fn, event.detail);
      }
    });
  }

  /**
   * When any input value is updated
   * @param fn
   */
  onUpdate(fn: TrivuleFormHandler) {
    this._onUpdateCallbacks.push(fn);
  }

  private destroyInputs() {
    this.each((trInput) => {
      trInput.destroy();
    });
  }
  /**
   * Iterate over each TrivuleInput in the form and execute a callback function.
   * @param call The callback function to be executed for each TrivuleInput.
   */
  each(call: ITrivuleInputCallback<TrivuleInput>) {
    for (const name in this._trivuleInputs) {
      if (Object.prototype.hasOwnProperty.call(this._trivuleInputs, name)) {
        call(this._trivuleInputs[name]);
      }
    }
  }
  /**
   * Retrieve a TrivuleInput by name from the form.
   * @param name The name of the TrivuleInput to retrieve.
   * @returns The TrivuleInput corresponding to the name, or null if not found.
   */
  get(name: string): TrivuleInput | null {
    return this._trivuleInputs[name] ?? null;
  }
  /**
   * Convert the TrivuleInput objects stored in _trivuleInputs to an array.
   * @returns An array containing all TrivuleInput objects.
   */
  inputsToArray() {
    return Object.keys(this._trivuleInputs).map(
      (key) => this._trivuleInputs[key],
    );
  }
  /**
   * Adds a TrivuleInput to the form and performs necessary updates.
   * @param trInput The TrivuleInput instance to add to the form.
   * @remarks This method handles the addition of a TrivuleInput to the form, including setting feedback elements, updating form state based on input validation, and triggering callbacks.
   */
  addTrivuleInput(trInput: TrivuleInput) {
    const inputFeedback = trInput.getFeedbackElement();
    if (!inputFeedback) {
      const fds = this.parameter.getFeedbackSelector(trInput.getName());
      if (fds) {
        trInput.setFeedbackElement(
          getHTMLElementBySelector(fds, this.container),
        );
      }
    }
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

    trInput.onUpdate(() => {
      this._onUpdateCallbacks.forEach((fn) => {
        this.__call(fn, this);
      });
    });
    //Update the form when adding new fields
    this.valid = this.isValid();
  }
  /**
   * Validate an input with validation configurations.
   * @example
   * ```javascript
   *      const trInput = new TrivuleInput(formInstance.ageInput);
   *      trivuleForm.addTrivuleInput(trInput);
   *      trivuleForm
   *        .make([
   *          {
   *            rules: 'required|between:18,40',
   *            selector: 'age', // The input name
   *          },
   *          {
   *            rules: 'required|date',
   *            selector: formInstance.birthDayInput,
   *          },
   *        ])
   *        .make({
   *          message: {
   *            rules: 'required|only:string',
   *          },
   *        });
   * ```
   * @param input An object containing TrivuleInputParms or an array of TrivuleInputParms.
   * @throws Error - If the provided input argument is not a valid object.
   * @returns This TrivuleForm instance to allow chaining method calls.
   */
  make(input: TrivuleInputParms[] | Record<string, TrivuleInputParms>) {
    if (typeof input != 'object' || input === undefined || input === null) {
      throw new Error('Invalid arguments passed to make method');
    }
    transformToArray(input, this._bootInputs.bind(this));
    return this;
  }
  /**
   * Set the validity state of the TrivuleForm.
   * @param boolean The boolean value indicating the validity state to set.
   * @remarks This method updates the internal validity state of the TrivuleForm based on the provided boolean value.
   * It increments the internal counter for the number of times this method is called.
   * If the validity state changes to true (passed), it triggers the '_emitTrOnPassesEvent' event.
   * If the validity state changes to false (failed), it triggers the '_emitTrOnFailsEvent' event.
   * Finally, it emits a 'tr.form.validate' event with the updated TrivuleForm instance.
   */
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
    this.emit('tr.form.validate', this);
  }
  /**
   * Get the current validity state of the TrivuleForm.
   * @returns The boolean value representing the current validity state of the TrivuleForm.
   * @remarks This method retrieves and returns the current validity state of the TrivuleForm.
   */
  get valid() {
    //this._passed = this.isValid();
    return this._passed;
  }
  /**
   * Retrieve all inputs from the form.
   * @returns An array of all inputs in the form.
   */
  all() {
    return this.inputs();
  }
  /**
   * Retrieve the native element associated with the form.
   * @returns The container element of the form.
   */
  getNativeElement() {
    return this.container;
  }
  /**
   * Set an attribute to the native element of the form.
   * @param name The name of the attribute to set.
   * @param value The value of the attribute to set (string or number).
   * @returns The form instance for method chaining.
   */
  setAttrToNativeElement(name: string, value: string | number) {
    this.container?.setAttribute(name, value.toString());
    return this;
  }
  /**
   * Add a CSS class to the native element of the form.
   * @param name The name of the CSS class to add.
   * @returns The form instance for method chaining.
   */
  setClassToNativeElement(name: string) {
    this.container?.classList.add(name);
    return this;
  }
  /**
   * Remove a CSS class from the native element of the form.
   * @param name The name of the CSS class to remove.
   * @returns The form instance for method chaining.
   */
  removeClassFromNativeElement(name: string) {
    this.container?.classList.remove(name);
    return this;
  }
  /**
   * Add a TrivuleInput based on the provided parameters.
   * @param params The parameters for creating the TrivuleInput.
   * @returns The result of creating the TrivuleInput.
   */
  add(params: TrivuleInputParms) {
    return this.make([params]);
  }
  /**
   * Enable real-time functionality for the form.
   * Sets the configuration to enable real-time updates.
   * Enables real-time functionality for each TrivuleInput in the form.
   * @returns The form instance with real-time functionality enabled.
   */
  enableRealTime() {
    this.config.realTime = true;
    this.each((tr) => {
      tr.enableRealTime();
      return this;
    });
    return this;
  }
  /**
   * Disable real-time functionality for the form.
   * Sets the configuration to disable real-time updates.
   * Disables real-time functionality for each TrivuleInput in the form.
   * @returns The form instance with real-time functionality disabled.
   */
  disableRealTime() {
    this.config.realTime = false;
    this.each((tr) => {
      tr.disableRealTime();
      return this;
    });
    return this;
  }
  /**
   * Check if real-time functionality is currently enabled for the form.
   * @returns A boolean indicating whether real-time functionality is enabled.
   */
  isRealTimeEnabled() {
    return this.config.realTime;
  }
  /**
   * Set the CSS class for valid inputs in the form.
   * @param cls The CSS class to apply to valid inputs.
   */
  setInputValidClass(cls: string) {
    this.config.validClass = cls;
    this.each((i) => {
      i.setValidClass(cls);
    });
  }
  /**
   * Set the CSS class for invalid inputs in the form.
   * @param cls The CSS class to apply to invalid inputs.
   */
  setInputInvalidClass(cls: string) {
    this.config.invalidClass = cls;
    this.each((i) => {
      i.setInvalidClass(cls);
    });
  }
  /**
   * Binds the form element or selector to the TrivuleForm instance once it is an HTMLElement.
   *
   * @param form - The HTML form element or a CSS selector string for the form to bind.
   * If an HTML element is provided, it directly binds the element. If a selector string is provided,
   * it attempts to resolve the element using `getHTMLElementBySelector`.
   *
   * @example
   * // Bind using an HTML element
   * const formElement = document.getElementById("myForm") as HTMLFormElement;
   * const trivuleForm = new TrivuleForm();
   * trivuleForm.bind(formElement);
   *
   * // Bind using a CSS selector
   * const trivuleForm = new TrivuleForm();
   * trivuleForm.bind("#myForm");
   */

  bind(form?: ValidatableForm) {
    if (this._wasBound) {
      return this;
    }
    if (form) {
      const element = getHTMLElementBySelector(form);
      if (element instanceof HTMLElement) {
        this.container = element;
      }
    }
    if (!(this.container instanceof HTMLElement)) {
      if (this.config.element) {
        const element = getHTMLElementBySelector(this.config.element);
        if (element instanceof HTMLElement) {
          this.container = element;
        }
      }
    }
    if (this.container instanceof HTMLElement) {
      this._formValidator = new FormValidator(this.container);
      this._initTrivuleInputs();
      this.init();
      this._wasBound = true;
      this._resolveInputValidation();
      this._resolveEventListeners();
    }
  }
  private _addEvents(string: string, call: EventCallback): void {
    if (!this._eventCallbacks[string]) {
      this._eventCallbacks[string] = [call];
    } else {
      this._eventCallbacks[string].push(call);
    }
  }
  /**
   * Attaches event listeners to the container element.
   *
   * This method iterates over the `_eventCallbacks` object,
   * where keys represent event names and *values are arrays of callback functions.
   *
   */
  private _resolveEventListeners() {
    if (this.container instanceof HTMLElement) {
      transformToArray(this._eventCallbacks, (callbacks, event) => {
        callbacks.forEach((fn) => {
          this.container?.addEventListener(event as string, fn);
        });
      });
    }
  }

  private _resolveInputValidation() {
    transformToArray(this._registerInputs, this._bootInputs.bind(this));
  }

  private _bootInputs(
    param: TrivuleInputParms,
    indexOrInputName: string | number,
  ) {
    if (!this.container) {
      this._registerInputs[indexOrInputName] = param;
      return this;
    }
    let selector = param.selector;
    if (param.selector) {
      selector =
        getHTMLElementBySelector(param.selector, this.container) ?? selector;
    }
    if (typeof selector === 'string') {
      const s = this.parameter.getInputSelector(selector);

      selector = getHTMLElementBySelector(s as string, this.container);
    }

    if (!selector) {
      const name = isNumber(indexOrInputName).passes
        ? undefined
        : indexOrInputName;
      if (name) {
        const s = this.parameter.getInputSelector(name);
        selector =
          getHTMLElementBySelector(s as string, this.container) ?? undefined;
      }
    } else {
      param.selector = undefined;
    }

    if (typeof param.realTime !== 'boolean') {
      param.realTime = this.config.realTime;
    }

    param.validClass = param.validClass ?? this.config.validClass;
    param.invalidClass = param.invalidClass ?? this.config.invalidClass;
    param.autoValidate = param.autoValidate ?? this.config.auto;
    param.feedbackElement =
      param.feedbackElement ?? this.config.feedbackSelector;
    param.selector = selector as ValidatableInput;

    this.addTrivuleInput(
      new TrivuleInput(selector as ValidatableInput, param, this.parameter),
    );
    return param;
  }
}

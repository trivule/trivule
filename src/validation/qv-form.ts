import {
  EventCallback,
  IQvConfig,
  RuleCallBack,
  ValidatableForm,
} from "../contracts";
import { QvConfig } from "../qv.config";
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
  /**
   * The html form
   */
  private container!: HTMLElement;

  /**
   * The inputs rules
   */
  inputs: Record<string, any> = {};
  /**
   * The submition input
   */
  submitButton!: HTMLElement;

  protected config: IQvConfig = QvConfig;

  constructor(container: ValidatableForm) {
    this.setContainer(container);
  }

  private setContainer(container: ValidatableForm) {
    if (!(container instanceof HTMLElement)) {
      const el = document.querySelector(container);
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
   * @param config Optional configuration object for QvForm.
   * Example:
   * ```
   * const qvForm = new QvForm(formElement);
   * qvForm.init();
   * ```
   */
  init(config?: IQvConfig) {
    this.setConfig(config);
    this.disableButton();
    this.container
      .querySelectorAll<HTMLElement>("[data-qv-rules]")
      .forEach((el) => {
        new QvInput(el as HTMLInputElement, this.config).init();
      });
    this.handle();
    this.onSubmit();
    this.setInputs();

    this.onFails((e) => {
      this.disableButton();
    });

    this.onPasses((e) => {
      this.enableButton();
    });
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

  private handle() {
    ["change", "qv.input.validated"].forEach((ev) => {
      this.on(ev, (e) => {
        e.stopPropagation();
        if (this.isValid()) {
          this.emit("qv.form.passes");
        } else {
          this.emit("qv.form.fails");
        }
      });
    });
  }

  /**
   * Check if the form is valid
   * @returns
   */
  isValid() {
    const inputs = [
      ...this.container.querySelectorAll<HTMLInputElement>("[data-qv-rules]"),
    ];
    return inputs.every((input) => {
      return new QvInput(input).valid();
    });
  }
  /**
   * Handle validation before process submtion
   */
  private onSubmit() {
    this.container.addEventListener("submit", (submitEvent) => {
      this.container
        .querySelectorAll<HTMLElement>("[data-qv-rules]")
        .forEach((el) => {
          new QvInput(el as HTMLInputElement, this.config, {
            emitEvent: false,
          }).validate();
        });
      if (!this.isValid()) {
        this.emit("qv.form.fails");
        submitEvent.preventDefault();
      } else {
        this.emit("qv.form.passes");
      }
    });
  }

  private setInputs() {
    this.container
      .querySelectorAll<HTMLInputElement>("[data-qv-rules]")
      .forEach((el) => {
        const qiv = new QvInput(el as HTMLInputElement);
        this.inputs[qiv.getName()] = qiv.getValue();
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

  protected setConfig(config?: IQvConfig) {
    this.config = QvConfig;
    if (config && typeof config === "object") {
      this.config = { ...this.config, ...config };
    }
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
}

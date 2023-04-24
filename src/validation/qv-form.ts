import { IQvConfig, RuleCallBack } from "../contracts";
import { QvConfig } from "../qv.config";
import { QvBag } from "./qv-bag";
import { QvInput } from "./qv-input";

/**
 * @author Claude Fassinou
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

  constructor(container: HTMLElement) {
    this.setContainer(container);
  }

  private setContainer(container: any) {
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
    const validate = () => {
      if (this.isValid()) {
        this.enableButton();
      } else {
        this.disableButton();
      }
    };

    ["change", "qv.input.validated"].forEach((ev) => {
      this.container.addEventListener(ev, (e) => {
        e.stopPropagation();
        validate();
        this.setInputs();
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
   * Handle validation befor process submtion
   */
  private onSubmit() {
    this.container.addEventListener("submit", (submitEvent) => {
      this.container
        .querySelectorAll<HTMLElement>("[data-qv-rules]")
        .forEach((el) => {
          new QvInput(el as HTMLInputElement, this.config, false).validate();
        });
      if (!this.isValid()) {
        submitEvent.preventDefault();
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
}

import { CssSelector } from "../../contracts";

export class TrParameter {
  feedbackSelector: CssSelector | null = "[data-tr-feedback={name}]";
  inputSelector: CssSelector | null = "[name={name}]";
  getFeedbackSelector(name: string): CssSelector | null {
    if (typeof this.feedbackSelector === "string") {
      if (name.trim().length < 1) {
        return null;
      }
      this.feedbackSelector = this.feedbackSelector.replace("{name}", name);
    }
    return this.feedbackSelector;
  }
  getInputSelector(name: string) {
    if (typeof this.inputSelector === "string") {
      if (name.trim().length < 1) {
        return null;
      }
      this.inputSelector = this.inputSelector.replace("{name}", name);
    }
    return this.inputSelector;
  }
}

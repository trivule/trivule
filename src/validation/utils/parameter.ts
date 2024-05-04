import { CssSelector } from "../../contracts";

export class TrParameter {
  feedbackSelector: CssSelector | null = "[data-tr-feedback={name}]";
  getFeedbackSelector(name: string): CssSelector | null {
    if (typeof this.feedbackSelector === "string") {
      if (name.trim().length < 1) {
        return null;
      }
      this.feedbackSelector = this.feedbackSelector.replace("{name}", name);
    }
    return this.feedbackSelector;
  }
}

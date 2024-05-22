import { CssSelector } from '../../contracts';

export class TrParameter {
  feedbackSelector: CssSelector | null = '[data-tr-feedback={name}]';
  inputSelector: CssSelector | null = '[name={name}]';
  getFeedbackSelector(name: string): CssSelector | null {
    if (typeof this.feedbackSelector === 'string') {
      if (name.trim().length < 1) {
        return null;
      }
      return this.feedbackSelector.replace('{name}', name);
    }
    return this.feedbackSelector;
  }

  setFeedbackSelector(selector?: CssSelector | null) {
    if (!selector) {
      return this;
    }
    this.feedbackSelector = selector;
    return this;
  }
  getInputSelector(name: unknown) {
    if (typeof this.inputSelector === 'string' && typeof name === 'string') {
      if (name.trim().length < 1) {
        return null;
      }
      return this.inputSelector.replace('{name}', name);
    }
    return this.inputSelector;
  }
}

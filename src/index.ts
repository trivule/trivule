import { QvConfig } from "./qv.config";
import { Quickv, QvForm, QvInput } from "./validation";

declare global {
  interface Window {
    QvInput: typeof QvInput;
    QvForm: typeof QvForm;
    Quickv: typeof Quickv;
  }
}

if (typeof window !== "undefined") {
  window.QvInput = window.QvInput ?? QvInput;
  window.QvForm = window.QvForm ?? QvForm;
  window.Quickv = window.Quickv ?? Quickv;
}

export { Quickv, QvForm, QvInput, QvConfig };

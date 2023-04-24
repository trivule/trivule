import * as quickv from "./validation";

export * from "./validation";
export * from "./rules";
export * from "./contracts";
export * from "./messages";
export * from "./qv.config";
export * from "./utils";

declare global {
  interface Window {
    QvInput: typeof quickv.QvInput;
    QvForm: typeof quickv.QvForm;
    Quickv: typeof quickv.Quickv;
    Qv: typeof quickv.Quickv;
  }
}

if (typeof window !== "undefined") {
  window.QvInput = quickv.QvInput;
  window.QvForm = quickv.QvForm;
  window.Quickv = quickv.Quickv;
  window.Qv = quickv.Quickv;
}

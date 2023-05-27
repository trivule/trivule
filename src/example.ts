import { QvForm, QvInput } from "./validation";

const qvForm = new QvForm("#myForm", {
  local: {
    lang: "en",
  },
});
qvForm.init();
qvForm.onFails((e) => {
  console.log(e);
});

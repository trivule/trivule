import { QvForm, QvInput } from "./validation";

const qvForm = new QvForm("#myForm");

qvForm.init();
qvForm.onFails((e) => {
  console.log(e);
});

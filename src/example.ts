import { QvLocal } from "./locale/qv-local";
import { QvForm, QvInput } from "./validation";
QvLocal.local("en");
const qvForm = new QvForm("form");
qvForm.init();

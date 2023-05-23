import { QvInput } from "./validation";

const qvInput = new QvInput("input");
qvInput.with({
  rules: ["required", "email"],
});
qvInput.init();

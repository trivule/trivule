import { QvInput } from "./validation";

const qvInput = new QvInput("input");
qvInput.with({
  rules: ["required", "email"],
});

console.log(qvInput);
qvInput.init();

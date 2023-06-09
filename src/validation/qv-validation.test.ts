import { QValidation } from ".";
import { RulesMessages } from "../contracts";

describe("QValidation", () => {
  let qValidation: QValidation;

  beforeEach(() => {
    qValidation = new QValidation({
      rules: ["required", "email"],
      errors: {
        required: "This field is required",
        email: "Invalid email format",
      } as RulesMessages,
    });
  });

  test("validate() should return true for a valid value", () => {
    qValidation.value = "test@example.com";
    const isValid = qValidation.validate();
    expect(isValid).toBe(true);
    expect(qValidation.hasErrors()).toBe(false);
    expect(qValidation.getMessages()).toEqual([]);
  });

  test("validate() should return false for an invalid value", () => {
    qValidation.value = "";
    const isValid = qValidation.validate();
    expect(isValid).toBe(false);
    expect(qValidation.hasErrors()).toBe(true);
    expect(qValidation.getMessages()).toEqual([
      "This field is required",
      "Invalid email format",
    ]);
  });

  test("setRules() should update the rules", () => {
    const newRules = ["required", "minlength:8"];
    qValidation.setRules(newRules);
    expect(qValidation.getRules()).toEqual(newRules);
  });
});

import { TValidation } from ".";
import { RulesMessages } from "../contracts";

describe("TValidation", () => {
  let tvalidation: TValidation;

  beforeEach(() => {
    tvalidation = new TValidation({
      rules: ["required", "email"],
      errors: {
        required: "This field is required",
        email: "Invalid email format",
      } as RulesMessages,
    });
  });

  test("validate() should return true for a valid value", () => {
    tvalidation.value = "test@example.com";
    const isValid = tvalidation.validate();
    expect(isValid).toBe(true);
    expect(tvalidation.hasErrors()).toBe(false);
    expect(tvalidation.getMessages()).toEqual([]);
  });

  test("validate() should return false for an invalid value", () => {
    tvalidation.value = "";
    const isValid = tvalidation.validate();
    expect(isValid).toBe(false);
    expect(tvalidation.hasErrors()).toBe(true);
    expect(tvalidation.getMessages()).toEqual([
      "This field is required",
      "Invalid email format",
    ]);
  });

  test("setRules() should update the rules", () => {
    const newRules = ["required", "minlength:8"];
    tvalidation.setRules(newRules);
    expect(tvalidation.getRules()).toEqual(newRules);
  });
});

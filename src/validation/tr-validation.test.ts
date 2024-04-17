import { TrValidation } from ".";
import { RulesMessages } from "../contracts";

describe("TrValidation", () => {
  let trvalidation: TrValidation;

  beforeEach(() => {
    trvalidation = new TrValidation({
      rules: ["required", "email"],
      errors: {
        required: "This field is required",
        email: "Invalid email format",
      } as RulesMessages,
    });
  });

  test("validate() should return true for a valid value", () => {
    trvalidation.value = "test@example.com";
    const isValid = trvalidation.validate();
    expect(isValid).toBe(true);
    expect(trvalidation.hasErrors()).toBe(false);
    expect(trvalidation.getMessages()).toEqual([]);
  });

  test("validate() should return false for an invalid value", () => {
    trvalidation.value = "";
    const isValid = trvalidation.validate();
    expect(isValid).toBe(false);
    expect(trvalidation.hasErrors()).toBe(true);
    expect(trvalidation.getMessages()).toEqual([
      "This field is required",
      "Invalid email format",
    ]);
  });

  test("setRules() should update the rules", () => {
    const newRules = ["required", "minlength:8"];
    trvalidation.setRules(newRules);
    expect(trvalidation.getRules()).toEqual(newRules);
  });
});

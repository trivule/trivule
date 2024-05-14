import { TrValidation } from ".";
import { InputRule } from "../messages";

describe("TrValidation", () => {
  let trvalidation: TrValidation;

  beforeEach(() => {
    const inputRule = new InputRule(["required", "email"], {
      required: "This field is required",
      email: "Invalid email format",
    });
    trvalidation = new TrValidation();
    trvalidation.setRules(inputRule.all());
  });

  test("validate() should return false for an invalid value", () => {
    trvalidation.value = "";
    const isValid = trvalidation.passes();
    expect(isValid).toBe(false);
  });

  test("Validation failed messages", () => {
    trvalidation.failsOnFirst = false;
    trvalidation.value = "";
    const received = trvalidation.getErrors();
    expect(received).toEqual({
      email: "Invalid email format",
      required: "This field is required",
    });
  });

  test("setRules() should update the rules", () => {
    trvalidation.setRules(
      new InputRule(["minlength:8"], {
        minlength: "The input must be at least 8 characters long",
      }).all()
    );
    const rules = trvalidation.getRules().map((rule) => {
      return {
        name: rule.name,
        param: rule.params,
      };
    });

    expect(rules).toEqual([
      {
        name: "minlength",
        param: "8",
      },
    ]);
  });
  test("getRuleExecuted", () => {
    trvalidation.failsOnFirst = false;
    trvalidation.value = "";
    const received = trvalidation
      .getRuleExecuted()
      .map((rule) => rule.ruleName);
    expect(received).toEqual(["required", "email"]);
  });
});

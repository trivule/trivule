import { TrBag } from "./tr-bag";

describe("TrBag", () => {
  it("should return true if a rule exists in the rules bag", () => {
    // Add a custom rule to the bag of rules
    TrBag.addRule("customRule", () => {
      return { value: "", passes: true };
    });

    // Check if the customRule exists in the bag of rules
    expect(TrBag.hasRule("customRule")).toBe(true);
  });

  it("should return false if a rule does not exist in the rules bag", () => {
    // Check whether a non-existent rule in the bag of rules returns false
    expect(TrBag.hasRule("nonexistentRule")).toBe(false);
  });
});

describe("rule", () => {
  it("should add a custom validation rule to the rules bag with a message", () => {
    // Define a callback function for the custom rule
    const customCallback = jest.fn();

    // Call the rule method to add the custom rule with a message
    TrBag.rule("customRule", customCallback, "This is a custom error message");

    // Check if the rule and message have been added to the bag of rules and messages
    expect(TrBag.getRule("customRule")).toBe(customCallback);
    expect(TrBag.getMessage("customRule")).toBe(
      "This is a custom error message"
    );
  });

  it("should add a custom validation rule to the rules bag without a message", () => {
    // Define a callback function for the custom rule
    const customCallback = jest.fn();

    // Call the rule method to add the custom rule without a message
    TrBag.rule("customRule", customCallback);

    // Check if the rule has been added to the bag of rules with a default message
    expect(TrBag.getRule("customRule")).toBe(customCallback);
  });
});

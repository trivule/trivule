import { TvBag } from "./tv-bag";

describe("TvBag", () => {
  it("should return true if a rule exists in the rules bag", () => {
    // Add a custom rule to the bag of rules
    TvBag.addRule("customRule", () => true);

    // Check if the customRule exists in the bag of rules
    expect(TvBag.hasRule("customRule")).toBe(true);
  });

  it("should return false if a rule does not exist in the rules bag", () => {
    // Check whether a non-existent rule in the bag of rules returns false
    expect(TvBag.hasRule("nonexistentRule")).toBe(false);
  });
});

describe("rule", () => {
  it("should add a custom validation rule to the rules bag with a message", () => {
    // Define a callback function for the custom rule
    const customCallback = jest.fn();

    // Call the rule method to add the custom rule with a message
    TvBag.rule("customRule", customCallback, "This is a custom error message");

    // Check if the rule and message have been added to the bag of rules and messages
    expect(TvBag.getRule("customRule")).toBe(customCallback);
    expect(TvBag.getMessage("customRule")).toBe(
      "This is a custom error message"
    );
  });

  it("should add a custom validation rule to the rules bag without a message", () => {
    // Define a callback function for the custom rule
    const customCallback = jest.fn();

    // Call the rule method to add the custom rule without a message
    TvBag.rule("customRule", customCallback);

    // Check if the rule has been added to the bag of rules with a default message
    expect(TvBag.getRule("customRule")).toBe(customCallback);
  });
});

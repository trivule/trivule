import { InputRule } from "./input-rule";

describe("InputRule", () => {
  let inputRule: InputRule;

  beforeEach(() => {
    inputRule = new InputRule(["rule1", "rule2"]);
  });

  it("should push a new rule", () => {
    inputRule.push("rule3");
    expect(inputRule.toString()).toBe("rule1|rule2|rule3");
  });

  it("should merge rules", () => {
    inputRule.merge(["rule3", "rule4"]);
    expect(inputRule.toString()).toBe("rule1|rule2|rule3|rule4");
  });

  it("should remove a rule", () => {
    inputRule.remove("rule2");
    expect(inputRule.toString()).toBe("rule1");
  });

  it("should convert to string", () => {
    expect(inputRule.toString()).toBe("rule1|rule2");
  });

  it("should parse from string", () => {
    inputRule.fromString("rule3|rule4");
    expect(inputRule.toString()).toBe("rule3|rule4");
  });
});

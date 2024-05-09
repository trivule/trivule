import { InputRule } from "./input-rule";

describe("InputRule", () => {
  let inputRule: InputRule;

  beforeEach(() => {
    inputRule = new InputRule(["required", "minlength:8"], {
      required: "This field is required",
      minlength: "This field must be at least 8 characters",
    });
  });

  it("should push a new rule", () => {
    inputRule.push("email");
    const received = inputRule.all().map((rule) => {
      return {
        name: rule.name,
        params: rule.params,
      };
    });

    expect(received).toEqual([
      {
        name: "required",
        params: undefined,
      },
      {
        name: "minlength",
        params: "8",
      },
      {
        name: "email",
        params: undefined,
      },
    ]);
  });

  it("should format correctly the message", () => {
    inputRule.push("email").push("max");
    const messages = inputRule.all().map((rule) => {
      return rule.message;
    });

    expect(messages).toEqual([
      "This field is required",
      "This field must be at least 8 characters",
      "Please enter a valid email address",
      "The :field field must be less than or equal to ':arg0'",
    ]);
  });

  it("should remove a rule", () => {
    inputRule.remove("email");
    const received = inputRule.all().map((rule) => {
      return {
        name: rule.name,
        params: rule.params,
      };
    });

    expect(received).toEqual([
      {
        name: "required",
        params: undefined,
      },
      {
        name: "minlength",
        params: "8",
      },
    ]);
  });
  it("Should return the message", () => {
    inputRule.push("email", "Email message");
    inputRule.set("max |file", "Max message | File message");
    inputRule.set(["date", "number"], ["Date message"]);
    const messages = inputRule.getMessages();
    expect(messages).toEqual({
      required: "This field is required",
      minlength: "This field must be at least 8 characters",
      email: "Email message",
      max: "Max message",
      file: "File message",
      date: "Date message",
      number: "This field must be a number", //original message
    });
  });
});

describe("convertAcoladeGroupToArray", () => {
  it("should return an array of numbers contained in the acolade group", () => {
    const inputRule = new InputRule([], []);

    const result = inputRule.convertAcoladeGroupToArray("{0,1,2,3}");

    expect(result).toEqual([0, 1, 2, 3]);
  });

  it("should return an empty array if the acolade group is empty", () => {
    const inputRule = new InputRule([], []);

    const result = inputRule.convertAcoladeGroupToArray("{}");

    expect(result).toEqual([]);
  });

  it("should return an empty array if the acolade group is not well-formed", () => {
    const inputRule = new InputRule([], []);

    const result = inputRule.convertAcoladeGroupToArray("{0, 1, 2");

    expect(result).toEqual([]);
  });
});

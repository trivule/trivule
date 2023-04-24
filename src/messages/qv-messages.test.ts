import { QvMessages } from ".";

describe("QvMessages", () => {
  it("should get messages for valid rules", () => {
    const messages = new QvMessages().getRulesMessages(["required", "email"]);
    expect(messages).toEqual([
      "The :field field is required",
      "Please enter a valid email address",
    ]);
  });

  it("should get default message for invalid rules", () => {
    const messages = new QvMessages().getRulesMessages(["unknown" as any]);
    expect(messages).toEqual(["Invalid input"]);
  });

  it("should parse message correctly", () => {
    const message = "The :field field must be less than or equal to :max";
    const parsedMessage = new QvMessages().parseMessage(
      "age",
      "max",
      message,
      "18"
    );
    expect(parsedMessage).toEqual(
      "The age field must be less than or equal to 18"
    );
  });

  it("should parse message correctly", () => {
    const message = "The :field field must be between in :min and :max";
    const parsedMessage = new QvMessages().parseMessage(
      "age",
      "between",
      message,
      "18,30"
    );
    expect(parsedMessage).toEqual("The age field must be between in 18 and 30");
  });
});

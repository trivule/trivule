import { phone } from "./phone";

describe("phone", () => {
  it("should return true for a valid phone number", () => {
    const validPhoneNumber = "+33612345678";
    expect(phone(validPhoneNumber)).toBe(true);
  });

  it("should return false for an invalid phone number", () => {
    const invalidPhoneNumber = "123456789";
    expect(phone(invalidPhoneNumber)).toBe(false);
  });

  it("should return true for a valid phone number in a specific country", () => {
    const validUSPhoneNumber = "+14155552671";
    expect(phone(validUSPhoneNumber, "US")).toBe(true);
  });

  it("should return true for a valid phone number in one of the listed countries", () => {
    const validFRPhoneNumber = "+33123456789";
    expect(phone(validFRPhoneNumber, "US,FR,BJ")).toBe(true);
  });
});

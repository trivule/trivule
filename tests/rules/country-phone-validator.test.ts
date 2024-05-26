import { CountryPhoneValidator } from '../../src/rules/phone/country-phone-validator';

describe('CountryPhoneValidator', () => {
  it('should validate a phone number in Togo', () => {
    const validator = new CountryPhoneValidator('+22812345678', 'TG');
    expect(validator.validPhoneNumber()).toBe(true);
  });

  it('should validate a phone number in France', () => {
    const validator = new CountryPhoneValidator('+33 6 12-34-56-78', 'FR');
    expect(validator.validPhoneNumber()).toBe(true);
  });

  it('should validate a phone number in the United States', () => {
    const validator = new CountryPhoneValidator('+14155552671', 'US');
    expect(validator.validPhoneNumber()).toBe(true);
  });

  it('should validate a globally formatted phone number', () => {
    const validator = new CountryPhoneValidator('+442071838750');
    expect(validator.validPhoneNumber()).toBe(true);
  });

  it('should validate multiple country codes', () => {
    const validator = new CountryPhoneValidator('+22812345678', 'TG, FR, US');
    expect(validator.validPhoneNumber()).toBe(true);
  });

  it('should validate phone number form globally', () => {
    const validator = new CountryPhoneValidator('06 23 45 67 89');
    expect(validator.validPhoneNumber()).toBe(true);
  });
  it('should throw an error for an invalid country code', () => {
    const validator = new CountryPhoneValidator('+22812345678', 'XX');
    expect(() => validator.validPhoneNumber()).toThrowError(
      "Validator method 'validateXX' does not exist.",
    );
  });
});

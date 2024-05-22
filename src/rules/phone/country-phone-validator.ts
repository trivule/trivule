import { isNumber } from '../number';
import { is_string } from '../string';
import { CountryPhoneValidatorInterface } from './country-phone-validator.interface';
/**
 * This takes care of validating telephone numbers using a convention  validateCountryCode
 * @author Claude Fassinou
 */
export class CountryPhoneValidator implements CountryPhoneValidatorInterface {
  protected _value: string;
  protected code?: string;
  protected attribute: string | null;

  constructor(value: string, code?: string, attribute: string | null = null) {
    this._value = this._trim(value);
    this.code = code;
    this.attribute = attribute;
  }
  //Tog
  protected validateTG(): boolean {
    return /^(\+228|00228)\d{8}$/.test(this._value);
  }
  //Niger
  protected validateNE(): boolean {
    return /^(\+227|00227)\d{8}$/.test(this._value);
  }
  //Guine biseau
  protected validateGW(): boolean {
    return /^(\+245|00245)\d{7,8}$/.test(this._value);
  }
  //Tchad
  protected validateTD(): boolean {
    return /^(\+235|00235)\d{8}$/.test(this._value);
  }
  //Cameroun
  protected validateCM(): boolean {
    return /^(\+237|00237)\d{8}$/.test(this._value);
  }
  //Burkina Faso
  protected validateBF(): boolean {
    return /^(\+226|00226)\d{8}$/.test(this._value);
  }
  //Angola
  protected validateAO(): boolean {
    return /^(\+244|00244)[9,2][1-9]\d{7}$/.test(this._value);
  }
  //Benin
  protected validateBJ(): boolean {
    return /^(\+229|00229)\d{8}$/.test(this._value);
  }
  // United States
  protected validateUS(): boolean {
    return /^(\+1|001)[2-9]\d{9}$/.test(this._value);
  }

  // French
  protected validateFR(): boolean {
    return /^(\+33|0033|0)[1-9](\d{2}){4}$/.test(this._value);
  }
  /**
   * Call the phone validator method for each country code and return the results.
   *
   * @returns An array of validation results, where each element corresponds to a country code and is either `true` or `false`.
   * @throws Error if the validator method for a country code does not exist.
   */
  validPhoneNumber(): boolean {
    if (!(is_string(this._value) || isNumber(this._value))) {
      return false;
    }
    if (typeof this.code === 'string') {
      const results: boolean[] = [];
      //Parse code
      const codes = this.code
        .split(',')
        .map((code) => code.trim().toUpperCase());
      //For each code, call the corresponding function
      for (const code of codes) {
        const methodName = `validate${code}`;
        const method = this[methodName as keyof this];
        //Ensure that the method exists
        if (typeof method === 'function') {
          results.push(method.call(this));
        } else {
          throw new Error(`Validator method '${methodName}' does not exist.`);
        }
      }
      return results.some((isValid) => isValid);
    }
    return this._validGlobally();
  }

  /**
   * Validates a phone number in a general manner with a margin of error.
   * @link https://en.wikipedia.org/wiki/List_of_mobile_telephone_prefixes_by_country
   * Will help you
   */
  private _validGlobally() {
    // Start with + or 00 or 0
    // country prefix (1-3 integers)
    // mobile prefix (1-4 integers)
    // The rest of the mobile phone number (6,13)
    // US ex: +1 684 61008976
    return /^(\+|00|0)[0-9]{1,3}[0-9]{1,4}[0-9]{6,13}$/.test(this._value);
  }

  private _trim(value: string): string {
    value = typeof value !== 'string' ? value : String(value);
    return value.replace(/\s/g, '').replace(/-/g, '').replace(/\./g, '');
  }
}

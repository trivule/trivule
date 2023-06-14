import { RuleCallBack } from "../contracts";
import { CountryPhoneValidator } from "./phone/country-phone-validator";
/**
 * This callback validates the format of the phone number.
 * Note that this may contain errors given the diversity of existing telephone numbers.
 *
 * @param input
 * @param params
 * phone(phoneNumber) //Validate globally
 * phone(phoneNumber,'US') //Validate for a country
 * phone(phoneNumber,'US,FR,BJ') // Vlaidate for one of the countries listed
 *
 * @example
 * ```html
 *  <input data-qv-rules="phone:US,FR,BJ" />
 * <!--valide phone globally--/>
 *   <input data-qv-rules="phone" />
 * ```
 */
export const phone: RuleCallBack = (input, params) => {
  return new CountryPhoneValidator(input, params).validPhoneNumber();
};

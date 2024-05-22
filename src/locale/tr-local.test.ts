import { isSubObject } from '../utils';
import { TrLocal } from './tr-local';

describe('TrLocal', () => {
  beforeEach(() => {
    // Reset the messages to the default state before each test
    TrLocal.putMessages({
      required: 'This field is required.',
      email: 'Please enter a valid email address.',
      maxLength: 'The maximum length is {length} characters.',
      default: 'The field is invalid.',
    });
  });

  describe('getRuleMessage', () => {
    it('should return the message for the specified rule and language', () => {
      const message = TrLocal.getRuleMessage('required', 'en');
      expect(message).toBe('This field is required.');
    });

    it('should return the default message if the rule message is not found', () => {
      const message = TrLocal.getRuleMessage('unknownRule', 'en');
      expect(message).toBe('The field is invalid.');
    });

    it('should return the message for the default language if no language is specified', () => {
      const message = TrLocal.getRuleMessage('required');
      expect(message).toBe('This field is required.');
    });
  });

  describe('addMessage', () => {
    it('should add a new message for the specified rule and language', () => {
      TrLocal.addMessage(
        'minlength',
        'The minimum length is {length} characters.',
        'en',
      );
      const subsMessage = TrLocal.getRuleMessage('minlength', 'en');
      expect(subsMessage).toEqual('The minimum length is {length} characters.');
    });
  });

  describe('putMessages', () => {
    it('should update the messages object for the specified language', () => {
      const newMessages = {
        required: 'Field is required.',
        email: 'Enter a valid email address.',
      };
      TrLocal.putMessages(newMessages, 'en');
      const messages = TrLocal.getMessages('en');
      expect(isSubObject(newMessages, messages)).toEqual(true);
    });

    it('should update the messages object for the default language if no language is specified', () => {
      const newMessages = {
        required: 'Field is required.',
        email: 'Enter a valid email address.',
      };
      TrLocal.putMessages(newMessages);
      const messages = TrLocal.getMessages('en');
      expect(isSubObject(newMessages, messages)).toEqual(true);
    });
  });

  describe('translate', () => {
    it('should translate the messages into the specified language', () => {
      const translatedMessages = {
        required: 'Champ requis.',
        email: 'Veuillez saisir une adresse e-mail valide.',
        maxLength: 'La longueur maximale est de {length} caractères.',
      };
      TrLocal.translate('fr', translatedMessages);
      const messages = TrLocal.getMessages('fr');
      expect(isSubObject(translatedMessages, messages)).toEqual(true);
    });
  });

  describe('rewrite', () => {
    it('should rewrite the message for the specified rule and language', () => {
      TrLocal.rewrite('en', 'required', 'Please fill out this field.');
      const message = TrLocal.getRuleMessage('required', 'en');
      expect(message).toBe('Please fill out this field.');
    });
  });

  describe('rewriteMany', () => {
    it('should rewrite multiple messages for the specified language', () => {
      const rules = ['required', 'email', 'maxlength'];
      const messages = [
        'Champ requis.',
        'Veuillez saisir une adresse e-mail valide.',
        'Longueur maximale : {length} caractères.',
      ];
      TrLocal.rewriteMany('fr', rules, messages);
      const frMessages = TrLocal.getMessages('fr');
      const messagesObject = {
        required: 'Champ requis.',
        email: 'Veuillez saisir une adresse e-mail valide.',
        maxlength: 'Longueur maximale : {length} caractères.',
      };
      expect(isSubObject(messagesObject, frMessages)).toBe(true);
    });

    it("should throw an error if the 'lang' argument is not a string", () => {
      expect(() => {
        TrLocal.rewriteMany(null as any, ['required'], ['Champ requis.']);
      }).toThrow(
        "The 'lang' argument must be a string with one or more characters",
      );
    });

    it("should throw an error if the 'rules' argument is not an array", () => {
      expect(() => {
        TrLocal.rewriteMany('fr', 'required' as any, ['Champ requis.']);
      }).toThrow("The 'rules' and 'messages' arguments must be arrays");
    });

    it("should throw an error if the 'messages' argument is not an array", () => {
      expect(() => {
        TrLocal.rewriteMany('fr', ['required'], 'Champ requis.' as any);
      }).toThrow("The 'rules' and 'messages' arguments must be arrays");
    });

    it("should throw an error if the 'rules' and 'messages' arrays have different lengths", () => {
      expect(() => {
        TrLocal.rewriteMany('fr', ['required', 'email'], ['Champ requis.']);
      }).toThrow("The 'rules' and 'messages' arrays must have the same length");
    });
  });

  describe('local', () => {
    it('should set the current translation language', () => {
      TrLocal.local('fr');
      const currentLanguage = TrLocal.getLocal();
      expect(currentLanguage).toBe('fr');
    });

    it('should throw an error if the language is not a valid string', () => {
      expect(() => {
        TrLocal.local('');
      }).toThrow('The language must be a valid string');
    });
  });
});

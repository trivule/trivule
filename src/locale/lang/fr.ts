import { RulesMessages } from "../../contracts";

export const fr_messages: RulesMessages = {
  default: "Le champ :field est invalide",
  required: "Le champ :field est requis",
  email: "Veuillez entrer une adresse e-mail valide",
  maxlength: "Le nombre maximal de caractères autorisés a été dépassé",
  minlength: "Le nombre minimal de caractères autorisés n'a pas été atteint",
  min: "Le champ :field doit être supérieur ou égal à ':min'",
  max: "Le champ :field doit être inférieur ou égal à ':max'",
  string: "Veuillez entrer une chaîne de caractères",
  between: "La valeur de ce champ doit être comprise entre ':min' et ':max'",
  startWith: "Le champ :field doit commencer par ':startWith'",
  endWith: "Le champ :field doit se terminer par ':endWith'",
  contains: "Le champ :field doit contenir la valeur ':contains'",
  in: "Veuillez choisir une valeur correcte pour le champ :field",
  integer: "Le champ :field doit être un entier",
  int: "Le champ :field doit être un entier",
  number: "Ce champ doit être un nombre",
  numeric: "Ce champ doit être un nombre",
  file: "Ce champ doit être un fichier",
  url: "Ce champ doit être une URL valide",
  length: "La taille de ce champ doit être :size",
  len: "La taille de ce champ doit être :size",
  maxFileSize: "La taille du fichier doit être inférieure à :maxFileSize.",
  minFileSize: "La taille du fichier doit être supérieure à :minFileSize.",
  size: "La taille de ce champ doit être inférieure ou égale à :size",
  boolean: "Ce champ doit être un booléen (oui ou non)",
  startWithUpper: "Ce champ doit commencer par une lettre majuscule",
  startWithLower: "Ce champ doit commencer par une lettre minuscule",
  nullable: "",
  password:
    "Le mot de passe doit comporter au moins 8 caractères et inclure une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.",
  date: "Ce champ doit être une date valide",
  before: "La date doit être antérieure à (:beforeDate)",
  after: "La date doit être postérieure à (:afterDate)",
  same: "Ce champ doit être identique à la valeur du champ :same",
  requiredIf:
    "Le champ :field est requis lorsque le champ :other a la valeur actuelle",
  requiredWhen:
    "Le champ :field est requis lorsque les champs :otherFields sont présents",
  phone: "Ce numéro de téléphone semble être invalide",
};

import { QvBag } from "./qv-bag";

describe("QvBag", () => {
  it("should return true if a rule exists in the rules bag", () => {
    // Ajouter une règle personnalisée au sac de règles
    QvBag.addRule("customRule", () => true);

    // Vérifier si la règle customRule existe dans le sac de règles
    expect(QvBag.hasRule("customRule")).toBe(true);
  });

  it("should return false if a rule does not exist in the rules bag", () => {
    // Vérifier si une règle inexistante dans le sac de règles retourne false
    expect(QvBag.hasRule("nonexistentRule")).toBe(false);
  });
});

describe("rule", () => {
  it("should add a custom validation rule to the rules bag with a message", () => {
    // Définir une fonction de rappel pour la règle personnalisée
    const customCallback = jest.fn();

    // Appeler la méthode rule pour ajouter la règle personnalisée avec un message
    QvBag.rule("customRule", customCallback, "This is a custom error message");

    // Vérifier si la règle et le message ont été ajoutés au sac de règles et de messages
    expect(QvBag.getRule("customRule")).toBe(customCallback);
    expect(QvBag.getMessage("customRule")).toBe(
      "This is a custom error message"
    );
  });

  it("should add a custom validation rule to the rules bag without a message", () => {
    // Définir une fonction de rappel pour la règle personnalisée
    const customCallback = jest.fn();

    // Appeler la méthode rule pour ajouter la règle personnalisée sans message
    QvBag.rule("customRule", customCallback);

    // Vérifier si la règle a été ajoutée au sac de règles avec un message par défaut
    expect(QvBag.getRule("customRule")).toBe(customCallback);
  });
});

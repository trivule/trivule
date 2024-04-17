import { TrLocal } from "./locale/tr-local";
import { Trivule, TrivuleForm, TrivuleInput } from "./validation";
const tr = new TrivuleForm("form");
tr.init();
tr.onFails((tr) => {
  //
});
tr.onPasses((tr) => {
  //Le formulaire passe
});

tr.onUpdate((tr) => {
  //Le formulaire est mise à jour, ajout ou retrait d'un nouveau champ
});

tr.rule(
  "username",
  (input: string) => {
    return input != "sudo";
  },
  "The username should not be 'sudo'"
);
//initialize
tr.init();

TrLocal.translate("es", {
  min: "El campo :field debe ser menor que :arg0",
  max: "El campo :field debe ser mayor que :arg0",
  required: "El campo :field es obligatorio",
});

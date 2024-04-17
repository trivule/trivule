import { TvLocal } from "./locale/tv-local";
import { Trivule, TrivuleForm, TrivuleInput } from "./validation";
const tv = new TrivuleForm("form");
tv.init();
tv.onFails((tv) => {
  //
});
tv.onPasses((tv) => {
  //Le formulaire passe
});

tv.onUpdate((tv) => {
  //Le formulaire est mise à jour, ajout ou retrait d'un nouveau champ
});

tv.rule(
  "username",
  (input: string) => {
    return input != "sudo";
  },
  "The username should not be 'sudo'"
);
//initialize
tv.init();

TvLocal.translate("es", {
  min: "El campo :field debe ser menor que :arg0",
  max: "El campo :field debe ser mayor que :arg0",
  required: "El campo :field es obligatorio",
});

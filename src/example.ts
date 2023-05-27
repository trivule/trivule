import { QvForm } from "./validation";

const qvForm = new QvForm("#myForm");
/**
 * Validation les éléménts d'un formulaire sans utiliser les attriuts HTML
 */
qvForm.withMany({
  email: {
    rules: ["required", "email"],
  },
  email_confirmation: {
    rules: ["required", "same:email"],
  },
});
qvForm.init();

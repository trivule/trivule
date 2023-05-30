import { QvForm } from "./validation";

/**
 * Support internationalization
 */
const qvForm = new QvForm("#myForm", {
  local: {
    lang: "es",
  },
});
//Valide many inputs without using data-qv attribut
qvForm.withMany({
  phone: {
    rules: ["phone:US"],
    messages: ["Invalide phone number"], //Optional,
    failsOnfirst: true,
    feedbackElement: null, // optional, null, html element, or css selector
  },
});

//Call init function
qvForm.init();

qvForm.onFails; // Passe a callback function, and do something if form is invalid

qvForm.on; // Listen for an event from the form element and call a callback function

qvForm.destroy(); //Destroys the QvForm instance and performs any necessary cleanup.

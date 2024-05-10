import { TrivuleForm } from "./validation";

const trivuleForm = new TrivuleForm("form", {
  feedbackSelector: ".invalid-feedback",
});

trivuleForm.init();

trivuleForm.make([
  {
    selector: "name",
    rules: ["required", "minlength:5", "upper"],
  },
  {
    selector: "age",
    rules: ["int", "min:18"],
  },
]);

trivuleForm.make({
  email: {
    rules: ["required", "email", "maxlength:60"],
    messages: [
      "The email cannot be empty",
      "Please enter a valid email address",
      "The email must be at least 60 characters",
    ],
  },
});

trivuleForm.onValidate((form) => {
  const percent = (form.validated().length / trivuleForm.all().length) * 100;

  const nc = document.getElementById("number-increment");
  if (nc) {
    nc.innerHTML = "" + form.validated().length;
  }
  if (percent < 34) {
    form
      .removeClassFromNativeElement("warning")
      .removeClassFromNativeElement("success")
      .setClassToNativeElement("danger");
    return;
  }
  if (percent < 67) {
    form
      .removeClassFromNativeElement("success")
      .removeClassFromNativeElement("danger");
    form.setClassToNativeElement("warning");
    return;
  }
  if (percent == 100) {
    form
      .removeClassFromNativeElement("warning")
      .removeClassFromNativeElement("danger")
      .setClassToNativeElement("success");
  }
});

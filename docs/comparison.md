### File Validation: jQuery Validate vs Trivule

File validation in web forms is an essential step to ensure users upload appropriate file types and adhere to size limits. Let's quickly compare how to achieve this validation with jQuery Validate and Trivule.

#### With jQuery Validate

```javascript
$("form").validate({
    rules: {
        resume: {
            required: true,
            extension: "pdf",
            filesize: 5242880, // 5MB
        },
    },
    messages: {
        resume: {
            required: "Please select a PDF file.",
            extension: "Please upload a PDF file only.",
            filesize: "File size must be less than 5MB.",
        },
    },
    errorPlacement: function (error, element) {
        var resumeError = $('[data-tr-feedback="resume"]');
        resumeError.text(error.text());
    },
});
```

#### With Trivule

```javascript
new TrivuleInput("input", {
    rules: "required|mimes:.pdf|size:5242880B",
    feedbackElement: "#resume",
})
```

#### Declarative Validation with Trivule

```html
<input
    name="resume"
    type="file"
    data-tr-rules="required|mimes:.pdf|size:5MB"
/>
<div data-tr-feedback="resume"></div>
```

### Comparison

- **Syntax**: jQuery Validate requires detailed configuration of validation rules and error messages, while Trivule offers a more concise and intuitive syntax.
- **Customization**: Both libraries allow customization of error messages, but Trivule handles this task more automatically by default.
- **File Size**: Both libraries allow setting maximum file upload sizes, but Trivule's syntax seems clearer and easier to understand.
- **Popularity**: jQuery Validate is widely used and has a large developer community, while Trivule is newer but gaining popularity due to its simplicity and versatility.

In conclusion, both libraries offer effective file validation features, but Trivule stands out for its concise syntax and ease of use, especially for declarative validation tasks.
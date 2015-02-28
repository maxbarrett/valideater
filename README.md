# Valideater (vldtr) 2.0

A jQuery/Zepto form validation plugin using HTML data attributes.


To initialise a specific form: `$('form.cssSelector').vldtr();`

To initialise each form on a page:
```sh
$('form').each(function () {
	$(this).vldtr();
});
```

Validations and default error messages:

* alpha:		'Value must be letters'
* alphanumeric:	'Letters and numbers required'
* characters4:	'At least 4 characters please'
* dob:			'Please give a valid date of birth'
* email:		'Invalid email'
* matches:		'These values do not match'
* numeric:		'Value must be numeric'
* postcode:		'Invalid postcode'
* radio:		'Please choose an option'
* required:		'This information is required'


To validate an element add a `data-vldtr` attribute with a comma separated list of validations as the value, eg: `<input type="text" data-vldtr="required,alpha,characters4">`

Customisation
-------------

Error messages can be customised as an attribute in the markup: `data-vldtr-err-[name]`. Eg:
```sh
<input type="text" data-vldtr="required" data-vldtr-err-required="My unique error msg">
```

They can also be customised with JS at initialisation:

```sh
$('form.register').vldtr({
	alpha:			'Custom error message',
	alphanumeric:	'Say what you like',
	dob:			'For any specific form'
});
```

Forms with errors are re-validated on each keystroke by default, prevent this by setting `liveCheck` to `false` (form will be re-validated on submit).

```sh
$('form').vldtr({
	livecheck: false
});
```

To suppress error messages for an element add `data-vldtr-alert` as an attribute, CSS classes will still be added.
If you'd like to turn error messages off for all elements, pass `alerts: false` at initialisation.



CSS
---

Various `js-vldtr-error` and `js-vldtr-alert` CSS classes are added to the markup for styling, go nuts.


Validations
-----------

### alpha

Default error message: `Value must be letters`


### alphanumeric
[todo: broken]
Default error message: `Letters and numbers required`


### characters4
`At least 4 characters please`


### dob (date of birth)
Requires text format: DD/MM/YYYY

A minimum age requirement can be added as an attribute on the input: `data-vldtr-ageover="21"` or at initialisation:
```sh
$('form').valideater({
	ageover: 18
});
```
`Please give a valid date of birth`


### email
Default error message: `Invalid email`


### matches
Requires a `data-vldtr-matches` attribute with the value of the ID of the element to match. Eg:
```sh
<input type="email" placeholder="Email" id="toMatch" data-vldtr="email">
<input type="email" placeholder="Confirm email" data-vldtr="matches" data-vldtr-matches="toMatch">
```

Default error message: `These values do not match`


### numeric
Default error message: `Value must be numeric`


### postcode
[todo: Containsspace improvement required]
Default error message: `Invalid postcode`


### radio
The `data-vldtr` attribute must be on a wrapping parent element (eg: `<fieldset>`), so as not to interfere with other unrelated radio buttons in the form.
Default error message: `Please choose an option`


### required
Default error message: `This information is required`






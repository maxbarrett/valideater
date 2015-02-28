# Valideater (vldtr) 2.0

A jQuery/Zepto form validation plugin using HTML data attributes.


To initialise a specific form: 
```sh
$('form.cssSelector').vldtr();
```

To initialise each form on a page:
```sh
$('form').each(function () {
	$(this).vldtr();
});
```

| Validation    | Default error message               |
| ------------- |-------------------------------------|
| alpha     	| Value must be letters               |
| alphanumeric  | Letters and numbers required        |
| characters4 	| At least 4 characters please        |
| dob			| Please give a valid date of birth   |
| Email 		| Invalid email                       |
| matches 		| These values do not match           |
| numeric 		| Value must be numeric               |
| postcode 		| Invalid postcode                    |
| radio 		| Please choose an option             |
| required 		| This information is required        |


To validate an element add a `data-vldtr` attribute with a comma separated list of validations as the value, eg:
```sh
<input type="text" data-vldtr="required,alpha,characters4">
```

Customisation
-------------

Error messages can be customised by adding a `data-vldtr-err-[name]` attribute in the markup eg:
```sh
<input type="text" data-vldtr="required" data-vldtr-err-required="My unique error msg">
```

Or they can be customised with JS at initialisation:

```sh
$('form.myClass').vldtr({
	alpha:			'Letters only please',
	alphanumeric:	'You must use numbers and letters',
	dob:			'When were you born?'
});
```

To suppress alert messages for an element add `data-vldtr-alert="false"` as an attribute (CSS classes will still be added):
```sh
<input type="text" data-vldtr="required" data-vldtr-alert="false">

```

If you'd like to turn error messages off for all elements, pass in:
```sh
alerts: false
```

Forms with errors are re-validated on each keystroke by default, prevent this with: 
```sh
livecheck: false
```

The form will be re-validated on submit.


CSS
---

Various `js-vldtr-error` and `js-vldtr-alert` CSS classes are added to the markup for styling. 

The names can be overriden with JS at initialisation:
```sh
$('form').vldtr({
	errorCssClass: 'js-myCustomErrorClass',
	alertCssClass: 'js-myCustomAlertClass'
});
```


Validations
-----------

### alpha
Default error message: `Value must be letters`


### alphanumeric
Must contain at least one number and one letter. No spaces or special characters.

Default error message: `Letters and numbers required`


### characters4
Default error message: `At least 4 characters please`


### dob (date of birth)
Requires text format: DD/MM/YYYY

The default minimum and maximum age requirements are 18 and 122 years old.

These can be overriden as attributes on the input: `data-vldtr-minage="21"` and `data-vldtr-maxage="100"`. Or using JS at initialisation:
```sh
$('form').valideater({
	minage: 16,
	maxage: 65
});
```

Default error message: `Please give a valid date of birth`


### email
Default error message: `Invalid email`


### matches
Requires a `data-vldtr-matches` attribute with the value of the ID of the element to match. Eg:
```sh
<input type="email" placeholder="Email" id="toMatch" data-vldtr="email">
<input type="email" placeholder="Confirm email" data-vldtr="matches" data-vldtr-matches="toMatch">
```
The confirmation element should come after element to match. The confirmation element shouldn't need any other validation - the matcher should have those.

Default error message: `These values do not match`


### numeric
Default error message: `Value must be numeric`


### postcode
Must be a UK postcode.

Default error message: `Invalid postcode`


### radio
The `data-vldtr` attribute must be on a wrapping parent element (eg: `<fieldset>`), so as not to interfere with other unrelated radio buttons in the form.

Default error message: `Please choose an option`


### required
Default error message: `This information is required`






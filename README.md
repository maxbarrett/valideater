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

**alpha**:		'Value must be letters'
**alphanumeric**:	'Letters and numbers required'
**characters4**:	'At least 4 characters please'
**dob**:			'Please give a valid date of birth'
**email**:		'Invalid email'
**matches**:		'These values do not match'
**numeric**:		'Value must be numeric'
**postcode**:		'Invalid postcode'
**radio**:		'Please choose an option'
**required**:		'This information is required'


To validate an element add a `data-vldtr` attribute with a comma separated list of validations as the value, eg: `<input type="text" data-vldtr="required,alpha,characters4">`

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

Forms with errors are re-validated on each keystroke by default, prevent this with `livecheck: false` (form will be re-validated on submit).

To suppress error messages for an element add `data-vldtr-alert="false"` as an attribute (although CSS classes will still be added):
```sh
<input type="text" data-vldtr="required" data-vldtr-alert="false">

```

To change these CSS classes you can configure `errorCssClass` and `alertCssClass`:
```sh
$('form.myClass').vldtr({
	errorCssClass:	'js-custom',
	alertCssClass:	'js-custom'
});
```


If you'd like to turn error messages off for all elements, pass in `alerts: false`.



CSS
---

Various `js-vldtr-error` and `js-vldtr-alert` CSS classes are added to the markup for styling, go nuts. These can be overriden with JS at initialisation:
```sh
$('form').vldtr({
	errorCssClass: 'js-cutomErrorClass',
	alertCssClass: 'js-cutomAlertClass'
});
```


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

The default minimum and maximum age requirements are 18 and 122 years old.
These can be overriden as attributes on the input: `data-vldtr-minage="21"` and `data-vldtr-maxage="100"`.

Or using JS at initialisation:
```sh
$('form').valideater({
	minage: 16
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
The confirmation element should come after element to match
The confirmation element shouldn't need any other validation - the matcher should have those

Default error message: `These values do not match`


### numeric
Default error message: `Value must be numeric`


### postcode
Must be a UK postcode
Default error message: `Invalid postcode`


### radio
The `data-vldtr` attribute must be on a wrapping parent element (eg: `<fieldset>`), so as not to interfere with other unrelated radio buttons in the form.
Default error message: `Please choose an option`


### required
Default error message: `This information is required`






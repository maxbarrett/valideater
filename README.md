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
* dob:			'Please give a valid date of birth'
* characters4:	'At least 4 characters please'
* email:		'Invalid email'
* matches:		'These values do not match'
* numeric:		'Value must be numeric'
* postcode:		'Invalid postcode'
* radio:		'Please choose an option'
* required:		'This information is required'


To validate an element add a `data-vldtr` attribute with a comma separated list of validations as the value, eg: `<input type="text" data-vldtr="required,alpha,characters4">`

Customisation
-------------

Error messages can be customised as an attribute in the markup: `data-vldtr-[name]`. Eg:
```sh
<input type="text" data-vldtr="required" data-vldtr-required="My unique error msg for the required validation check">
```

They can also be customised with JS at initialisation:

```sh
$('form.register').vldtr({
	alpha:			'Custom error message',
	alphanumeric:	'Say what you like',
	dob:			'For any specific form'
});
```

Forms with errors are re-validated on each keystroke by default, prevent this by setting `liveCheck` to `false` (the form will be re-validated on submit).

```sh
$('form').vldtr({
	livecheck: false
});
```


CSS
---

Various `js-error` and `js-alert` css classes are added to the markup for styling, go nuts.


### Validations

alpha
-----
`Value must be letters`


alphanumeric
------------
[todo: broken]
`Letters and numbers required`


dob (date of birth)
-------------------
Requires text format: DD/MM/YYYY

A minimum age requirement can be added as an attribute on the input: `data-vldtr-ageover="21"` or at initialisation:
```sh
$('form').valideater({
	ageover: 18
});
```
`Please give a valid date of birth`
		

characters4
-----------
`At least 4 characters please`


email
-----
`Invalid email`

matches
-------
[todo: explain]
`These values do not match`

numeric
-------
`Value must be numeric`

postcode
--------
[todo: Containsspace improvement required]
`Invalid postcode`

radio
-----
The `data-vldtr` attribute must be on a wrapping parent element, so as not to interfere with other unrelated radio buttons in the form.
`Please choose an option`

required
--------
`This information is required`






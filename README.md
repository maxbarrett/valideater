# Valideater

A jQuery form validation plugin using HTML data attributes.

To initialise each form on a page:

```sh
$('form').each(function () {
	$(this).valideater();
});
```

The list of validations and default error messages:

* alpha:			'Value must be letters'
* alphanumeric:	'Letters and numbers required'
* dob:			'Please give a valid date of birth'
* over18:			'You must be 18 or over'
* email:			'Invalid email'
* matches:		'These values do not match'
* numeric:		'Value must be numeric'
* min4:			'At least 4 characters please'
* postcode:		'Invalid postcode'
* radio:			'Please choose an option'
* required:		'This information is required'

To declare a validation on an element, add a `data-valideater` attribute with and a comma separated list of validations as the value, eg:

```sh
<input type="text" data-valideater="required,alpha,min4">

```


Error messages can be customised either at initialisation:

```sh
$('form.register').valideater({
	alpha:			'Custom error message',
	alphanumeric:	'Say what you like',
	dob:			'For any specific form'
});
```

Or individually as an attribute in the markup – these take precedence over initialisation customisations shown above.
```sh
<input type="text" data-valideater="required" data-error-msg-required="My unique error msg">
```

Various error and alert css classes are added to the markup for styling.


# Valideater

A jQuery form validation plugin.

To initialise each form on a page:

```sh
$('form').each(function () {
	$(this).valideater();
});
```




List of validation checks and their corresponding default error message:

* alpha:			'Value must be letters',
* alphanumeric:	'Letters and numbers required',
* dob:			'Please give a valid date of birth',
* over18:			'You must be 18 or over',
* email:			'Invalid email',
* matches:		'These values do not match',
* numeric:		'Value must be numeric',
* min4:			'At least 4 characters please',
* postcode:		'Invalid postcode',
* radio:			'Please choose an option',
* required:		'This information is required'




Error messages can be customised either at initialisation:

```sh
$('form').each(function () {
	$(this).valideater({
			'alpha':		'Custom error message',
			'alphanumeric':	'Say what you like',
			'dob':			'For each form on the page',
	});
});
```

Or individually in the markup – these take precedence over initialisation customisations shown above.
```sh
<input type="text" data-valideater="required" data-error-msg-required="My unique error msg">
```




Various error and alert css classes are added to markup for styling.


# Valideater 2.0

A jQuery/Zepto form validation plugin using HTML data attributes.

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

### Customisation

Error messages can be customised either at initialisation:

```sh
$('form.register').valideater({
	alpha:			'Custom error message',
	alphanumeric:	'Say what you like',
	dob:			'For any specific form'
});
```

Or individually as a `data-error-msg-[validation name]` attribute in the markup – these take precedence over the initialisation customisations shown above.
```sh
<input type="text" data-valideater="required" data-error-msg-required="My unique error msg">
```

Forms with errors are re-validated on each keystroke by default, you can prevent this by setting `liveCheck` to `false`. The form will then be re-validated on submit.

```sh
$('form').valideater({
	liveCheck: false
});
```


### CSS:

Various `js-error` and `js-alert` css classes are added to the markup for styling, go nuts.


### WIP:

* Alphanumeric
Broken

* Radio buttons
The `data-valideater` attribute must be on a wrapping parent element, so as not to interfere with other unrelated radio buttons in the form.

* Date of birth
Needs work...

* Over18
Also needs TLC...

* Postcode
Containsspace improvement required

* Matches
Needs explaining





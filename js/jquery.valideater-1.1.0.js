 /*
 * Valideater Plugin v1.1
 *
 * From the brain of Max Barrett
 *
 * Relies on jQuery.js
 * http://jQuery.com/
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 */

(function($) {


	// The main valideater function.
	$.fn.valideater = function(method, options) {

		// Cache the form
		var $thisForm = this;

		// Remove HTML5 validation if we're using Valideater
		$thisForm.attr('novalidate', '');

		// Our defaults, which can be overridden.
		var defaults = {
			errorMessages: {
				'alpha': 'Just letters in here please',
				'alphanumeric': 'We need letters and numbers here please',
				'dob': 'All numbers in here please',
				'age': 'Whoops. You must be 18 or over',
				'email': 'That email doesn\'t look right, please try again',
				'matches': 'Oh no! These fields don\'t match!',
				'numeric': 'Just numbers in here please',
				'password': 'At least 4 characters please',
				'postcode': 'That postcode doesn\'t look right, please try again',
				'radio': 'Please choose an option',
				'required': 'This information is required'
			}
		};

		$.extend(defaults, options || method);

		// Define the valideater methods
		//
		// methods.init()
		// methods.errors()
		// methods.required()
		// methods.alpha()
		// methods.numeric()
		// methods.alphanumeric()
		// methods.email()
		// methods.postcode()
		// methods.password()
		// methods.matches()
		//
		// methods.processErrors()
		// methods.hideErrors()
		//
		var methods = {

			formErrors: false,

			// Initialise
			init: function() {

				// when the form is submitted
				return $thisForm.on('submit', function() {

					// Clear all errors
					methods.formErrors = false;

					// Empty all the error arrays
					for (var i in methods.errors) {
						methods.errors[i] = [];
					}

					// Run through the error checking
					validate();

					if (!methods.formErrors) {
						// If there are no errors
						// submit the form
						return true;

					} else {

						// otherwise do live validation on blur
						// 'change' is better for wrapped inputs & radio/checkboxes
						$('[data-valideater]', $thisForm).on('change keyup', function() {
							validate();
						});

						// focus on the first error field
						var $firstError = $('.error:first');

						if ( $firstError.is('input, select, textarea, button') ) {
							$firstError.focus();
						} else {
							$firstError.find('input, select, textarea, button').focus();
						}

						// Don't submit the form
						return false;
					}
				}); // on submit
			},

			// Create error arrays
			errors: {
				'alpha': [],
				'alphanumeric': [],
				'dob': [],
				'age': [],
				'email': [],
				'matches': [],
				'numeric': [],
				'password': [],
				'postcode': [],
				'radio': [],
				'required': []
			},

			////////////////////////////////////
			// Various validation modules below
			////////////////////////////////////
			required: function(fieldObj) {
				var placeholder = $(fieldObj).attr('placeholder');

				if (fieldObj.val() === '' || fieldObj.val() === placeholder) {
					// check that the element is not already in the errors array
					if ($.inArray(fieldObj, methods.errors.required) === -1) {
						methods.errors.required.push(fieldObj[0]);
						methods.formErrors = true;
					}
				} else {
					// hide the error messages
					methods.hideError(fieldObj, 'required');
					// and remove the element from the 'required' error array
					methods.errors.required = $.grep(methods.errors.required, function(elem) {
						return elem !== fieldObj[0];
					});
				}
			},

			radio: function(fieldObj) {
				// radios are wrapped in a div, so find the kids

				var radioChecked = false,
					checked = function(){ return this.checked; },
					radios = $('input[type=radio]', fieldObj);

				if (radios.filter(checked).length) {
					radioChecked = true;
				}

				// if no radios are checked
				if (radioChecked === false) {
					if ($.inArray(fieldObj, methods.errors.radio) === -1) {
						methods.errors.radio.push(fieldObj[0]);
						methods.formErrors = true;
					}
				// else a radio has been checked
				} else {
					methods.hideError(fieldObj, 'radio');
					methods.errors.radio = $.grep(methods.errors.radio, function(elem) {
						return elem !== fieldObj[0];
					});
				}
			},

			dob: function(fieldObj) {
				var dobs = fieldObj.children('input, select'),
					dobError = false;

				for (var i = 0; i < dobs.length; i++) {
					var dob = $(dobs[i]),
						dobVal = dob.val();

					if (dobVal === '' || isNaN(dobVal)) {
						dobError = true;
					} else {
						if (i === dobs.length - 1) {
							//Check if over 18
							var today = new Date();
							var birthDate = new Date($(dobs[2]).val(), $(dobs[1]).val() - 1, $(dobs[0]).val());
							var age = today.getFullYear() - birthDate.getFullYear();
							if ((today.getMonth() - birthDate.getMonth() < 0) ||
								(today.getMonth() - birthDate.getMonth() === 0) &&
								(today.getDate() < birthDate.getDate()) ) {
								age--;
							}
							if (age > 100 || $(dobs[1]).val() - 1 > 12 || $(dobs[0]).val() > 31) {
								dobError = true;
							}
						}
					}
				}

				if (dobError === true) {
					if ($.inArray(fieldObj, methods.errors.dob) === -1) {
						methods.errors.dob.push(fieldObj[0]);
						methods.formErrors = true;
					}
				} else {
					methods.hideError(fieldObj, 'dob');
					methods.errors.dob = $.grep(methods.errors.dob, function(elem) {
						return elem !== fieldObj[0];
					});
				}
			},

			age: function(fieldObj) {
				var dobs = fieldObj.children('input, select'),
					ageError = false;

				for (var i = 0; i < dobs.length; i++) {
					var dob = $(dobs[i]),
						dobVal = dob.val();

					if (i === dobs.length - 1) {
						//Check if over 18
						var today = new Date();
						var birthDate = new Date($(dobs[2]).val(), $(dobs[1]).val() - 1, $(dobs[0]).val());
						var age = today.getFullYear() - birthDate.getFullYear();
						if (today.getMonth() - birthDate.getMonth() < 0 || (today.getMonth() - birthDate.getMonth() === 0 && today.getDate() < birthDate.getDate())) {
							age--;
						}
						if (age < 18) {
							ageError = true;
						}
					}
				}

				if (ageError === true) {
					if ($.inArray(fieldObj, methods.errors.age) === -1) {
						methods.errors.age.push(fieldObj[0]);
						methods.formErrors = true;
					}
				} else {
					methods.hideError(fieldObj, 'age');
					methods.errors.age = $.grep(methods.errors.age, function(elem) {
						return elem !== fieldObj[0];
					});
				}
			},

			alpha: function(fieldObj) {
				var fieldValue = fieldObj.val(),
					reg = /^[a-zA-Z]+$/;

				if (reg.test(fieldValue) === false && fieldValue !== '') {
					if ($.inArray(fieldObj, methods.errors.alpha) === -1) {
						methods.errors.alpha.push(fieldObj[0]);
						methods.formErrors = true;
					}
				} else {
					methods.hideError(fieldObj, 'alpha');
					methods.errors.alpha = $.grep(methods.errors.alpha, function(elem) {
						return elem !== fieldObj[0];
					});
				}
			},

			numeric: function(fieldObj) {
				if (isNaN(fieldObj.val())) {
					if ($.inArray(fieldObj, methods.errors.numeric) === -1) {
						methods.errors.numeric.push(fieldObj[0]);
						methods.formErrors = true;
					}
				} else {
					methods.hideError(fieldObj, 'numeric');
					methods.errors.numeric = $.grep(methods.errors.numeric, function(elem) {
						return elem !== fieldObj[0];
					});
				}
			},

			alphanumeric: function(fieldObj) {
				var reg = /^[a-zA-Z\d]+$/;

				if (reg.test(fieldObj.val()) === false) {
					if ($.inArray(fieldObj, methods.errors.alphanumeric) === -1) {
						methods.errors.alphanumeric.push(fieldObj[0]);
						methods.formErrors = true;
					}
				} else {
					methods.hideError(fieldObj, 'alphanumeric');
					methods.errors.alphanumeric = $.grep(methods.errors.alphanumeric, function(elem) {
						return elem !== fieldObj[0];
					});
				}
			},

			email: function(fieldObj) {
				var fieldValue = fieldObj.val(),
					reg = /^([A-Za-z0-9_\'\-\.\+])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
					placeholder = $(fieldObj).attr('placeholder');

				if (reg.test(fieldValue) === false && fieldValue !== '' && fieldValue !== placeholder) {
					if ($.inArray(fieldObj, methods.errors.email) === -1) {
						methods.errors.email.push(fieldObj[0]);
						methods.formErrors = true;
					}
				} else {
					methods.hideError(fieldObj, 'email');
					methods.errors.email = $.grep(methods.errors.email, function(elem) {
						return elem !== fieldObj[0];
					});
				}
			},

			postcode: function(fieldObj) {
				var fieldValue = fieldObj.val(),
					reg = /(((([A-PR-UWYZ][0-9][0-9A-HJKS-UW]?)|([A-PR-UWYZ][A-HK-Y][0-9][0-9ABEHMNPRV-Y]?))\s{0,2}[0-9]([ABD-HJLNP-UW-Z]{2}))|(GIR\s{0,2}0AA))/i,
					// must be a better way of doing this?
					containsspace = fieldValue.indexOf(' ') >= 0,
					length = 0;

				if (containsspace) {
					length = 8;
				} else {
					length = 7;
				}
				if (reg.test(fieldValue) === false || fieldValue.length > length) {
					if ($.inArray(fieldValue, methods.errors.postcode) === -1) {
						methods.errors.postcode.push(fieldObj[0]);
						methods.formErrors = true;
					}
				} else {
					methods.hideError(fieldObj, 'postcode');
					methods.errors.postcode = $.grep(methods.errors.postcode, function(elem) {
						return elem !== fieldObj[0];
					});
				}
			},

			password: function(fieldObj) {
				var fieldValue = fieldObj.val();

				if (fieldValue.length < 4 && fieldValue !== '') {
					methods.errors.password.push(fieldObj[0]);
					methods.formErrors = true;
				} else {
					methods.hideError(fieldObj, 'password');
					methods.errors.password = $.grep(methods.errors.password, function(elem) {
						return elem !== fieldObj[0];
					});
				}
			},

			// The matches input should come after the one with the id
			// The matches input shouldn't need any other validation (the matcher should have those)
			matches: function(fieldObj) {
				var fieldValue = fieldObj.val(),
					matchesId = fieldObj.attr('data-valideater-matches'),
					matchesValue = $('#' + matchesId).val();

				if (fieldValue !== matchesValue) {
					methods.errors.matches.push(fieldObj[0]);
					methods.formErrors = true;
				} else {
					methods.hideError(fieldObj, 'matches');
					methods.errors.matches = $.grep(methods.errors.matches, function(elem) {
						return elem !== fieldObj[0];
					});
				}
			},



			processErrors: function() {
				// for each array of errors
				for (var typeoferror in methods.errors) {

					// and for each input in this array
					for (var theElem in methods.errors[typeoferror]) {

						// grab each input in each array
						var errorElem = $(methods.errors[typeoferror][theElem]),
							errorId = errorElem.attr('id'),
							position = errorElem.data('valideater-position'),
							alerts;

						errorElem.addClass('error error-' + typeoferror);

						// add an error class to the green glow
						var parent = errorElem.parent();
						if (parent.hasClass('glow')) {
							parent.addClass('error');
						}

						// if we want to show the alert messages:
						if (errorElem.attr("data-alert") !== "false") {

							// check if element already has error state
							if (position === "before") {
								alerts = errorElem.prev().hasClass('alert-' + typeoferror);
							} else {
								alerts = errorElem.next().hasClass('alert-' + typeoferror);
							}

							// if it needs an error state
							if (!alerts) {
								// if there is a custom error message
								var customMsg = errorElem.attr('data-error-msg-' + typeoferror),
									theMessage;

								if (customMsg) {
									theMessage = customMsg;
								} else {
									theMessage = defaults.errorMessages[typeoferror];
								}

								var alert = '<span class="alert alert-' + typeoferror + ' alert-' + errorId + '">' + theMessage + '</span>';

								// add the alerts to the dom
								if (position === "before") {
									errorElem.before(alert);
								} else {
									errorElem.after(alert);
								}
							}
						}

					}
				}
			},

			hideError: function(field, alertClass) {
				var position = field.data('valideater-position');

				// Remove the error classes
				field.removeClass('error-' + alertClass);
				field.removeClass('error');

				var parent = field.parent();
				if (parent.hasClass('glow')) {
					parent.removeClass('error');
				}
				// and remove the alerts from the dom
				if (position === "before") {
					field.prev('.alert-' + alertClass).remove();
				} else {
					field.next('.alert-' + alertClass).remove();
				}

			}

		};


		// Method calling logic
		if (methods[method]) {
			return methods[method].apply(this);
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this);
		} else {
			window.alert('Method ' + method + ' does not exist on jQuery.valideater');
		}


		function validate() {
			// for each valideater
			$('[data-valideater]', $thisForm).each(function() {

				// grab the jquery object
				var $input = $(this);

				// grab the valideater attributes, we call them validorz!!
				var validorz = $input.attr('data-valideater');

				// split the list of validorz into a useful array
				var validorzArray = validorz.split(',');

				for (var i = 0; i < validorzArray.length; i++) {
					var validor = validorzArray[i];
					// if it exists as a checker
					if (methods[validor]) {
						// VALIDEAT IT
						methods[validor]($input);
					}
				}
			}); // for each valideater
			methods.processErrors();
		}
	};


})(window.jQuery || window.Zepto);

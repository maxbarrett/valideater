(function($) {
	"use strict";
	
	$.fn.vldtr = function(options) {

		var thisForm = this;
		// Default, overridable error messages
		var defaults = {
				'errorMessages': {
					'alpha':		'Value must be letters.',
					'alphanumeric': 'Letters and numbers required.',
					'characters4':	'At least 4 characters please.',
					'dob':			'Please give a valid date of birth.',
					'email':		'Invalid email.',
					'matches':		'These values do not match.',
					'numeric':		'Value must be numeric.',
					'postcode':		'Invalid postcode.',
					'radio':		'Please choose an option.',
					'required':		'This information is required.'
				},
				'livecheck':	true,
				'maxAge':		100,
				'ageover':		null,
				'alerts':		true
		};

		var settings = $.extend({}, defaults, options);
		thisForm.attr('novalidate', '');

		var methods = {

			hasErrors: false,
			invalidElements: {}, // filled dynamically by addError():

			init: function() {
				return thisForm.on('submit', function() {
					// Reset errors
					methods.hasErrors = false;
					// Run the checks
					methods.validate();

					if (methods.hasErrors === false) {
						// Submit the form
						return true;
					} else if (settings.livecheck === true) {
						methods.livecheck();
						return false;
					} else {
						return false;
					}
				});
			},

			livecheck: function(){
				// 'change' is better for wrapped inputs & radio/checkboxes
				$('[data-vldtr]', thisForm).on('change keyup', function() {
					// Validating ALL inputs on one keystroke?
					methods.validate();
				});

				// focus on the first error field
				var firstError = $('.error:first'),
					formInputs = 'input, select, textarea, button';

				if ( firstError.is(formInputs) ) {
					firstError.focus();
				} else {
					firstError.find(formInputs).focus();
				}
			},

			//////////////////////////// START OF VALIDATIONS /////////////////////////////////////
			// IF RETURN IS TRUE THEN THERE'S AN ERROR
			alpha: function(el) {
				return (/^[a-zA-Z]+$/.test(el.val()) === false || el.val() === '');
			},

			alphanumeric: function(el) {
				var reg = /^[a-zA-Z\d]+$/;
				return (reg.test(el.val()) === false);
			},

			characters4: function(el) {
				var fieldValue = el.val();
				return (fieldValue.length < 4 && fieldValue !== '');
			},

			dob: function(el) {
				var today = (new Date()).getFullYear(),
					regs = methods.formatDate(el.val());

				// Check date formats: el.val(), day: regs[1], month: regs[2] & year: regs[3] (must be between minYear and maxYear)
				if	((!regs) ||
					(regs[1] < 1 || regs[1] > 31) ||
					(regs[2] < 1 || regs[2] > 12) ||
					(regs[3] > today)) {
						return true;
				}

				var ageOver = el.data().vldtrAgeover || settings.ageover;

				if (ageOver && !isNaN(ageOver)) {
					if (methods.formatAge(el) < ageOver) {
						settings.errorMessages.dob = 'You must be over ' + ageOver;
						return true;
					}
				}

				return false;
			},

			email: function(el) {
				var reg = /^([A-Za-z0-9_\'\-\.\+])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
				return (reg.test(el.val()) === false);
			},

			// The matches input should come after the one with the id
			// The matches input shouldn't need any other validation (the matcher should have those)
			matches: function(el) {
				var matchesId = el.attr('data-vldtr-matches'),
					matchesValue = $('#' + matchesId).val();

				return (el.val() !== matchesValue);
			},

			numeric: function(el) {
				return isNaN(el.val());
			},

			postcode: function(el) {
				var fieldValue = el.val(),
					reg = /(((([A-PR-UWYZ][0-9][0-9A-HJKS-UW]?)|([A-PR-UWYZ][A-HK-Y][0-9][0-9ABEHMNPRV-Y]?))\s{0,2}[0-9]([ABD-HJLNP-UW-Z]{2}))|(GIR\s{0,2}0AA))/i,
					// must be a better way of doing this?
					containsspace = fieldValue.indexOf(' ') >= 0,
					length = 0;

				if (containsspace) {
					length = 8;
				} else {
					length = 7;
				}
				
				return (reg.test(fieldValue) === false || fieldValue.length > length);
			},

			radio: function(el) {
				// radios are wrapped in a div, so find the kids
				var checked = function(){ return this.checked; },
					radios = $('input[type=radio]', el);

				return radios.filter(checked).length ? false : true;
			},

			required: function(el) {
				return ((el.val() === '') || (el.val() === $(el).attr('placeholder')));
			},

			//////////////////////////// END OF VALIDATIONS /////////////////////////////////////

			formatDate: function(date){
				var re = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
					regs = date.match(re);
				return regs;
			},

			formatAge: function(el){
				var regs = methods.formatDate(el.val()),
					birthday = new Date(regs[3] + '-' + regs[2] + '-' + regs[1]),
					ageDifMs = Date.now() - birthday.getTime(),
					ageDate = new Date(ageDifMs), // miliseconds from epoch
					age = Math.abs(ageDate.getFullYear() - 1970);

				return age;
			},

			addError: function(el, validor){
				// create el obj prop with array of errors
				methods.invalidElements[el.ref] = methods.invalidElements[el.ref] || [];

				// check validor is not already in the array
				if ($.inArray(validor, methods.invalidElements[el.ref]) === -1) {
					methods.invalidElements[el.ref].push(validor);
					methods.showAlert(el, validor);
				}
			},

			showAlert: function(el, validor){
				el.addClass('js-vldtr-error');

				if (!el.attr('data-vldtr-alert')) {
					var customMsg = el.attr('data-vldtr-err-' + validor),
						msg = (customMsg) ? customMsg : settings.errorMessages[validor];

					el.after('<span class="js-vldtr-alert js-vldtr-alert-' + validor + ' js-vldtr-' + el.ref + '">' + msg + '</span>');
				}
			},

			removeError: function(el, validor){
				// remove element from error array
				methods.invalidElements[el.ref] = $.grep(methods.invalidElements[el.ref], function(prop) {
					return prop !== validor;
				});

				$('.js-vldtr-alert-' + validor + '.js-vldtr-' + el.ref).remove();

				if (methods.invalidElements[el.ref].length === 0){
					el.removeClass('js-vldtr-error');
				}
			},

			validate: function(){
				// for each element that needs valideating
				$('[data-vldtr]', thisForm).each(function(num) {
					var el = $(this),
						validorz = el.attr('data-vldtr').split(',');

					// Give each element a unique ref
					el.ref = el[0].type + num;

					for (var i = 0; i < validorz.length; i++) {
						if (methods[validorz[i]]) {
							if (methods[validorz[i]](el) === true){
								methods.addError(el, validorz[i]);
							} else if ($.inArray(validorz[i], methods.invalidElements[el.ref]) !== -1){
								methods.removeError(el, validorz[i]);
							}
						}
					}
				});

				var containsErrors = [];
				for ( var foo in methods.invalidElements) {
					for (var j = 0; j < methods.invalidElements[foo].length; j++ ) {
						containsErrors.push(methods.invalidElements[foo][j]);
					}
				}

				if (containsErrors.length) { methods.hasErrors = true; }
			}
		};
		return methods.init.apply(this);
	};

})(window.jQuery || window.Zepto);

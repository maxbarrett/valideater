(function($) {
	"use strict";
	
	$.fn.vldtr = function(options) {
		var thisForm = this,
			defaults = {
				'alpha':		'Value must be letters.',
				'alphanumeric': 'Letters and numbers required.',
				'characters4':	'At least 4 characters please.',
				'dob':			'Please give a valid date of birth.',
				'email':		'Invalid email.',
				'matches':		'These values do not match.',
				'numeric':		'Value must be numeric.',
				'postcode':		'Invalid postcode.',
				'radio':		'Please choose an option.',
				'required':		'This information is required.',

				'livecheck':		true,
				'maxage':			122,
				'minage':			18,
				'alerts':			true,
				'errorCssClass':	'js-vldtr-error',
				'alertCssClass':	'js-vldtr-alert'
		},
			settings = $.extend({}, defaults, options);

		thisForm.attr('novalidate', '');

		var methods = {

			hasErrors: false,
			invalidElements: {}, // filled dynamically by addError():

			init: function() {
				return thisForm.on('submit', function() {
					methods.hasErrors = false; // Reset errors
					methods.assignRef(); // Assign a unique reference to each input
					methods.validate(); // Run the checks

					if (methods.hasErrors === false) {
						return true; // Submit the form
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
					methods.validate($(this));
				});

				// focus on the first error field
				var firstError = $('.' + settings.errorCssClass + ':first'),
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
				// var reg = /^[a-zA-Z\d]+$/; // letters or numbers
				var reg = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/; // a letter and a number
				return (reg.test(el.val()) === false);
			},

			characters4: function(el) {
				var fieldValue = el.val();
				return (fieldValue.length < 4 && fieldValue !== '');
			},

			dob: function(el) {
				var today = (new Date()).getFullYear(),
					regs = methods.formatDate(el.val()),
					minage = el.data().vldtrMinage || settings.minage,
					maxage = el.data().vldtrMaxage || settings.maxage;

				// Check date formats: el.val(), day: regs[1], month: regs[2] & year: regs[3] (must be between minYear and maxYear)
				if	((!regs) ||
					(regs[1] < 1 || regs[1] > 31) ||
					(regs[2] < 1 || regs[2] > 12) ||
					(regs[3] > today)) {
						return true;
				}

				var age = methods.formatAge(el);

				if (age > maxage) {
					settings.dob = 'You cannot be older than ' + maxage + ' years old.';
					return true;
				} else if (age < minage) {
					settings.dob = 'You must be older than ' + minage + ' years old.';
					return true;
				}

				return false;
			},

			email: function(el) {
				var reg = /^([A-Za-z0-9_\'\-\.\+])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
				return (reg.test(el.val()) === false);
			},

			matches: function(el) {
				var matchesId = el.attr('data-vldtr-matches'),
					matchesValue = $('#' + matchesId).val();
				return (el.val() !== matchesValue);
			},

			numeric: function(el) {
				return isNaN(window.parseInt(el.val()));
			},

			postcode: function(el) {
				var strippedVal = el.val().replace(/\s+/g, ''),
					reg = /(((([A-PR-UWYZ][0-9][0-9A-HJKS-UW]?)|([A-PR-UWYZ][A-HK-Y][0-9][0-9ABEHMNPRV-Y]?))\s{0,2}[0-9]([ABD-HJLNP-UW-Z]{2}))|(GIR\s{0,2}0AA))/i;
				return (reg.test(strippedVal) === false);
			},

			radio: function(el) {
				var radios = $('input[type=radio]', el); // radios are wrapped in a container
				return radios.filter(function(){ return this.checked; }).length ? false : true;
			},

			required: function(el) {
				return ((el.val() === '') || (el.val() === $(el).attr('placeholder')));
			},

			//////////////////////////// END OF VALIDATIONS /////////////////////////////////////

			formatDate: function(date){
				var re = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
				return date.match(re); // Array of regex matches eg: ["03", "07", "1984"]
			},

			formatAge: function(el){
				var regs = methods.formatDate(el.val()),
					birthday = new Date(regs[3] + '-' + regs[2] + '-' + regs[1]),
					ageDifMs = Date.now() - birthday.getTime(),
					ageDate = new Date(ageDifMs); // miliseconds from epoch
				return Math.abs(ageDate.getFullYear() - 1970); // age in years
			},

			assignRef: function(){
				$('[data-vldtr]', thisForm).each(function(num) {
					this.ref = this.type + num;
				});
			},

			addError: function(el, validator){
				var reference = el[0].ref;
				// create an obj prop with array of errors
				methods.invalidElements[reference] = methods.invalidElements[reference] || [];

				// check validator is not already in the array
				if ($.inArray(validator, methods.invalidElements[reference]) === -1) {
					methods.invalidElements[reference].push(validator);
					methods.showAlert(el, validator);
				}
			},

			showAlert: function(el, validator){
				el.addClass(settings.errorCssClass);

				if (!el.attr('data-vldtr-alert')) {
					var customMsg = el.attr('data-vldtr-err-' + validator),
						msg = (customMsg) ? customMsg : settings[validator],
						alert = $('<span>' + msg + '</span>');

					alert.addClass(settings.alertCssClass)
						.addClass(settings.alertCssClass + '-' + validator)
						.addClass('js-vldtr-' + el[0].ref);

					el.after(alert);
				}
			},

			removeError: function(el, validator){
				var reference = el[0].ref;

				// remove the element from error array
				methods.invalidElements[reference] = $.grep(methods.invalidElements[reference], function(prop) {
					return prop !== validator;
				});

				$('.' + settings.alertCssClass + '-' + validator + '.js-vldtr-' + reference).remove();

				if (methods.invalidElements[reference].length === 0){
					el.removeClass(settings.errorCssClass);
				}
			},

			runChecks: function(el){
				var validations = el.attr('data-vldtr').split(','),
					validator;

				for (var i = 0; i < validations.length; i++) {
					validator = validations[i];

					if (methods[validator]) {
						if (methods[validator](el) === true){
							methods.addError(el, validator);
						} else if ($.inArray(validator, methods.invalidElements[el[0].ref]) !== -1){
							methods.removeError(el, validator);
						}
					}
				}
			},

			validate: function(el){
				if (!el) { // if we're not doing a livecheck...
					$('[data-vldtr]', thisForm).each(function(){
						methods.runChecks($(this));
					});
				} else {
					methods.runChecks(el);
				}

				var containsErrors = [], failedElems;
				for (failedElems in methods.invalidElements) {
					for (var i = 0; i < methods.invalidElements[failedElems].length; i++ ) {
						containsErrors.push(methods.invalidElements[failedElems][i]);
					}
				}

				if (containsErrors.length) { methods.hasErrors = true; }
			}
		};
		return methods.init.apply(this);
	};

})(window.jQuery || window.Zepto);

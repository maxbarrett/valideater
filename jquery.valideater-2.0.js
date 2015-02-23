(function($) {

	$.fn.valideater = function(options) {

		var thisForm = this;
		thisForm.attr('novalidate', '');

		// Default, overridable error messages
		var defaults = {
				'alpha':		'Value must be letters',
				'alphanumeric': 'Letters and numbers required',
				'dob':			'Please give a valid date of birth',
				'over18':		'You must be 18 or over',
				'email':		'Invalid email',
				'matches':		'These values do not match',
				'numeric':		'Value must be numeric',
				'min4':			'At least 4 characters please',
				'postcode':		'Invalid postcode',
				'radio':		'Please choose an option',
				'required':		'This information is required',
				'liveCheck':	true
		};

		var settings = $.extend({}, defaults, options);

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
					} else if (settings.liveCheck === true) {
						methods.liveCheck();
						return false;
					} else {
						return false;
					}
				});
			},

			liveCheck: function(){
				// 'change' is better for wrapped inputs & radio/checkboxes
				$('[data-valideater]', thisForm).on('change keyup', function() {
					methods.validate();
				});

				// focus on the first error field
				var firstError = $('.error:first');

				if ( firstError.is('input, select, textarea, button') ) {
					firstError.focus();
				} else {
					firstError.find('input, select, textarea, button').focus();
				}
			},

			//////////////////////////// START OF VALIDATIONS /////////////////////////////////////

			// IF RETURN IS TRUE THEN THERE'S AN ERROR
			required: function(el) {
				var placeholder = $(el).attr('placeholder');
				return (el.val() === '' || el.val() === placeholder);
			},

			radio: function(el) {
				// radios are wrapped in a div, so find the kids
				var checked = function(){ return this.checked; },
					radios = $('input[type=radio]', el);

				return radios.filter(checked).length ? false : true;
			},

			dob: function(el) {
				var dobs = el.children('input, select'),
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
							if (today.getMonth() - birthDate.getMonth() < 0 || (today.getMonth() - birthDate.getMonth() === 0 && today.getDate() < birthDate.getDate())) {
								age--;
							}
							if (age > 100 || $(dobs[1]).val() - 1 > 12 || $(dobs[0]).val() > 31) {
								dobError = true;
							}
						}
					}
				}

				return dobError;
			},

			over18: function(el) {
				var dobs = el.children('input, select'),
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

				return ageError;
			},

			alpha: function(el) {
				var fieldValue = el.val(),
					reg = /^[a-zA-Z]+$/;

				return reg.test(fieldValue) === false && fieldValue !== '';
			},

			numeric: function(el) {
				return isNaN(el.val());
			},

			alphanumeric: function(el) {
				var reg = /^[a-zA-Z\d]+$/;
				return (reg.test(el.val()) === false);
			},

			email: function(el) {
				var reg = /^([A-Za-z0-9_\'\-\.\+])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
				return (reg.test(el.val()) === false);
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

			min4: function(el) {
				var fieldValue = el.val();

				return (fieldValue.length < 4 && fieldValue !== '');
			},

			// The matches input should come after the one with the id
			// The matches input shouldn't need any other validation (the matcher should have those)
			matches: function(el) {
				var matchesId = el.attr('data-valideater-matches'),
					matchesValue = $('#' + matchesId).val();

				return (el.val() !== matchesValue);
			},

			//////////////////////////// END OF VALIDATIONS /////////////////////////////////////

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
				el.addClass('js-error');

				if (el.attr('data-alert') !== false) {
					var customMsg = el.attr('data-error-msg-' + validor),
						msg = (customMsg) ? customMsg : settings[validor];

					el.after('<span class="js-alert js-alert-' + validor + ' js-' + el.ref + '">' + msg + '</span>');
				}
			},

			removeError: function(el, validor){
				// remove element from error array
				methods.invalidElements[el.ref] = $.grep(methods.invalidElements[el.ref], function(prop) {
					return prop !== validor;
				});

				$('.js-alert-' + validor + '.js-' + el.ref).remove();

				if (methods.invalidElements[el.ref].length === 0){
					el.removeClass('js-error');
				}
			},

			validate: function(){
				// for each element that needs valideating
				$('[data-valideater]', thisForm).each(function(num) {
					var el = $(this),
						validorz = el.attr('data-valideater').split(',');

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

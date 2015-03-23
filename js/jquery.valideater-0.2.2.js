/*
 __      __   _ _     _            _            
 \ \    / /  | (_)   | |          | |           
  \ \  / /_ _| |_  __| | ___  __ _| |_ ___ _ __ 
   \ \/ / _` | | |/ _` |/ _ \/ _` | __/ _ \ '__|
    \  / (_| | | | (_| |  __/ (_| | ||  __/ |   
     \/ \__,_|_|_|\__,_|\___|\__,_|\__\___|_|   
 Version: 0.2.2
  Author: Max Barrett
    Docs: http://maxbarrett.github.io/valideater/
    Repo: http://github.com/maxbarrett/valideater
  Issues: https://github.com/maxbarrett/valideater/issues
 */

;(function ( $, window, document, undefined ) {
	"use strict";
	var pluginName = "valideater",
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
	};

	// Plugin constructor
	function Plugin ( element, options ) {
		this.element = element;
		// merge defaults & options into empty object
		this.settings = $.extend( {}, defaults, options );
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	// Avoid Plugin.prototype conflicts
	$.extend(Plugin.prototype, {
		init: function () {
			var self = this;

			// Create an empty object for elements that don't validate
			this.element.invalidElements = {};

			self.assignRef(); // Assign a unique reference to each input element

			return $(this.element).on('submit', function() {
				self.hasErrors = false; // Reset errors
				self.validate(); // Run the checks

				if (self.hasErrors === false) {
					return true; // Submit the form
				} else if (self.settings.livecheck === true) {
					self.livecheck();
					return false;
				} else {
					return false;
				}
			});
		},

		livecheck: function(){
			var self = this;

			// 'change' is better for wrapped inputs & radio/checkboxes
			$('[data-vldtr]', this.element).on('change keyup', function() {
				self.validate($(this));
			});

			// focus on the first error field
			var firstError = $('.' + this.settings.errorCssClass + ':first', this.element),
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
				regs = this.formatDate(el.val()),
				minage = el.data().vldtrMinage || this.settings.minage,
				maxage = el.data().vldtrMaxage || this.settings.maxage;

			// Check date formats: el.val(), day: regs[1], month: regs[2] & year: regs[3] (must be between minYear and maxYear)
			if	((!regs) ||
				(regs[1] < 1 || regs[1] > 31) ||
				(regs[2] < 1 || regs[2] > 12) ||
				(regs[3] > today)) {
					return true;
			}

			var age = this.formatAge(el);

			if (age > maxage) {
				this.settings.dob = 'You cannot be older than ' + maxage + ' years old.';
				return true;
			} else if (age < minage) {
				this.settings.dob = 'You must be older than ' + minage + ' years old.';
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
			var regs = this.formatDate(el.val()),
				birthday = new Date(regs[3] + '-' + regs[2] + '-' + regs[1]),
				ageDifMs = Date.now() - birthday.getTime(),
				ageDate = new Date(ageDifMs); // miliseconds from epoch
			return Math.abs(ageDate.getFullYear() - 1970); // age in years
		},

		assignRef: function(){
			var timestamp = new Date().getTime();
			$('[data-vldtr]', this.element).each(function(n) {
				this.ref = this.type + n;
			});
		},

		addError: function(el, validator){
			var reference = el[0].ref;
			var errs = this.element.invalidElements;

			// create an obj prop with array of errors
			errs[reference] = errs[reference] || [];

			// check validator is not already in the array
			if ($.inArray(validator, errs[reference]) === -1) {
				errs[reference].push(validator);
				this.showAlert(el, validator);
			}
		},

		showAlert: function(el, validator){
			var self = this;
			el.addClass(self.settings.errorCssClass);

			if (!el.attr('data-vldtr-alert')) {
				var customMsg = el.attr('data-vldtr-err-' + validator),
					msg = (customMsg) ? customMsg : self.settings[validator],
					alert = $('<span>' + msg + '</span>');

				alert.addClass(self.settings.alertCssClass)
					.addClass(self.settings.alertCssClass + '-' + validator)
					.addClass('js-vldtr-' + el[0].ref);

				el.after(alert);
			}
		},

		removeError: function(el, validator){
			var reference = el[0].ref;

			// remove the element from error array
			this.element.invalidElements[reference] = $.grep(this.element.invalidElements[reference], function(prop) {
				return prop !== validator;
			});

			$('.' + this.settings.alertCssClass + '-' + validator + '.js-vldtr-' + reference, this.element).remove();

			if (this.element.invalidElements[reference].length === 0){
				el.removeClass(this.settings.errorCssClass);
			}
		},

		runChecks: function(el){
			var validations = el.attr('data-vldtr').split(','),
				validator;

			for (var i = 0; i < validations.length; i++) {
				validator = validations[i];

				if (this[validator]) {
					if (this[validator](el) === true){
						this.addError(el, validator);
					} else if ($.inArray(validator, this.element.invalidElements[el[0].ref]) !== -1){
						this.removeError(el, validator);
					}
				}
			}
		},

		validate: function(el){
			var self = this,
				errs = this.element.invalidElements;

			if (!el) { // if we're not doing a livecheck...
				$('[data-vldtr]', self.element).each(function(){
					self.runChecks($(this));
				});
			} else {
				self.runChecks(el);
			}

			var containsErrors = [], 
				failedElems;

			for (failedElems in errs) {
				for (var i = 0; i < errs[failedElems].length; i++ ) {
					containsErrors.push(errs[failedElems][i]);
				}
			}

			if (containsErrors.length) { self.hasErrors = true; }
		}

	});

	// plugin wrapper around the constructor, preventing against multiple instantiations
	$.fn[ pluginName ] = function ( options ) {
		return this.each(function() {
			if ( !$.data( this, "plugin_" + pluginName ) ) {
				$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
			}
		});
	};

})( window.jQuery || window.Zepto, window, document );

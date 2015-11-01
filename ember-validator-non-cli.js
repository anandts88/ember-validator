/**
  @overview  ember-validator - Perform Ember Object Validation
  @license   Licensed under MIT license
  @version   1.0.8

  Used for Non CLI type of ember applications
*/

(function() {
  Ember.Validator = Ember.Namespace.create();

  var Errors = Ember.Object.extend({
    errors: null,
    error: Ember.computed.alias('errors.firstObject'),
    isValid: Ember.computed.empty('errors.[]'),
    isInvalid: Ember.computed.not('isValid'),
    hasError: Ember.computed.notEmpty('error')
  });

  Ember.Validator.Errors = Errors;

  var Messages = {
    render: function(attribute, options) {
      var msg;

      for(var option in options) {
        msg = this.defaults[attribute].replace('{{' + option + '}}', options[option]);
      }

      return msg;
    },
    defaults: {
      include: "is not included in the list",
      exclude: "is reserved",
      required: "can't be blank",
      notrequired: "must be blank",
      maximum: "is too long (maximum is {{count}} characters)",
      minimum: "is too short (minimum is {{count}} characters)",
      is: "is the wrong length (should be {{count}} characters)",
      invalid: "is invalid",
      equals: "must be accepted",
      empty: "can't be empty",
      numeric: "is not a number",
      integer: "must be an integer",
      greaterThan: "must be greater than {{count}}",
      greaterThanOrEqualTo: "must be greater than or equal to {{count}}",
      equalTo: "must be equal to {{count}}",
      lessThan: "must be less than {{count}}",
      lessThanOrEqualTo: "must be less than or equal to {{count}}",
      odd: "must be odd",
      even: "must be even"
    }
  };

  Ember.Validator.Messages = Messages;

  Ember.Validator.validators = Ember.Namespace.create();

  var Validator = Ember.Object.extend({
    errors: null,
    options: null,
    property: null,
    model: null,

    'if': Ember.computed.alias('options.if'),
    unless: Ember.computed.alias('options.unless'),
    isValid: Ember.computed.empty('errors.[]'),
    isInvalid: Ember.computed.not('isValid'),

    init: function() {
      this.set('errors', Ember.A());
    },

    perform: function () {
      throw 'Please override perform method in you validator.';
    },

    renderMessageFor: function(key, options) {
      return this.options.messages[key] || Messages.render(key, options);
    },

    validate: function() {
      var result = this._validate();
      return this.get('errors');
    },

    _validate: function() {
      this.errors.clear();
      if (this._isValidate()) {
        this.perform();
      }

      return this.get('isValid');
    },

    _check: function(validate) {
      if (typeof(validate) === 'function') {
        return validate(this.model, this.property);
      } else if (typeof(validate) === 'string') {
        if (typeof(this.model[validate]) === 'function') {
          return this.model[validate]();
        } else {
          return this.model.get(validate);
        }
      }
    },

    _isValidate: function() {
      var ifValidate = (this.get('if') ? this._check(this.get('if')) : true);
      var unlessValidate = (this.get('unless') ? !this._check(this.get('unless')) : true);
      return ifValidate && unlessValidate;
    },

    compare: function (a, b, operator) {
      switch (operator) {
        case '==':
          return a == b; // jshint ignore:line
        case '===':
          return a === b;
        case '>=':
          return a >= b;
        case '<=':
          return a <= b;
        case '>':
          return a > b;
        case '<':
          return a < b;
        default:
          return false;
      }
    }
  });

  Ember.Validator.validators.Validator = Validator;

  Ember.Validator.validators.Contains = Validator.extend({
    init: function() {
      this._super();
      if (typeof(this.options) !== 'object') {
        this.set('options', {});
      }

      if (!this.options.messages) {
        this.set('options.messages', {});
      }
    },

    perform: function() {
      var value = this.model.get(this.property);
      var first;
      var last;

      if (!Ember.isEmpty(value)) {
        if (this.options.exclude && this.options.exclude.indexOf(value) !== -1) {
          this.errors.pushObject(this.options.messages.exclude);
        } else if (this.options.include && this.options.include.indexOf(value) === -1) {
          this.errors.pushObject(this.options.messages.include);
        } else if (this.options.exludeRange) {
          first = this.options.exludeRange[0];
          last = this.options.exludeRange[1];
          if (value >= first && value <= last) {
            this.errors.pushObject(this.options.messages.exludeRange);
          }
        } else if (this.options.includeRange) {
          first = this.options.includeRange[0];
          last = this.options.includeRange[1];
          if (value < first && value > last) {
            this.errors.pushObject(this.options.messages.includeRange);
          }
        }
      }
    }
  });

  Ember.Validator.validators.Date = Validator.extend({
    init: function() {
      this._super();
      if (typeof(this.options) !== 'object') {
        this.set('options', {});
      }

      if (!this.options.messages) {
        this.set('options.messages', {});
      }
    },

    DAYS: {
      sunday: 0,
      saturday: 6
    },

    CHECKS: {
      same: '===',
      before: '<', // before
      after: '>', // after
      beforeSame: '<=', // before or same
      afterSame: '>=' // after or same
    },

    compare: function(source, target, operator) {
      switch (operator) {
        case '===':
          return source.isSame(target);
        case '>=':
          return source.isAfter(target) || source.isSame(target);
        case '<=':
          return source.isBefore(target) || source.isSame(target);
        case '>':
          return source.isAfter(target);
        case '<':
          return source.isBefore(target);
        default:
          return false;
      }
    },

    perform: function() {
      var value = this.model.get(this.property);
      var option;
      var target;
      var comparisonType;

      var transform = function(value, format) {
        var date;
        if (typeof(value) === 'string' && format) {
          date = moment(value, format, true);
        } else {
          date = moment(value);
        }
        return date;
      };

      var setTime = function(date, hours, minutes, seconds, milliseconds) {
        date.hours(hours);
        date.minutes(minutes);
        date.seconds(seconds);
        date.milliseconds(milliseconds);
        return date;
      };

      if (!Ember.isEmpty(value)) {
        value = transform(value, this.options.format);

        if (!this.options.time) {
          value = setTime(value, 0, 0, 0, 0);
        }

        if (!value.isValid()) {
          this.errors.pushObject(this.options.messages.date);
        } else if (this.options.weekend && [this.DAYS.sunday, this.DAYS.saturday].indexOf(value.day()) !== -1) {
          this.errors.pushObject(this.options.messages.weekend);
        } else if (this.options.onlyWeekend && [this.DAYS.sunday, this.DAYS.saturday].indexOf(value.day()) === -1) {
          this.errors.pushObject(this.options.messages.onlyWeekend);
        } else {
          for (var key in this.CHECKS) {
            option = this.options[key];
            if (!option) {
              continue;
            }

            target = transform(option.target, option.format);

            if (!this.options.time) {
              target = setTime(target, 0, 0, 0, 0);
            }

            if (!target.isValid()) {
              continue;
            }

            if (!this.compare(value, target, this.CHECKS[key])) {
              this.errors.pushObject(this.renderMessageFor(key, { date: target.format(option.format) }));
            }
          }
        }
      }
    }
  });

  Ember.Validator.validators.Equals = Validator.extend({
    init: function() {
      this._super();

      if (typeof(this.options) !== 'object') {
        this.set('options', {});
      }

      if (!this.options.message) {
        this.set('options.message', Messages.render('equals', this.options));
      }
    },

    perform: function() {
      var value = this.model.get(this.property);

      if (!Ember.isEmpty(value)) {
        if (this.options.accept && value !== this.options.accept) {
          this.errors.pushObject(this.options.message);
        }
      }
    }
  });

  Ember.Validator.validators.Length = Validator.extend({
    init: function() {
      this._super();
      if (typeof(this.options) === 'number') {
        this.set('options', { 'is': this.options });
      }

      if (!this.options.messages) {
        this.set( 'options.messages', {});
      }

      this.options.tokenizer = this.options.tokenizer || function(value) {
        return value.toString().split('');
      };
    },

    CHECKS: {
      'is': '===',
      'minimum': '>=',
      'maximum': '<='
    },

    getValue: function(key) {
      if (this.options[key].constructor === String) {
        return this.model.get(this.options[key]) || 0;
      } else {
        return this.options[key];
      }
    },

    perform: function() {
      var value = this.model.get(this.property);
      var key, comparisonResult;
      var propertyLength;
      var comparisonLength;
      var comparisonType;

      if (!Ember.isEmpty(value)) {
        for (var key in this.CHECKS) {
          if (!this.options[key]) {
            continue;
          }

          propertyLength = this.options.tokenizer(value).length; // Split value based on tokenizer, by default no of characters is counted as length
          comparisonLength = this.getValue(key); // Return comparison value from model or options
          comparisonType = this.CHECKS[key];

          if (!this.compare(propertyLength, comparisonLength, comparisonType)) {
            this.errors.pushObject(this.renderMessageFor(key, { count: comparisonValue }));
          }
        }
      }
    }
  });

  Ember.Validator.validators.Notrequired = Validator.extend({
    init: function() {
      this._super();
      if (typeof(this.options) !== 'object') {
        this.set('options', {});
      }

      if (!this.options.message) {
        this.set('options.message', Messages.render('notrequired', this.options));
      }
    },

    perform: function() {
      var value = this.model.get(this.property);
      if (!Ember.isEmpty(value)) {
        this.errors.pushObject(this.options.message);
      }
    }
  });

  Ember.Validator.validators.Numeric = Validator.extend({
    init: function() {
      this._super();
      if (typeof(this.options) !== 'object') {
        this.set('options', {});
      }

      if (!this.options.messages) {
        this.set('options.messages', {});
      }
    },

    CHECKS: {
      equalTo: '===',
      greaterThan: '>',
      greaterThanOrEqualTo: '>=',
      lessThan: '<',
      lessThanOrEqualTo: '<='
    },

    getValue: function(key) {
      if (this.options[key].constructor === String) {
        return this.model.get(this.options[key]) || 0;
      } else {
        return this.options[key];
      }
    },

    perform: function() {
      var value = this.model.get(this.property);
      var comparisonValue;
      var comparisonType;

      var isNumeric = function(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
      };

      var isInteger = function(value) {
        var val = parseFloat(value);
        return toType(val)==='number' && val % 1 === 0;
      };

      if (!Ember.isEmpty(value)) {
        if (!isNumeric(value)) {
          this.errors.pushObject(this.options.messages.numeric);
        } else if (this.options.integer && !isInteger(value)) {
          this.errors.pushObject(this.options.messages.integer);
        } else if (this.options.odd && parseInt(value, 10) % 2 === 0) {
          this.errors.pushObject(this.options.messages.odd);
        } else if (this.options.even && parseInt(value, 10) % 2 !== 0) {
          this.errors.pushObject(this.options.messages.even);
        } else {
          value = parseFloat(value);
          for (var key in this.CHECKS) {
            if (!this.options[key]) {
              continue;
            }

            comparisonValue = this.getValue(key);
            comparisonType = this.CHECKS[key];

            if (!this.compare(value, comparisonValue, comparisonType)) {
              this.errors.pushObject(this.renderMessageFor(key, { count: comparisonValue }));
            }
          }
        }
      }
    }
  });

  var Pattern = Validator.extend({
    init: function() {
      this._super();
      if (typeof(this.options) !== 'object') {
        this.set('options', {});
      }

      if (this.options.constructor === RegExp) {
        this.set('options', { 'with': this.options });
      }

      if (!this.options.messages) {
        this.set('options.messages', {});
      }
    },

    perform: function() {
      var value = this.model.get(this.property);
      var array;
      var arr;

      if (!Ember.isEmpty(value)) {
        if (this.options.with && !this.options.with.test(value)) {
          this.errors.pushObject(this.options.messages.with);
        } else if (this.options.without && this.options.without.test(value)) {
          this.errors.pushObject(this.options.messages.without);
        } else if (!Ember.isEmpty(this.options.array)) {
          array = this.options.array;
          for (var count = 0 ; count < array.length ; count++) {
            arr = array[count];
            if (arr.with && !arr.with.test(value)) {
              this.errors.pushObject(arr.message);
              break;
            } else if (arr.without && !arr.without.test(value)) {
              this.errors.pushObject(arr.message);
              break;
            }
          }
        }
      }
    }
  });

  Ember.Validator.validators.Pattern = Pattern;

  Ember.Validator.validators.Email = Pattern.extend({
    init: function() {
      this._super();
      if (typeof(this.options) !== 'object') {
        this.set('options', {});
      }

      if (this.options.constructor === RegExp) {
        this.set('options', { 'with': this.options });
      }

      if (!this.options.messages) {
        this.set('options.messages', {});
      }
    },

    perform: function() {
      var value = this.model.get(this.property);
      var array;
      var arr;

      if (!Ember.isEmpty(value)) {
        if (this.options.with && !this.options.with.test(value)) {
          this.errors.pushObject(this.options.messages.with);
        } else if (this.options.without && this.options.without.test(value)) {
          this.errors.pushObject(this.options.messages.without);
        } else if (!Ember.isEmpty(this.options.array)) {
          array = this.options.array;
          for (var count = 0 ; count < array.length ; count++) {
            arr = array[count];
            if (arr.with && !arr.with.test(value)) {
              this.errors.pushObject(arr.message);
              break;
            } else if (arr.without && !arr.without.test(value)) {
              this.errors.pushObject(arr.message);
              break;
            }
          }
        }
      }
    }
  });

  Ember.Validator.validators.Required = Validator.extend({
    init: function() {
      this._super();
      if (typeof(this.options) !== 'object') {
        this.set('options', {});
      }

      if (!this.options.message) {
        this.set('options.message', Messages.render('required', this.options));
      }
    },

    perform: function() {
      var value = this.model.get(this.property);
      if (Ember.isBlank(value)) {
        this.errors.pushObject(this.options.message);
      }
    }
  });

  Ember.Validations.Mixin = Ember.Mixin.create({
    validate: function(props) {
      var rules = this.get('validations') || validations;

      return this.validateMap({
        object: this,
        validations: rules,
        noPromise: props.noPromise
      });
    },

    validateMap: function(props) {
      var object = props.model;
      var validations = props.validations;
      var noPromise = props.noPromise;

      var result = Errors.create();
      var allErrors = Ember.A();
      var rules;
      var rule;
      var property;
      var errors;

      if (object && validations) {
        var validators = this.constructValidators(object, validations);
        if (!Ember.isEmpty(validators)) {
          validators.forEach(function(obj) {
            rules = obj.rules;
            property = obj.property;

            for (var count = 0; count < obj.rules.length; count++) {
              rule = obj.rules[count];
              errors = rule.validate();
              if (!Ember.isEmpty(errors)) {
                allErrors.pushObjects(errors);
                result.set(property, Errors.create({ errors: errors }));
                break;
              }
            }
          });
        }
      }

      result.set('errors', allErrors);

      if (noPromise) {
        return result;
      } else {
        if (result.get('isValid')) {
          return Ember.RSVP.resolve(true);
        } else {
          return Ember.RSVP.reject(result);
        }
      }
    },

    constructValidators: function(object, validations) {
      var validators = Ember.A();
      var rules;
      for (var property in validations) {
        rules = this.findValidators(validations[property]);
        rules.setEach('property', property);
        rules.setEach('model', object);

        validators.pushObject({
          property: property,
          rules: rules
        });
      }
      return validators;
    },

    createInlineValidator: function() {
      return Validator.extend({
        perform: function() {
          var errorMessage = this.callback.call(this, this.model, this.property);

          if (errorMessage) {
            this.errors.pushObject(errorMessage);
          }
        },
        callback: null
      });
    },

    findValidators: function(rules) {
      var validators = Ember.A();
      var validator;
      for (var validatorName in rules) {
        if (validatorName !== 'custom' ) {
          validator = this.lookupValidator(validatorName);
          validators.pushObject(validator.create({
            options: rules[validatorName]
          }));
        } else {
          validator = this.createInlineValidator();
          validators.pushObject(validator.create({
            callback: rules[validatorName].callback
          }));
        }
      }

      return validators;
    },

    lookupValidator: function(validatorName) {
      return Ember.Validator.validators[validatorName.classify()];
    }
  });

})();

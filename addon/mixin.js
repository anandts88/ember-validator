import Ember from 'ember';
import Errors from 'ember-validator/errors';
import Validator from 'ember-validator/validators/validator';
import Constants from 'ember-validator/constants';
import getOwner from 'ember-getowner-polyfill';

export default Ember.Mixin.create({
  validate: function(props) {
    var rules = this.get('validations') || props.validations;

    return this.validateMap({
      model: this,
      validations: rules,
      noPromise: props.noPromise
    });
  },

  computedValidateMap: function(props) {
    var object = props.model;
    var validations = props.validations;
    var self = this;
    var propDetails;
    var errorProperty;

    for (var key in object) {
      if (key.indexOf('ValidatorResult') !== -1 || key.indexOf('ValidatorPreviousVal') != -1) {
        object.set(key, null);
      }
    }

    for (var property in validations) {
      propDetails = validations[property];
      errorProperty = propDetails.errorProperty;

      if (this._isValidate(propDetails, object, property)) {
        object.set((errorProperty || property) + 'ValidatorPreviousVal', object.get(property));
        Ember.defineProperty(object, (errorProperty || property) + 'ValidatorResult', Ember.computed(property, function(sender) {
          var rules = {};
          var prop = sender.replace('ValidatorResult', '');
          var result;

          if (object.get(prop) !== object.get(prop + 'ValidatorPreviousVal')) {
            rules[prop] = validations[prop];

            result = self.validateMap({
              model: object,
              validations: rules,
              noPromise: true
            });
          }

          return result;
        }));
      }
    }
  },

  validateMap: function(props) {
    var self = this;
    var noPromise = props.noPromise;

    var doValidate = function(props) {
      var object = props.model;
      var validations = props.validations;
      var result = Errors.create();
      var allErrors = Ember.A();
      var rules;
      var rule;
      var property;
      var errorProperty;
      var errors;
      var validationResult;

      if (object && validations) {
        var validators = self.constructValidators(object, validations);
        if (!Ember.isEmpty(validators)) {
          validators.forEach(function(obj) {
            rules = obj.rules;
            property = obj.property;
            errorProperty = obj.errorProperty;

            for (var count = 0; count < obj.rules.length; count++) {
              rule = obj.rules[count];
              validationResult = rule.validate();
              errors = validationResult.get('errors');
              if (!Ember.isEmpty(errors)) {
                allErrors.pushObjects(errors);
                result.set(errorProperty || property, validationResult);
                break;
              }
            }
          });
        }
      }

      result.set('errors', allErrors);

      return result;
    };

    if (noPromise) {
      return doValidate(props);
    } else {
      return new Ember.RSVP.Promise(function(resolve, reject) {
        var result = doValidate(props);
        if (result.get('isValid')) {
          resolve(true);
        } else {
          reject(result);
        }
      });
    }
  },

  constructValidators: function(object, validations) {
    var validators = Ember.A();
    var propDetails;
    var rules;
    for (var property in validations) {
      propDetails = validations[property];

      if (this._isValidate(propDetails, object, property)) {
        rules = this.findValidators(validations[property]);
        rules.setEach('property', property);
        rules.setEach('model', object);

        validators.pushObject({
          property: property,
          rules: rules,
          errorProperty: propDetails.errorProperty
        });
      }
    }
    return validators;
  },

  _check: function(validate, model, property, positive) {
    var result = true;

    if (typeof(validate) === 'undefined') {
      result = true;
    } else {
      if (typeof(validate) === 'boolean') {
        result = validate;
      } else if (typeof(validate) === 'function') {
        result = validate(model, property);
      } else if (typeof(validate) === 'string') {
        if (typeof(model[validate]) === 'function') {
          result = model[validate]();
        } else {
          result = model.get(validate);
        }
      }
      result = positive ? result : !result;
    }

    return result;
  },

  _isValidate: function(details, model, property) {
    var ifValidate = this._check(details['if'], model, property, true);
    var unlessValidate = this._check(details.unless, model, property, false);
    return ifValidate && unlessValidate;
  },

  createInlineValidator: function() {
    return Validator.extend({
      perform: function() {
        var callback = this.get('callback');
        var error;

        if (callback) {
          error = callback.call(this, this.model, this.property);

          if (error) {
            this.errors.pushObject(error);
          }
        }
      }
    });
  },

  findValidators: function(rules) {
    var validators = Ember.A();
    var validator;
    var options;

    for (var validatorName in rules) {

      if (Constants.RULES_TO_IGNORE.indexOf(validatorName) === -1) {
        options = rules[validatorName];

        if (typeof(options) === 'string') {
          options = { message: options };
        } else if (typeof(options) !== 'object') {
          options = {};
        }

        if (validatorName === 'custom' ) {
          validator = this.createInlineValidator();
        } else {
          validator = this.lookupValidator(validatorName);
        }

        if (validator) {
          validators.pushObject(validator.create({
            validatorName: validatorName,
            options: options
          }));
        }
      }
    }

    return validators;
  },

  lookupValidator: function(validatorName) {
    var container = getOwner(this);
    var service = container.lookup('service:validator-cache');
    var validator;
    var cache;

    if (service) {
      cache = service.get('cache');
    } else {
      cache = {};
    }

    if (cache[validatorName]) {
      validator = cache[validatorName];
    } else {
      var customValidator = container.lookupFactory('validator:' + validatorName);
      if (customValidator) {
        validator = customValidator;
      } else {
        var predefined = container.lookupFactory('ember-validator@validator:' + validatorName);
        validator = predefined;
      }
      cache[validatorName] = validator;
    }

    if (Ember.isEmpty(validator)) {
      Ember.warn('Could not find the "' +validatorName+ '" validator.');
    }

    return validator;
  }
});

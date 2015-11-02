import Ember from 'ember';
import Errors from 'ember-validator/errors';
import Validator from 'ember-validator/validators/validator';


export default Ember.Mixin.create({
  validate: function(props) {
    var rules = this.get('validations') || props.validations;

    return this.validateMap({
      object: this,
      validations: rules,
      noPromise: props.noPromise
    });
  },

  validateMap: function(props) {
    var self = this;
    var noPromise = props.noPromise;

    var doValidate = function(props) {
      var object = props.model;
      var validations = props.validations;
      var result = Errors.create();
      var allErrors = Ember.A();
      var allValidators = Ember.A();
      var rules;
      var rule;
      var property;
      var errors;
      var validationResult;

      if (object && validations) {
        var validators = self.constructValidators(object, validations);
        if (!Ember.isEmpty(validators)) {
          validators.forEach(function(obj) {
            rules = obj.rules;
            property = obj.property;

            for (var count = 0; count < obj.rules.length; count++) {
              rule = obj.rules[count];
              validationResult = rule.validate();
              errors = validationResult.get('errors');
              if (!Ember.isEmpty(errors)) {
                allErrors.pushObjects(errors);
                allValidators.pushObjects(validationResult.get('validators'));
                result.set(property, validationResult);
                break;
              }
            }
          });
        }
      }

      result.setProperties({
        errors: allErrors,
        validators: allValidators
      });

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
      if (validatorName === 'custom' ) {
        validator = this.createInlineValidator();
        validators.pushObject(validator.create({
          validatorName: validatorName,
          callback: rules[validatorName].callback
        }));
      } else {
        validator = this.lookupValidator(validatorName);
        if (validator) {
          validators.pushObject(validator.create({
            validatorName: validatorName,
            options: rules[validatorName]
          }));
        }
      }
    }

    return validators;
  },

  lookupValidator: function(validatorName) {
    var container = this.get('container');
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

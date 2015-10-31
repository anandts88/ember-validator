import Ember from 'ember';
import Errors from 'ember-validations/errors';
import Base from 'ember-validations/validators/validator';


export default Ember.Mixin.create({
  validate: function(props) {
    var rules = this.get('validations') || validations;

    return this.validateMap({
      object: this,
      validations: rules,
      regular: props.regular
    });
  },

  validateMap: function(props) {
    var object = props.model;
    var validations = props.validations;
    var regular = props.regular;

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

    if (!regular) {
      if (result.get('isValid')) {
        return Ember.RSVP.resolve(true);
      } else {
        return Ember.RSVP.reject(result);
      }
    } else {
      return result;
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

  createInlineValidator: function(callback) {
    return Base.extend({
      call: function() {
        var errorMessage = this.callback.call(this, this.model, this.property);

        if (errorMessage) {
          this.errors.pushObject(errorMessage);
        }
      },
      callback: callback
    });
  },

  findValidators: function(rules) {
    var validators = Ember.A();
    var validator;
    for (var validatorName in rules) {
      if (validatorName !== 'inline' ) {
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
        var predefined = container.lookupFactory('ember-validations@validator:' + validatorName);
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

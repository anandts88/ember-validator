import Ember from 'ember';
import Errors from 'ember-validator/errors';
import Validator from 'ember-validator/validators/validator';
import Constants from 'ember-validator/constants';
import Utils from 'ember-validator/utils';

export default Ember.Mixin.create({
  messageFileName: 'messages',

  validate: function(props) {
    var rules = this.get('validations') || props.validations;

    return this.validateMap({
      model: this,
      validations: rules,
      noPromise: props.noPromise
    });
  },

  computedValidateMap: function(props) {
    var self            = this;
    var model           = props.model;
    var validationProps = [];
    var validations     = props.validations;
    var propDetails;
    var errorProperty;

    // Loop through each keys in the model
    for (var key in model) {
      // Check if key contains `ValidatorResult` or `ValidatorPreviousVal`.
      if (key.indexOf('ValidatorResult') !== -1 ||
        key.indexOf('ValidatorPreviousVal') != -1 ||
        key === 'isModelHasError') {
        // Reset the proerties to `undefined` value
        model.set(key, undefined);
      }
    }

    for (var property in validations) {
      propDetails = validations[property];
      errorProperty = propDetails.errorProperty;

      // Define a property which holds previous value of the property.
      model.set((errorProperty || property) + 'ValidatorPreviousVal', model.get(property));

      // Defina a computed property which listens the `property` change and perform validation.
      Ember.defineProperty(model, (errorProperty || property) + 'ValidatorResult', Ember.computed(property, function(sender) {
        var rules = {};
        var prop = sender.replace('ValidatorResult', ''); // Get the property name.
        var result;

        // Perfrom validation only if previous and current values are different.
        if (model.get(prop) !== model.get(prop + 'ValidatorPreviousVal')) {
          rules[prop] = validations[prop];

          // Invoke valiation map
          result = self.validateMap({
            model: model,
            validations: rules,
            noPromise: true
          });
        }

        return result;
      }));

      validationProps.push(key + '.hasError');
    }

    if (!Ember.isEmpty(validationProps)) {
      Ember.defineProperty(model, 'isModelHasError', Ember.computed.and.apply(validationProps));
    }
  },

  perform: function(model, validations) {
    var self        = this; // Holds the current instance.
    var result      = Errors.create();
    var allErrors   = Ember.A();
    var rules;
    var rule;
    var property;
    var errorProperty;
    var errors;
    var validationResult;

    if (model && validations) { // If model and validations are defined.
      var validators = self.constructValidators(model, validations); // Create list of validator object based on what user defined.

      if (!Ember.isEmpty(validators)) { // If validators are present.
        validators.forEach(function(obj) { // Loop through each validator
          rules = obj.rules; // Holds list of validator definitions.
          property = obj.property; // Property of the validator
          errorProperty = obj.errorProperty; // Name of the property which holds validation results.

          for (var count = 0; count < obj.rules.length; count++) { // Loop through validation rules
            rule = obj.rules[count];
            validationResult = rule.validate(); // Perform validation by calling its `validate` method.
            errors = validationResult.get('errors'); // Get errors messages from result of validation.
            if (!Ember.isEmpty(errors)) { // If the errors are not empty then model is not valid
              allErrors.pushObjects(errors);
              // By default validation result for that particular property is assinged in the name of property.
              // If `errorProperty` is defined then validation result is assinged in the name of value defined in `errorProperty`.
              result.set(errorProperty || property, validationResult);
              break;
            }
          }
        });
      }
    }
    result.set('errors', allErrors);

    return result;
  },

  validateMap: function(props) {
    var self = this; // Holds the current instance.
    var noPromise = props.noPromise; // Holds flag to indicating return value is a promise or not.

    if (noPromise) {
      return self.perform(props.model, props.validations);
    } else {
      return new Ember.RSVP.Promise(function(resolve, reject) {
        var result = self.perform(props.model, props.validations);
        if (result.get('isValid')) {
          resolve(true);
        } else {
          reject(result);
        }
      });
    }
  },

  constructValidators: function(model, validations) {
    var validators  = Ember.A();
    var messages    = this.lookupMessages();
    var details;
    var rules;

    for (var property in validations) { // Loop through each validation defined by the user.
      details = validations[property];

      // Perform `if` and `unless` check for validator, if the check fails then continue processing next validator
      if (!this.ifUnless(details, model, property)) {
        continue;
      }

      rules = this.findValidators(validations[property], model, property, messages); // Find the validators from container for the property.

      // Push the validator
      validators.pushObject({
        property: property,
        rules: rules,
        errorProperty: details.errorProperty
      });
    }

    return validators;
  },

  processIfUnless: function(validate, model, property, positive) {
    var result = true;

    switch (typeof(validate)) {
      case 'undefined':
        // In case `if` and `unless` are not defined then return true.
        result = true;
        break;
      case 'boolean':
        result = validate;
        // For `if` validations return results as it is for `unless` return inverse.
        result = positive ? result : !result;
        break;
      case 'function':
        result = validate(model, property);
        // For `if` validations return results as it is for `unless` return inverse.
        result = positive ? result : !result;
        break;
      case 'string':
        result = typeof(model[validate]) === 'function' ? model[validate]() : model.get(validate);
        // For `if` validations return results as it is for `unless` return inverse.
        result = positive ? result : !result;
        break;
    }
    return result;
  },

  ifUnless: function(details, model, property) {
    // Process `if` definition
    var ifCond = this.processIfUnless(details['if'], this.model, this.property, true);
    // Process `unless` definition
    var unlessCond = this.processIfUnless(details.unless, this.model, this.property, false);
    return ifCond && unlessCond;
  },

  findValidators: function(rules, model, property, messages) {
    var validators     = Ember.A();
    var validator;
    var options;

    for (var validatorName in rules) { // Iterate throug each validation rules defined by the users and get name of the validator.

      // Ignore `if`, `unless` and `errorProperty` as they are not rules but just and additional information.
      if (Constants.RULES_TO_IGNORE.indexOf(validatorName) === -1) {
        options = rules[validatorName]; // Get options defined for the validator.

        if (typeof(options) === 'string') { // If error message is directly defined for the validator, the create options object with message.
          options = { message: options };
        } else if (!Utils.isPlainObject(options)) {
          options = {};
        }

        if (validatorName === 'custom' ) { // If the validator is custom then create custom validator.
          validator = this.createInlineValidator();
        } else {
          validator = this.lookupValidator(validatorName);
        }

        if (validator) {
          validators.pushObject(validator.create({
            validatorName: validatorName,
            options: options,
            model: model,
            property: property,
            customMessages: messages
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

    // Define cache
    if (service) {
      cache = service.get('cache');
    } else {
      cache = {};
    }

    if (cache[validatorName]) { // Check if validator is available in cache
      validator = cache[validatorName];
    } else { // If validator is not present in cache.
      // Look up if the validator is overriden or defined by the user in the application.
      var customValidator = container.lookupFactory('validator:' + validatorName);
      if (customValidator) { // If user customized the validator
        validator = customValidator;
      } else { // If user not customized the validator, then look up default validators.
        validator = container.lookupFactory('ember-validator@validator:' + validatorName);
      }
      // Add the validator in cache.
      cache[validatorName] = validator;
    }

    // If validator not found then throw warning.
    if (Ember.isEmpty(validator)) {
      Ember.warn('Could not find the "' +validatorName+ '" validator.');
    }

    return validator;
  },

  lookupMessages: function() {
    var container = this.get('container');
    var service   = container.lookup('service:validator-cache');
    var file      = this.get('messageFileName');
    var cacheName = 'messages-' + file;
    var messages;
    var cache;

    // Define cache
    if (service) {
      cache = service.get('cache');
    } else {
      cache = {};
    }

    if (cache[cacheName]) { // Check if messages are available in cache
      messages = cache[cacheName] === 'Not Found' ? undefined : cache[cacheName];
    } else {
      // Lookup custom messages file is defined inside `validator` directory of app
      messages = container.lookupFactory('validator:' + file);
      cache[cacheName] = messages || 'Not Found';
    }

    return messages;
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
  }
});

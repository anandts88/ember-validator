import Ember from 'ember';
import Errors from 'ember-validator/errors';
import Validator from 'ember-validator/validators/validator';
import Constants from 'ember-validator/constants';
import { isPlainObject } from 'ember-validator/utils';

const { Mixin, RSVP, defineProperty, computed, isEmpty } = Ember;
const { Promise } = RSVP;
const { and, or, not, alias } = computed;

export default Mixin.create({
  messageFileName: 'messages',

  validate(props) {
    let {
      validations,
      noPromise
    } = props;

    validations = this.get('validations') || validations;

    return this.validateMap({
      model: this,
      validations,
      noPromise
    });
  },

  createObjectWithValidator(instance, validations) {
    let model;
    if (instance) {
      if (typeof(instance) === 'function') {
        model = instance.create();
      }
      this.computedValidateMap({
        model,
        validations
      });
    }
    return model;
  },

  computedValidateMap(props) {
    const self            = this;
    const model           = props.model;
    const validations     = props.validations;
    const validationHasError = Ember.A();
    const validationError = Ember.A();
    const computedErrors = Ember.A();
    let propertyName;
    let propDetails;
    let errorProperty;
    let computedFunc;
    let resetValidator;
    
    // Loop through each keys in the model
    for (let key in model) {
      // Check if key contains `ValidatorResult` or `ValidatorPreviousVal`.
      if (key.indexOf('ValidatorResult') !== -1 ||
        key.indexOf('validatorResult') !== -1 ||
        key.indexOf('ValidatorPreviousVal') != -1 ||
        key === 'validatorHasError') {
        // Reset the proerties to `undefined` value
        model.set(key, undefined);
      }
    }

    for (let property in validations) {
      propDetails = validations[property];
      errorProperty = propDetails.errorProperty;
      propertyName = errorProperty || property;

      // Define a property which holds previous value of the property.
      model.set(`${propertyName}ValidatorPreviousVal`, model.get(property));

      // Defina a computed property which listens the `property` change and perform validation.
      defineProperty(model, `${propertyName}ValidatorResult`, computed(property, (sender) => {
        let rules = {};
        let prop = sender.replace('ValidatorResult', ''); // Get the property name.
        let result;

        // Perfrom validation only if previous and current values are different.
        if (model.get(prop) !== model.get(`${prop}ValidatorPreviousVal`)) {
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

      validationHasError.pushObject(`${propertyName}ValidatorResult.hasError`);
      validationError.pushObject(`${propertyName}ValidatorResult.error`);
    }

    computedErrors.addObjects(validationError);
    computedErrors.pushObject(function() {
      const current = this;
      const result  = Ember.A();
      let error;
      if (!isEmpty(validationError)) {
        validationError.forEach((prop) => {
          error = current.get(prop);
          if (error) {
            result.pushObject(error);
          }
        });
      }

      return result;
    });

    defineProperty(model, 'validatorResultHasError', or.apply(null, validationHasError));
    defineProperty(model, 'validatorResultIsInValid', alias('validatorResultHasError'));
    defineProperty(model, 'validatorResultIsValid', not('validatorResultIsInValid'));
    defineProperty(model, 'validatorResultErrors', computed.apply(null, computedErrors));
  },

  perform(model, validations) {
    const self        = this; // Holds the current instance.
    const result      = Errors.create();
    const allErrors   = Ember.A();
    let rules;
    let rule;
    let property;
    let errorProperty;
    let errors;
    let validationResult;

    if (model && validations) { // If model and validations are defined.
      var validators = self.constructValidators(model, validations); // Create list of validator object based on what user defined.

      if (!Ember.isEmpty(validators)) { // If validators are present.
        validators.forEach((obj) => { // Loop through each validator
          rules = obj.rules; // Holds list of validator definitions.
          property = obj.property; // Property of the validator
          errorProperty = obj.errorProperty; // Name of the property which holds validation results.

          for (let count = 0; count < obj.rules.length; count++) { // Loop through validation rules
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

  validateMap(props) {
    const self = this; // Holds the current instance.
    const noPromise = props.noPromise; // Holds flag to indicating return value is a promise or not.

    if (noPromise) {
      return self.perform(props.model, props.validations);
    } else {
      return new Promise((resolve, reject) => {
        const result = self.perform(props.model, props.validations);
        if (result.get('isValid')) {
          resolve(true);
        } else {
          reject(result);
        }
      });
    }
  },

  constructValidators(model, validations) {
    const validators  = Ember.A();
    const messages    = this.lookupMessages();
    let details;
    let rules;

    for (let property in validations) { // Loop through each validation defined by the user.
      details = validations[property];

      // Perform `if` and `unless` check for validator, if the check fails then continue processing next validator
      if (!this.ifUnless(details, model, property)) {
        continue;
      }

      rules = this.findValidators(validations[property], model, property, messages); // Find the validators from container for the property.

      // Push the validator
      validators.pushObject({
        property,
        rules,
        errorProperty: details.errorProperty
      });
    }

    return validators;
  },

  processIfUnless(validate, model, property, positive) {
    let result = true;

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

  ifUnless(details, model, property) {
    // Process `if` definition
    const ifCond = this.processIfUnless(details['if'], model, property, true);
    // Process `unless` definition
    const unlessCond = this.processIfUnless(details.unless, model, property, false);
    return ifCond && unlessCond;
  },

  findValidators(rules, model, property, messages) {
    const validators     = Ember.A();
    let validator;
    let options;

    for (let validatorName in rules) { // Iterate throug each validation rules defined by the users and get name of the validator.

      // Ignore `if`, `unless` and `errorProperty` as they are not rules but just and additional information.
      if (Constants.RULES_TO_IGNORE.indexOf(validatorName) === -1) {
        options = rules[validatorName]; // Get options defined for the validator.

        if (typeof(options) === 'string') { // If error message is directly defined for the validator, the create options object with message.
          options = { message: options };
        } else if (!isPlainObject(options)) {
          options = {};
        }

        if (validatorName === 'custom' ) { // If the validator is custom then create custom validator.
          validator = this.createInlineValidator();
        } else {
          validator = this.lookupValidator(validatorName);
        }

        if (validator) {
          validators.pushObject(validator.create({
            validatorName,
            options,
            model,
            property,
            customMessages: messages
          }));
        }
      }
    }

    return validators;
  },

  lookupValidator(validatorName) {
    const container = this.get('container');
    const service = container.lookup('service:validator-cache');
    let validator;
    let cache;

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
    if (isEmpty(validator)) {
      Ember.warn('Could not find the "' +validatorName+ '" validator.');
    }

    return validator;
  },

  lookupMessages() {
    const container = this.get('container');
    const service   = container.lookup('service:validator-cache');
    const file      = this.get('messageFileName');
    const cacheName = 'messages-' + file;
    let messages;
    let cache;

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

  createInlineValidator() {
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

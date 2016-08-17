import Ember from 'ember';
import Errors from 'ember-validator/errors';
import Validator from 'ember-validator/validators/validator';
import Constants from 'ember-validator/constants';
import getOwner from 'ember-getowner-polyfill';
import isHTMLSafe from 'ember-string-ishtmlsafe-polyfill';

const {
  Mixin,
  RSVP,
  defineProperty,
  computed,
  isEmpty,
  isNone,
  warn
} = Ember;

const {
  Promise
} = RSVP;

const {
  and,
  or,
  not,
  alias
} = computed;

export default Mixin.create({

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

  resetValidatorProperties(model) {
    model.set('computedValidations', false);
    // Loop through each keys in the model
    for (let key in model) {
      // Check if key contains `ValidatorResult` or `ValidatorPreviousVal`.
      if (key.indexOf('ValidatorResult') !== -1 ||
        key.indexOf('validatorResult') !== -1 ||
        key.indexOf('ValidatorPreviousVal') != -1 ||
        key.indexOf('FieldIsDirty') != -1 ||
        key === 'validatorHasError') {
        // Reset the proerties to `undefined` value
        model.set(key, undefined);
      }
    }
  },

  /**
    Create object by passing instance and validation rules, and returns object with computed validation rules.

    const User = Ember.Object.extend({
      userName: undefined,
      password: undefined
    })

    const UserModel = this.createObjectWithValidator({
      model: User
      validations: {
        userName: {
          required: 'Please enter user name'
        },

        password: {
          required: 'Please enter password'
        }
      }
    });
  */
  createObjectWithValidator(model, validations, validateOnDirty) {
    if (model) {
      if (typeof(model) === 'function') {
        model = model.create();
      }
      this._computedValidateMap({
        model,
        validations,
        validateOnDirty
      });
    }

    return model;
  },

  computedValidateMap(props) {
    this._computedValidateMap(props);
  },

  _computedValidateMap(props) {
    const self              = this;
    const {
      model,
      validateOnDirty,
      validations
    } = props;
    const validationProp    = Ember.A();
    const computedErrors    = Ember.A();
    const computedDirty     = Ember.A();
    const mapper            = {};
    let validationHasError  = Ember.A();
    let validationError     = Ember.A();
    let dirty               = Ember.A();
    let propertyName;
    let propDetails;
    let errorProperty;
    let computedFunc;

    this.resetValidatorProperties(model);

    for (let property in validations) {
      propDetails = validations[property];
      errorProperty = propDetails.errorProperty;
      propertyName = errorProperty || property;
      mapper[propertyName] = property;

      model.set('computedValidations', true);

      // Define a property which holds initial value of the property.
      model.set(`${propertyName}ValidatorPreviousVal`, model.get(property));

      // Define a computed Property to check whether the field is dirty (holding the initial value or not)
      defineProperty(model, `${propertyName}FieldIsDirty`, computed(property, function(sender) {
        let propertyName = sender.replace('FieldIsDirty', '');
        let prop = mapper[propertyName]; // Get the property name.
        // Compare current value with the initial value of the property.
        // If they are not equal then it is considered value has been changed and hence the field becomes dirty
        return this.get(`${propertyName}ValidatorPreviousVal`) !== this.get(prop);
      }));

      // Defina a computed property which listens the `property` change and perform validation.
      defineProperty(model, `${propertyName}ValidatorResult`, computed(property, function(sender) {
        let rules         = {};
        let propertyName  = sender.replace('ValidatorResult', '');
        let prop          = mapper[propertyName]; // Get the property name.
        let result        = Errors.create();
        let validationResultInModel;

        // By default validation will happen irrespective of field is dirty or not.
        // Check `validateOnDirty` if it is true then perform validation only if the field becomes dirty otherwise skips validation
        if (!validateOnDirty || (validateOnDirty && this.get(`${propertyName}FieldIsDirty`))) {
          rules[prop] = validations[prop];

          // Invoke valiation map
          result = self.validateMap({
            model,
            validations: rules,
            noPromise: true,
            skipreset: true
          });

          self.resetValidationMapResult(model, propertyName);
        }

        return result;
      }));

      validationProp.pushObject(propertyName);
    }

    if (!isEmpty(validationProp)) {
      validationHasError = validationProp.map((prop) => `${prop}ValidatorResult.hasError`);
      validationError = validationProp.map((prop) => `${prop}ValidatorResult.error`);
      dirty = validationProp.map((prop) => `${prop}FieldIsDirty`);

      computedErrors.addObjects(validationError);
      computedErrors.pushObject(function() {
        const current = this;
        const result  = Ember.A();
        let error;

        validationError.forEach((prop) => {
          error = current.get(prop);
          if (error) {
            result.pushObject(error);
          }
        });

        return result;
      });
    }

    // Computed property which returns true if the validation result has any error
    defineProperty(model, 'validatorResultHasError', or.apply(null, validationHasError));
    // Computed property which returns true if model is not valid
    defineProperty(model, 'validatorResultIsInValid', alias('validatorResultHasError'));
    // Computed property which returns true if model is valid
    defineProperty(model, 'validatorResultIsValid', not('validatorResultIsInValid'));
    // Computed property which array of all validation errors
    defineProperty(model, 'validatorResultErrors', computed.apply(null, computedErrors));
    // Computed property which returns true if the object is dirty
    defineProperty(model, 'validatorResultObjectDirty', or.apply(null, dirty));
    // Computed property which returns true if the object is clean
    defineProperty(model, 'validatorResultObjectClean', not('validatorResultObjectDirty'));
  },

  performValidation(model, validations) {
    const self        = this; // Holds the current instance.
    const result      = Errors.create();
    const allErrors   = Ember.A();
    let rule;
    let errors;
    let validationResult;

    if (model && validations) { // If model and validations are defined.
      var validators = self.constructValidators(model, validations); // Create list of validator object based on what user defined.

      if (!isEmpty(validators)) { // If validators are present.
        validators.forEach((obj) => { // Loop through each validator
          let {
            rules, // Holds list of validator definitions.
            property, // Property of the validator
            errorProperty // Name of the property which holds validation results.
          } = obj;

          for (let count = 0; count < rules.length; count++) { // Loop through validation rules
            rule = obj.rules[count];
            validationResult = rule.validate(); // Perform validation by calling its `validate` method.
            errors = validationResult.get('errors'); // Get errors messages from result of validation.
            if (!isEmpty(errors)) { // If the errors are not empty then model is not valid
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

  resetComputedValidationResult(model, validations) {
    let validatorResult;
    let propDetails;
    let errorProperty;
    let propertyName;

    for (let property in validations) {
      propDetails = validations[property];
      errorProperty = propDetails.errorProperty;
      propertyName = errorProperty || property;

      validatorResult = model.get(`${propertyName}ValidatorResult`);
      if (!isNone(validatorResult) && validatorResult.get('hasError')) {
        validatorResult.get('errors').clear();
      }
    }
  },

  resetValidationMapResult(model, propertyName) {
    const validationResultProperty  = model.get('validationResultProperty') || 'validationResult'; // Name of the property in model where the validation result will be set.
    const validationResult          = model.get(validationResultProperty);

    if (!isNone(validationResult) && validationResult.get(`${propertyName}.hasError`)) {
    validationResult.get(`${propertyName}.errors`).clear();
    }
  },

  validateMap(props) {
    const self = this; // Holds the current instance.
    let {
      model,
      skipreset,
      validations,
      noPromise // Holds flag to indicating return value is a promise or not.
    } = props;
    const validationResult = model.get('validationResultProperty') || 'validationResult'; // Name of the property in model where the validation result will be set.
    let result;

    model.set(validationResult, undefined);

    if (!skipreset) {
      this.resetComputedValidationResult(model, validations);
    }

    if (noPromise) {
      result = self.performValidation(model, validations);
      if (model.get('computedValidations')) {
        model.set(validationResult, result);
      }

      return result;
    } else {
      return new Promise((resolve, reject) => {
        result = self.performValidation(model, validations);
        if (model.get('computedValidations')) {
          model.set(validationResult, result);
        }
        if (result.get('isValid')) {
          resolve(true);
        } else {
          reject(result);
        }
      });
    }
  },

  constructValidators(model, validations) {
    const validators = Ember.A();
    let details;
    let rules;
    let errorProperty;

    for (let property in validations) { // Loop through each validation defined by the user.
      details = validations[property];
      errorProperty = details.errorProperty;

      // Perform `if` and `unless` check for validator, if the check fails then continue processing next validator
      if (!this.ifUnless(details, model, property)) {
        continue;
      }

      rules = this.findValidators(validations[property], model, property); // Find the validators from container for the property.

      validators.pushObject({
        property,
        rules,
        errorProperty
      });
    }
    return validators;
  },

  processIfUnless(validate, model, property, positive) {
    let result = true;

    // In case `if` and `unless` are not defined then return true.
    if (isNone(validate)) {
      return true;
    }

    switch (typeof(validate)) {
      case 'boolean':
        result = validate;
        // For `if` validations return `results` as it is for `unless` return inverse.
        result = positive ? result : !result;
        break;
      case 'function':
        result = validate(model, property);
        // For `if` validations return `results` as it is for `unless` return inverse.
        result = positive ? result : !result;
        break;
      case 'string':
        result = typeof(model[validate]) === 'function' ? model[validate]() : model.get(validate);
        // For `if` validations return `results` as it is for `unless` return inverse.
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

  createInlineValidator() {
    return Validator.extend({
      perform() {
        const callback = this.get('callback');
        let error;

        if (callback) {
          error = callback.call(this, this.model, this.property);

          if (error) {
            this.errors.pushObject(error);
          }
        }
      }
    });
  },

  findValidators(rules, model, property) {
    const validators = Ember.A();
    let validator;
    let options;

    // Iterate through each validation rules defined by the users and get name of the validator.
    for (let validatorName in rules) {
      // Ignore `if`, `unless` and `errorProperty` as they are not rules but just and additional information.
      if (Constants.RULES_TO_IGNORE.indexOf(validatorName) === -1) {
        options = rules[validatorName]; // Get options defined in the validator.

        if (typeof(options) === 'string') { // If error message is directly defined for the validator, the create options object with message.
          options = { message: options };
        } else if (isHTMLSafe(options)) {
          options = { message: options.toString() };
        } else if (typeof(options) !== 'object') {
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
            property
          }));
        }
      }
    }

    return validators;
  },

  lookupValidator(validatorName) {
    const container = getOwner(this);
    let cache       = {};
    let service;
    let validator;
    let customValidator;
    let predefinedValidator;

    // Object must needs container for doing validation.
    if (isNone(container)) {
      throw new TypeError(`[ember-validator] ${this.toString()} is missing a container or owner.`);
    }

    service = container.lookup('service:validator-cache');


    // Define cache
    if (service) {
      cache = service.get('cache');
    }

    if (cache[validatorName]) { // Check if validator is available in cache
      validator = cache[validatorName];
    } else { // If validator is not present in cache.
      // Look up if the validator is overriden or defined by the user in the application.
      customValidator = container._lookupFactory(`validator:${validatorName}`);
      if (customValidator) { // If user customized the validator
        validator = customValidator;
      } else { // If user not customized the validator, then look up default validators.
        predefinedValidator = container._lookupFactory(`ember-validator@validator:${validatorName}`);
        validator = predefinedValidator;
      }
      // Add the validator in cache.
      cache[validatorName] = validator;
    }

    // If validator not found then throw warning.
    if (isNone(validator)) {
      warn(`Could not find '${validatorName}' validator.`);
    }

    return validator;
  }
});

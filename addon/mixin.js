import Ember from 'ember';
import Errors from 'ember-validator/errors';
import Validator from 'ember-validator/validators/validator';
import Constants from 'ember-validator/constants';
import getOwner from 'ember-getowner-polyfill';

const {
  Mixin
} = Ember;

export default Mixin.create({
  validate(props) {
    let rules = this.get('validations') || props.validations;

    return this.validateMap({
      model: this,
      validations: rules,
      noPromise: props.noPromise
    });
  },

  computedValidateMap(props) {
    let object = props.model;
    let validations = props.validations;
    let self = this;
    let propDetails;
    let errorProperty;

    for (let key in object) {
      if (key.indexOf('ValidatorResult') !== -1 || key.indexOf('ValidatorPreviousVal') != -1) {
        object.set(key, null);
      }
    }

    for (let property in validations) {
      propDetails = validations[property];
      errorProperty = propDetails.errorProperty;

      if (this._isValidate(propDetails, object, property)) {
        object.set((errorProperty || property) + 'ValidatorPreviousVal', object.get(property));
        Ember.defineProperty(object, (errorProperty || property) + 'ValidatorResult', Ember.computed(property, function(sender) {
          let rules = {};
          let prop = sender.replace('ValidatorResult', '');
          let result;

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

  validateMap(props) {
    let self = this;
    let noPromise = props.noPromise;

    let doValidate = function(props) {
      let object = props.model;
      let validations = props.validations;
      let result = Errors.create();
      let allErrors = Ember.A();
      let rules;
      let rule;
      let property;
      let errorProperty;
      let errors;
      let validationResult;

      if (object && validations) {
        let validators = self.constructValidators(object, validations);
        if (!Ember.isEmpty(validators)) {
          validators.forEach(function(obj) {
            rules = obj.rules;
            property = obj.property;
            errorProperty = obj.errorProperty;

            for (let count = 0; count < obj.rules.length; count++) {
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
        let result = doValidate(props);
        if (result.get('isValid')) {
          resolve(true);
        } else {
          reject(result);
        }
      });
    }
  },

  constructValidators(object, validations) {
    let validators = Ember.A();
    let propDetails;
    let rules;
    for (let property in validations) {
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

  _check(validate, model, property, positive) {
    let result = true;

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

  _isValidate(details, model, property) {
    let ifValidate = this._check(details['if'], model, property, true);
    let unlessValidate = this._check(details.unless, model, property, false);
    return ifValidate && unlessValidate;
  },

  createInlineValidator() {
    return Validator.extend({
      perform: function() {
        let callback = this.get('callback');
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

  findValidators(rules) {
    let validators = Ember.A();
    let validator;
    let options;

    for (let validatorName in rules) {

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

  lookupValidator(validatorName) {
    let container = getOwner(this);
    let service = container.lookup('service:validator-cache');
    let validator;
    let cache;

    if (service) {
      cache = service.get('cache');
    } else {
      cache = {};
    }

    if (cache[validatorName]) {
      validator = cache[validatorName];
    } else {
      let customValidator = container._lookupFactory('validator:' + validatorName);
      if (customValidator) {
        validator = customValidator;
      } else {
        let predefined = container._lookupFactory('ember-validator@validator:' + validatorName);
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

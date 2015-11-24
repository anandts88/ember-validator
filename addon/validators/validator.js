import Ember from 'ember';
import Messages from 'ember-validator/messages';
import Errors from 'ember-validator/errors';
import { isPlainObject, isArray } from 'ember-validator/utils';

const { computed, isEmpty } = Ember;

const { alias, empty, not } = computed;

export default Ember.Object.extend({
  errors: null,
  validators: null,
  options: null,
  property: null,
  model: null,
  customMessages: null,

  callback: alias('options.callback'),
  'if': alias('options.if'),
  unless: alias('options.unless'),
  isValid: empty('errors.[]'),
  isInvalid: not('isValid'),

  initOptions() {
    // Each validator must have `options` which is a plain javascript object.
    // Initalize with empty object if it is not defined
    if (!isPlainObject(this.options)) {
      this.set('options', {});
    }
  },

  initMessages() {
    // If the messages are not present in validator options, then initalize with empty object.
    if (!this.options.messages || !isPlainObject(this.options.messages)) {
      this.set('options.messages', {});
    }

    // Loop through each rules in the validator.
    for (let rule in this.rules) {
      // Check if the message is defined for the rule
      if (isEmpty(this.options.messages[rule])) {
        // Assign message for the rule with
        // 1. If message is supplied for validator in `options.message` then assign the supplied message
        // 2. If not then assing default message from `messages` file.
        this.options.messages[rule] = this.options.message || this.getMessage(rule);
      }
    }
  },

  getMessage(rule) {
    var messages = Messages[this.validatorName];
    var custom   = this.get('customMessages');
    // Get message from custom message file defined by the user, if not get the message from default messages file.
    return custom ? custom[rule] : (messages ? messages[rule] : undefined);
  },

  initRule(rule) {
    var option = this.options[rule]; // Get options defined for each rule.

    // If the users defined options for the rule as non javascript plain object (boolean, array or regex etc), then convert them to plain javascript object.
    if (!isPlainObject(option)) {
      this.options[rule] = { target: option };
    }
  },

  init() {
    // Set errors with empty array.
    this.set('errors', Ember.A());

    // Initalize options and messages only if it is not a `custom` validator
    if (this.validatorName !== 'custom') {
      this.initOptions();
      this.initMessages();
    }
  },

  render(message, options) {
    message = message || 'Invalid';

    for (let option in options) {
      message = message.replace('{{' + option + '}}', JSON.stringify(options[option]));
    }

    return message;
  },

  pushResult(error, options) {
    this.errors.push(this.render(error, options)); // Render and adds error messages to validator array.
  },

  rules: {},

  perform() {
    throw 'Please override perform method in you validator.';
  },

  process(value) {
    let valid = false; // Flag to hold the result of validator rule.
    let messages; // Holds messages for the rule.
    let ruleOption; // Holds the options of the rule.

    // Interate through each rules defined in the validator
    for (let rule in this.rules) {
      valid = false; // Init flag to false for each rule.
      ruleOption = this.options[rule]; // Get options defined for each rule.

      // If the rule is not defined by the users then consider that rule passed the validation.
      if (this.validatorName !== rule && !ruleOption) {
        valid = true;
      } else { // If the rule is defined by the users then do the below
        this.initRule(rule);

        // Get options defined for rule after intialization.
        ruleOption = this.options[rule];

        // Perform `if` and `unless` check for rule, if the check fails then continue processing next rule
        if (!this.ifUnless(ruleOption['if'], ruleOption.unless)) {
          continue;
        }

        // Execute each rule in the current instance with value and option as parameter.
        valid = this.rules[rule].call(this, value, ruleOption);
      }

      // Get messages defined for the rule.
      messages = this.options.messages[rule];

      this.setMessages(valid, messages, ruleOption);
    }
  },

  setMessages(result, messages, options) {
    // Rule exceution will return result as boolean or array of boolean values.
    if (isArray(result)) { // If returned result is an array
      for (let count = 0 ; count < result.length ; count++) {
        if (!result[count]) { // If the validation failes then
          this.pushResult(Utils.isArray(messages) ? messages[count] : messages, options);
          break;
        }
      }
    } else if (!result) { // If returned result is boolean and validation is failed then push the message.
      this.pushResult(messages, options);
    }
  },

  validate() {
    // Clear errors array
    this.errors.clear();

    // Check if the `if` and `unless` conditions defined are satisfied.
    if (this.ifUnless(this.get('if'), this.get('unless'))) {
      // Perform validations
      this.perform(this.model.get(this.property));
    }

    // Assign the errors
    return Errors.create({
      errors: this.get('errors'),
      validators: this.get('validators')
    });
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

  ifUnless(ifDef, unlessDef) {
    // Process `if` definition
    const ifCond = this.processIfUnless(ifDef, this.model, this.property, true);
    // Process `unless` definition
    const unlessCond = this.processIfUnless(unlessDef, this.model, this.property, false);
    return ifCond && unlessCond;
  }
});

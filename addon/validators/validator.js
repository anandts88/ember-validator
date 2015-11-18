import Ember from 'ember';
import Messages from 'ember-validator/messages';
import Errors from 'ember-validator/errors';
import Utils from 'ember-validator/utils';

export default Ember.Object.extend({
  errors: null,
  validators: null,
  options: null,
  property: null,
  model: null,
  customMessages: null,

  callback: Ember.computed.alias('options.callback'),
  'if': Ember.computed.alias('options.if'),
  unless: Ember.computed.alias('options.unless'),
  isValid: Ember.computed.empty('errors.[]'),
  isInvalid: Ember.computed.not('isValid'),

  initOptions: function() {
    // Each validator must have `options` which is a plain javascript object.
    // Initalize with empty object if it is not defined
    if (!Utils.isPlainObject(this.options)) {
      this.set('options', {});
    }
  },

  initMessages: function() {
    // If the messages are not present in validator options, then initalize with empty object.
    if (!this.options.messages || !Utils.isPlainObject(this.options.messages)) {
      this.set('options.messages', {});
    }

    // Loop through each rules in the validator.
    for (var rule in this.rules) {
      // Check if the message is defined for the rule
      if (Ember.isEmpty(this.options.messages[rule])) {
        // Assign message for the rule with
        // 1. If message is supplied for validator in `options.message` then assign the supplied message
        // 2. If not then assing default message from `messages` file.
        this.options.messages[rule] = this.options.message || this.getMessage(rule);
      }
    }
  },

  getMessage: function(rule) {
    var messages = Messages[this.validatorName];
    var custom   = this.get('customMessages');
    // Get message from custom message file defined by the user, if not get the message from default messages file.
    return custom ? custom[rule] : (messages ? messages[rule] : undefined);
  },

  initRule: function(rule) {
    var option = this.options[rule]; // Get options defined for each rule.

    // If the users defined options for the rule as non javascript plain object (boolean, array or regex etc), then convert them to plain javascript object.
    if (!Utils.isPlainObject(option)) {
      this.options[rule] = { target: option };
    }
  },

  init: function() {
    // Set errors with empty array.
    this.set('errors', Ember.A());

    // Initalize options and messages only if it is not a `custom` validator
    if (this.validatorName !== 'custom') {
      this.initOptions();
      this.initMessages();
    }
  },

  render: function(message, options) {
    message = message || 'Invalid';

    for (var option in options) {
      message = message.replace('{{' + option + '}}', options[option]);
    }

    return message;
  },

  pushResult: function(error, options) {
    this.errors.push(this.render(error, options)); // Render and adds error messages to validator array.
  },

  rules: {},

  perform: function () {
    throw 'Please override perform method in you validator.';
  },

  process: function(value) {
    var valid = false; // Flag to hold the result of validator rule.
    var messages; // Holds messages for the rule.
    var ruleOption; // Holds the options of the rule.

    // Interate through each rules defined in the validator
    for (var rule in this.rules) {
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

      this.setMessages(valid, messages);
    }
  },

  setMessages: function(result, messages) {
    // Rule exceution will return result as boolean or array of boolean values.
    if (Utils.isArray(result)) { // If returned result is an array
      for (var count = 0 ; count < result.length ; count++) {
        if (!result[count]) { // If the validation failes then
          this.pushResult(Utils.isArray(messages) ? messages[count] : messages);
          break;
        }
      }
    } else if (!result) { // If returned result is boolean and validation is failed then push the message.
      this.pushResult(messages);
    }
  },

  validate: function() {
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

  ifUnless: function(ifDef, unlessDef) {
    // Process `if` definition
    var ifCond = this.processIfUnless(ifDef, this.model, this.property, true);
    // Process `unless` definition
    var unlessCond = this.processIfUnless(unlessDef, this.model, this.property, false);
    return ifCond && unlessCond;
  }
});

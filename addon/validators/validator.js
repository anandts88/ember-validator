import Ember from 'ember';
import Messages from 'ember-validator/messages';
import Errors from 'ember-validator/errors';

export default Ember.Object.extend({
  errors: null,
  validators: null,
  options: null,
  property: null,
  model: null,

  'if': Ember.computed.alias('options.if'),
  unless: Ember.computed.alias('options.unless'),
  isValid: Ember.computed.empty('errors.[]'),
  isInvalid: Ember.computed.not('isValid'),

  init: function() {
    var messages;

    this.set('errors', Ember.A());

    if (this.validatorName !== 'custom') {
      if (typeof(this.options) !== 'object') {
        this.set('options', {});
      }

      if (!this.options.messages) {
        this.set('options.messages', {});
      }

      messages = Messages[this.validatorName];

      if (typeof(messages) === 'string' && !this.options.message) {
        this.set('options.message', messages);
      } else if (typeof(messages) === 'object') {
        for (var key in messages) {
          if (Ember.isEmpty(this.options.messages[key])) {
            this.options.messages[key] = this.options.message || messages[key];
          }
        }
      }
    }
  },

  render: function(message, options) {
    for(var option in options) {
      message = (message || 'Invalid').replace('{{' + option + '}}', options[option]);
    }

    return message;
  },

  pushResult: function(error, options) {
    this.errors.push(this.render(error, options));
  },

  perform: function () {
    throw 'Please override perform method in you validator.';
  },

  renderMessageFor: function(key, options) {
    return this.options.messages[key] || Messages.render(key, options);
  },

  validate: function() {
    this.errors.clear();
    if (this._isValidate()) {
      this.perform();
    }

    return Errors.create({
      errors: this.get('errors'),
      validators: this.get('validators')
    });
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
      case '!=':
        return a != b;
      case '!==':
        return a !== b;
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

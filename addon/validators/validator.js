import Ember from 'ember';
import Messages from 'ember-validator/messages';
import Errors from 'ember-validator/errors';

export default Ember.Object.extend({
  errors: null,
  validators: null,
  options: null,
  property: null,
  model: null,

  callback: Ember.computed.alias('options.callback'),
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
    message = message || 'Invalid';

    for(var option in options) {
      message = message.replace('{{' + option + '}}', options[option]);
    }

    return message;
  },

  pushResult: function(error, options) {
    this.errors.push(this.render(error, options));
  },

  perform: function () {
    throw 'Please override perform method in you validator.';
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

  _isValidate: function() {
    var ifValidate = this._check(this.get('if'), this.model, this.property, true);
    var unlessValidate = this._check(this.get('unless'), this.model, this.property, false);
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

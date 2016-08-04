import Ember from 'ember';
import Messages from 'ember-validator/messages';
import Errors from 'ember-validator/errors';
import isHTMLSafe from 'ember-string-ishtmlsafe-polyfill';

const {
  Object: EmberObject,
  computed
} = Ember;

const {
  alias,
  empty,
  not
} = computed;

export default EmberObject.extend({
  errors: undefined,
  validators: undefined,
  options: undefined,
  property: undefined,
  model: undefined,

  callback: alias('options.callback'),
  'if': alias('options.if'),
  unless: alias('options.unless'),
  isValid: empty('errors.[]'),
  isInvalid: not('isValid'),

  init() {
    let messages;

    this.set('errors', Ember.A());

    if (this.validatorName !== 'custom') {
      if (typeof(this.options) !== 'object') {
        this.set('options', {});
      }

      if (!this.options.messages || typeof(this.options.messages) !== 'object') {
        this.set('options.messages', {});
      }

      messages = Messages[this.validatorName];

      if (typeof(messages) === 'string' && !this.options.message) {
        this.set('options.message', messages);
      } else if (typeof(messages) === 'object') {
        for (let key in messages) {
          if (Ember.isEmpty(this.options.messages[key])) {
            this.options.messages[key] = this.options.message || messages[key];
          }
        }
      }
    }
  },

  render(message, options) {
    message = message || 'Invalid';

    // Handle the `Ember.Handlebars.SafeString()` and the `Ember.String.htmlSafe()` cases.
    if (isHTMLSafe(message)) {
      message = message.toString();
    }

    for(let option in options) {
      message = message.replace('{{' + option + '}}', options[option]);
    }

    return message;
  },

  pushResult(error, options) {
    this.errors.push(this.render(error, options));
  },

  perform() {
    throw 'Please override perform method in you validator.';
  },

  validate() {
    this.errors.clear();
    if (this._isValidate()) {
      this.perform();
    }

    return Errors.create({
      errors: this.get('errors'),
      validators: this.get('validators')
    });
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

  _isValidate() {
    let ifValidate = this._check(this.get('if'), this.model, this.property, true);
    let unlessValidate = this._check(this.get('unless'), this.model, this.property, false);
    return ifValidate && unlessValidate;
  },

  compare(a, b, operator) {
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

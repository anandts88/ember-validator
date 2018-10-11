import { isHTMLSafe } from '@ember/template';
import { isEmpty } from '@ember/utils';
import { A } from '@ember/array';
import { not, empty, alias } from '@ember/object/computed';
import EmberObject, { set, get } from '@ember/object';
import Messages from 'ember-validator/messages';
import Errors from 'ember-validator/errors';

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

    set(this, 'errors', A());

    if (this.validatorName !== 'custom') {
      if (typeof(this.options) !== 'object') {
        set(this, 'options', {});
      }

      if (!this.options.messages || typeof(this.options.messages) !== 'object') {
        set(this, 'options.messages', {});
      }

      messages = Messages[this.validatorName];

      if (typeof(messages) === 'string' && !this.options.message) {
        set(this, 'options.message', messages);
      } else if (typeof(messages) === 'object') {
        for (let key in messages) {
          if (isEmpty(this.options.messages[key])) {
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
      errors: get(this, 'errors'),
      validators: get(this, 'validators')
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
          result = get(model, validate);
        }
      }
      result = positive ? result : !result;
    }

    return result;
  },

  _isValidate() {
    let ifValidate = this._check(get(this, 'if'), this.model, this.property, true);
    let unlessValidate = this._check(get(this, 'unless'), this.model, this.property, false);
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

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
    this.setProperties({
      errors: Ember.A(),
      validators: Ember.A()
    });
  },

  pushResult: function(error, rule) {
    this.errors.push(error);
    this.validators.push(this.validatorName + (rule ? '-' + rule : ''));
  },

  perform: function () {
    throw 'Please override perform method in you validator.';
  },

  renderMessageFor: function(key, options) {
    return this.options.messages[key] || Messages.render(key, options);
  },

  validate: function() {
    this.errors.clear();
    this.validators.clear();
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

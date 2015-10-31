import Ember from 'ember';

export default Ember.Object.extend({
  errors: null,
  options: null,
  property: null,
  model: null,

  'if': Ember.computed.alias('options.if'),
  unless: Ember.computed.alias('options.unless'),
  isValid: Ember.computed.empty('errors.[]'),
  isInvalid: Ember.computed.not('isValid'),

  init: function() {
    this.set('errors', Ember.A());
  },

  perform: function () {
    throw 'Not implemented!';
  },

  validate: function() {
    var result = this._validate();
    return this.get('errors');
  },

  _validate: function() {
    this.errors.clear();
    if (this._isValidate()) {
      this.perform();
    }

    return this.get('isValid');
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

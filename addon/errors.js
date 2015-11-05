import Ember from 'ember';

export default Ember.Object.extend({
  errors: null,
  validators: null,
  error: Ember.computed.alias('errors.firstObject'),
  validator: Ember.computed.alias('validators.firstObject'),
  isValid: Ember.computed.empty('errors.[]'),
  isInvalid: Ember.computed.not('isValid'),
  hasError: Ember.computed.alias('isInvalid')
});

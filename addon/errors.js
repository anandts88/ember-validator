import Ember from 'ember';

export default Ember.Object.extend({
  errors: null,
  error: Ember.computed.alias('errors.firstObject'),
  isValid: Ember.computed.empty('errors.[]'),
  isInvalid: Ember.computed.not('isValid'),
  hasError: Ember.computed.notEmpty('error')
});

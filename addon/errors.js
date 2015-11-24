import Ember from 'ember';

const { computed } = Ember;

const { alias, empty, not } = computed;

export default Ember.Object.extend({
  errors: null,
  validators: null,
  error: alias('errors.firstObject'),
  validator: alias('validators.firstObject'),
  isValid: empty('errors.[]'),
  isInvalid: not('isValid'),
  hasError: alias('isInvalid')
});

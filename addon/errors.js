import Ember from 'ember';

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
  error: alias('errors.firstObject'),
  validator: alias('validators.firstObject'),
  isValid: empty('errors.[]'),
  isInvalid: not('isValid'),
  hasError: alias('isInvalid')
});

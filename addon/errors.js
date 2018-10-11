import { not, empty, alias } from '@ember/object/computed';
import EmberObject from '@ember/object';

export default EmberObject.extend({
  errors: undefined,
  validators: undefined,
  error: alias('errors.firstObject'),
  validator: alias('validators.firstObject'),
  isValid: empty('errors.[]'),
  isInvalid: not('isValid'),
  hasError: alias('isInvalid')
});

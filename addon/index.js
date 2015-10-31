import Mixin from 'ember-validator/mixin';

export default Mixin;
export function inlineValidator(callback) {
  return { callback: callback };
}

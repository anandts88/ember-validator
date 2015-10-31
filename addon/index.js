import Mixin from 'ember-validator/mixin';

export default Mixin;
export function validator(callback) {
  return { callback: callback };
}

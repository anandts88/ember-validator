import { isBlank } from '@ember/utils';
import Mixin from '@ember/object/mixin';
import { get } from '@ember/object';

export default Mixin.create({
  perform() {
    let value = get(this.model, this.property);
    if (isBlank(value)) {
      this.pushResult(this.options.message);
    }
  }
});

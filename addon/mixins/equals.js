import { isEmpty } from '@ember/utils';
import Mixin from '@ember/object/mixin';
import { get } from '@ember/object';

export default Mixin.create({
  perform() {
    let value = get(this.model, this.property);

    if (!isEmpty(value)) {
      if (this.options.accept && value !== this.options.accept) {
        this.pushResult(this.options.message);
      } else if (this.options.reject && value === this.options.reject) {
        this.pushResult(this.options.message);
      }
    }
  }
});

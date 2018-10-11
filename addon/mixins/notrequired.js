import { isEmpty } from '@ember/utils';
import Mixin from '@ember/object/mixin';
import { get } from '@ember/object';

export default Mixin.create({

  perform() {
    let value = get(this.model, this.property);
    if (!isEmpty(value)) {
      this.pushResult(this.options.message);
    }
  }
});

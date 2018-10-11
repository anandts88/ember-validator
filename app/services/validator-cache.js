import Service from '@ember/service';
import { set } from '@ember/object';
import { on } from '@ember/object/evented';

export default Service.extend({
  _initialize: on('init', function() {
    set(this, 'cache', {});
  })
});

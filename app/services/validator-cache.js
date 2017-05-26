import Ember from 'ember';

const {
  Service,
  set,
  on
} = Ember;

export default Service.extend({
  _initialize: on('init', function() {
    set(this, 'cache', {});
  })
});

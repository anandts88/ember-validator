import Ember from 'ember';

const { Service, on } = Ember;

export default Service.extend({
  _initialize: on('init', function() {
    this.set('cache', {});
  })
});

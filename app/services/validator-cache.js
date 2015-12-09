import Ember from 'ember';

export default Ember.Service.extend({
  _initialize: Ember.on('init', function() {
    this.set('cache', {});
  })
});

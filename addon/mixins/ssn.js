import Ember from 'ember';
import Messages from 'ember-validator/messages';
import Constants from 'ember-validator/constants';

export default Ember.Mixin.create({
  FORMATS: [
    Constants.SSN_PATTERN1,
    Constants.SSN_PATTERN2,
    Constants.SSN_PATTERN3
  ],

  init: function() {
    this._super();

    if (typeof(this.options) !== 'object') {
      this.set('options', { format1: true });
    }

    if (!this.options.message) {
      this.set('options.message', Messages.render('ssn', this.options));
    }
  },

  perform: function() {
    var value = this.model.get(this.property);
    var test  = false;
    var pattern = Ember.A();
    var format;
    var index;

    if (!Ember.isEmpty(value)) {
      for (var count = 1; count <= this.FORMATS.length; count++) {
        index = count - 1;
        format = this.options['format' + count];
        if (format || this.options.all) {
          pattern.pushObject(this.FORMATS[index]);
        }
      }

      if (this.options.with) {
        pattern.pushObject(this.options.with);
      }

      pattern.forEach(function(arr) {
        if (arr.test(value)) {
          test = true;
        }
      });

      if (!test) {
        this.pushResult(this.options.message);
      }
    }
  }
});

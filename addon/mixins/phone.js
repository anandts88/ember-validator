import Ember from 'ember';
import Messages from 'ember-validator/messages';
import Constants from 'ember-validator/constants';

export default Ember.Mixin.create({
  FORMATS: [
    Constants.PHONE_PATTERN1, // (999) 999 9999
    Constants.PHONE_PATTERN2, // (999) 999-9999
    Constants.PHONE_PATTERN3, // (999)999 9999
    Constants.PHONE_PATTERN4, // (999)999-9999
    Constants.PHONE_PATTERN5, // (999)9999999
    Constants.PHONE_PATTERN6, // 999 999 9999
    Constants.PHONE_PATTERN7, // 999-999-9999
    Constants.PHONE_PATTERN8, // 999.999.9999
    Constants.PHONE_PATTERN9 // 9999999999
  ],

  init: function() {
    this._super();

    if (typeof(this.options) !== 'object') {
      this.set('options', { format1: true });
    }

    if (!this.options.message) {
      this.set('options.message', Messages.render('phone', this.options));
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

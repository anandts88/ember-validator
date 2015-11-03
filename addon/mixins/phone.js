import Ember from 'ember';
import Messages from 'ember-validator/messages';

export default Ember.Mixin.create({
  FORMATS: [
    /^\([0-9]{3}\)\s[0-9]{3}\s[0-9]{4}$/, // (999) 999 9999
    /^\([0-9]{3}\)\s[0-9]{3}\-[0-9]{4}$/, // (999) 999-9999
    /^\([0-9]{3}\)[0-9]{3}\s[0-9]{4}$/, // (999)999 9999
    /^\([0-9]{3}\)[0-9]{3}\-[0-9]{4}$/, // (999)999-9999
    /^\([0-9]{3}\)[0-9]{3}[0-9]{4}$/, // (999)9999999
    /^[0-9]{3}\s[0-9]{3}\s[0-9]{4}$/, // 999 999 9999
    /^[0-9]{3}\-[0-9]{3}\-[0-9]{4}$/, // 999-999-9999
    /^[0-9]{3}\.[0-9]{3}\.[0-9]{4}$/, // 999.999.9999
    /^[0-9]{10}$/ // 9999999999
  ],

  init: function() {
    var pattern = Ember.A();
    var format;
    var index;

    this._super();

    if (typeof(this.options) !== 'object') {
      this.set('options', { format1: true });
    }

    for (var count = 1; count <= this.FORMATS.length; count++) {
      index = count - 1;
      format = this.options['format' + count];
      if (format) {
        pattern.pushObject(this.FORMATS[index]);
      }
    }

    this.set('options.array', pattern);

    if (!this.options.message) {
      this.set('options.message', Messages.render('phone', this.options));
    }

    this.options.array.setEach('message', this.options.message);
  },

  perform: function() {
    var value = this.model.get(this.property);
    var test  = false;

    this.options.array.forEach(function(arr) {
      if (arr.test(value)) {
        test = true;
      }
    });

    if (!test) {
      this.pushResult(this.options.message);
    }
  }
});

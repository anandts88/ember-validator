import Ember from 'ember';
import moment from 'moment';
import Utils from 'ember-validator/utils';

export default Ember.Mixin.create({

  DAYS: {
    sunday: 0,
    saturday: 6
  },

  rules: {
    date: function(value) {
      return value.isValid();
    },

    weekend: function(value) {
      return [this.DAYS.sunday, this.DAYS.saturday].indexOf(value.day()) !== -1;
    },

    notWeekend: function(value) {
      return [this.DAYS.sunday, this.DAYS.saturday].indexOf(value.day()) === -1;
    },

    same: function(value, options) {
      var target;

      target = Utils.toMoment(options.target, options.format);

      if (!this.options.time) {
        target = Utils.setTime(target, 0, 0, 0, 0);
      }

      if (!target.isValid()) {
        return false;
      }

      return value.isSame(target);
    },

    notSame: function(value, options) {
      var target;

      target = Utils.toMoment(options.target, options.format);

      if (!this.options.time) {
        target = Utils.setTime(target, 0, 0, 0, 0);
      }

      if (!target.isValid()) {
        return false;
      }

      return !value.isSame(target);
    },

    before: function(value, options) {
      var target;

      target = Utils.toMoment(options.target, options.format);

      if (!this.options.time) {
        target = Utils.setTime(target, 0, 0, 0, 0);
      }

      if (!target.isValid()) {
        return false;
      }

      return value.before(target);
    },

    after: function(value, options) {
      var target;

      target = Utils.toMoment(options.target, options.format);

      if (!this.options.time) {
        target = Utils.setTime(target, 0, 0, 0, 0);
      }

      if (!target.isValid()) {
        return false;
      }

      return value.after(target);
    },

    beforeSame: function(value, options) {
      var target;

      target = Utils.toMoment(options.target, options.format);

      if (!this.options.time) {
        target = Utils.setTime(target, 0, 0, 0, 0);
      }

      if (!target.isValid()) {
        return false;
      }

      return value.isBefore(target) || value.isSame(target);
    },

    afterSame: function(value, options) {
      var target;

      target = Utils.toMoment(options.target, options.format);

      if (!this.options.time) {
        target = Utils.setTime(target, 0, 0, 0, 0);
      }

      if (!target.isValid()) {
        return false;
      }

      return value.isAfter(target) || value.isSame(target);
    }
  },

  perform: function(value) {
    if (!Ember.isEmpty(value)) {
      value = Utils.toMoment(value, this.options.format);

      if (!this.options.time) {
        value = Utils.setTime(value, 0, 0, 0, 0);
      }

      this.process(value);
    }
  }
});

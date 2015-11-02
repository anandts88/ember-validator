import Ember from 'ember';
import moment from 'moment';
import Validator from 'ember-validator/validators/validator';

export default Validator.extend({
  init: function() {
    this._super();
    if (typeof(this.options) !== 'object') {
      this.set('options', {});
    }

    if (!this.options.messages) {
      this.set('options.messages', {});
    }
  },

  DAYS: {
    sunday: 0,
    saturday: 6
  },

  CHECKS: {
    same: '===',
    before: '<', // before
    after: '>', // after
    beforeSame: '<=', // before or same
    afterSame: '>=' // after or same
  },

  compare: function(source, target, operator) {
    switch (operator) {
      case '===':
        return source.isSame(target);
      case '>=':
        return source.isAfter(target) || source.isSame(target);
      case '<=':
        return source.isBefore(target) || source.isSame(target);
      case '>':
        return source.isAfter(target);
      case '<':
        return source.isBefore(target);
      default:
        return false;
    }
  },

  perform: function() {
    var value = this.model.get(this.property);
    var option;
    var target;
    var comparisonType;

    var transform = function(value, format) {
      var date;
      if (typeof(value) === 'string' && format) {
        date = moment(value, format, true);
      } else {
        date = moment(value);
      }
      return date;
    };

    var setTime = function(date, hours, minutes, seconds, milliseconds) {
      date.hours(hours);
      date.minutes(minutes);
      date.seconds(seconds);
      date.milliseconds(milliseconds);
      return date;
    };

    if (!Ember.isEmpty(value)) {
      value = transform(value, this.options.format);

      if (!this.options.time) {
        value = setTime(value, 0, 0, 0, 0);
      }

      if (!value.isValid()) {
        this.errors.pushObject(this.options.messages.date);
      } else {
        if (this.options.weekend && [this.DAYS.sunday, this.DAYS.saturday].indexOf(value.day()) !== -1) {
          this.errors.pushObject(this.options.messages.weekend);
        } else if (this.options.onlyWeekend && [this.DAYS.sunday, this.DAYS.saturday].indexOf(value.day()) === -1) {
          this.errors.pushObject(this.options.messages.onlyWeekend);
        } else {
          for (var key in this.CHECKS) {
            option = this.options[key];
            if (!option) {
              continue;
            }

            target = transform(option.target, option.format);

            if (!this.options.time) {
              target = setTime(target, 0, 0, 0, 0);
            }

            if (!target.isValid()) {
              continue;
            }

            if (!this.compare(value, target, this.CHECKS[key])) {
              this.errors.pushObject(this.renderMessageFor(key, { date: target.format(option.format) }));
            }
          }
        }
      }
    }
  }
});

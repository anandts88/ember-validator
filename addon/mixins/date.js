import Ember from 'ember';
import { isPlainObject } from 'ember-validator/utils';

const {
  Mixin,
  isNone
} = Ember;

export default Mixin.create({

  DAYS: {
    sunday: 0,
    saturday: 6
  },

  CHECKS: {
    same: '===',
    notSame: '!==',
    before: '<', // before
    after: '>', // after
    beforeSame: '<=', // before or same
    afterSame: '>=' // after or same
  },

  compare(source, target, operator) {
    switch (operator) {
      case '===':
        return source.isSame(target);
      case '!==':
        return !source.isSame(target);
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

  perform() {
    let value = this.model.get(this.property);
    let option;
    let target;
    let format;

    let transform = function(value, format) {
      let date;
      if (typeof(value) === 'string') {
        if (format) {
          date = moment(value, format, true);
        } else {
          date = moment(new Date(value));
        }
      } else {
        date = moment(value);
      }
      return date;
    };

    let setTime = function(date, hours, minutes, seconds, milliseconds) {
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
        this.pushResult(this.options.messages.date);
      } else {
        if (this.options.weekend && [this.DAYS.sunday, this.DAYS.saturday].indexOf(value.day()) !== -1) {
          this.pushResult(this.options.messages.weekend);
        } else if (this.options.onlyWeekend && [this.DAYS.sunday, this.DAYS.saturday].indexOf(value.day()) === -1) {
          this.pushResult(this.options.messages.onlyWeekend);
        } else {
          for (let key in this.CHECKS) {
            option = this.options[key];
            if (!option) {
              continue;
            }

            if (isPlainObject(option)) {
              format = option.format;
              target = transform(option.target, format);
            } else {
              target = transform(option);
            }

            if (!target.isValid()) {
              continue;
            }

            if (!this.options.time) {
              target = setTime(target, 0, 0, 0, 0);
            }

            if (isNone(format)) {
              format = 'MMM/DD/YYYY';
            }

            if (!this.compare(value, target, this.CHECKS[key])) {
              this.pushResult(this.options.messages[key], { date: target.format(format) });
            }
          }
        }
      }
    }
  }
});

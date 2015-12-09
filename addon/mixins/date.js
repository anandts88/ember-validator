import Ember from 'ember';
import moment from 'moment';
import { toMoment, setTime } from 'ember-validator/utils';

const { Mixin, isEmpty } = Ember;

export default Mixin.create({

  DAYS: {
    sunday: 0,
    saturday: 6
  },

  rules: {
    date(value) {
      return value.isValid();
    },

    weekend(value) {
      const { sunday, saturday } = this.DAYS;
      return [sunday, saturday].indexOf(value.day()) !== -1;
    },

    notWeekend(value) {
      const { sunday, saturday } = this.DAYS;
      return [sunday, saturday].indexOf(value.day()) === -1;
    },

    same(value, options) {
      const format = options.format || this.options.format;
      let target;

      target = toMoment(options.target, format);

      if (!this.options.time) {
        target = setTime(target, 0, 0, 0, 0);
      }

      if (!target.isValid()) {
        return false;
      }

      if (format) {
        options.target = target.format(format);
      }

      return value.isSame(target);
    },

    notSame(value, options) {
      const format = options.format || this.options.format;
      let target;

      target = toMoment(options.target, format);

      if (!this.options.time) {
        target = setTime(target, 0, 0, 0, 0);
      }

      if (!target.isValid()) {
        return false;
      }

      if (format) {
        options.target = target.format(format);
      }

      return !value.isSame(target);
    },

    before(value, options) {
      const format = options.format || this.options.format;
      let target;

      target = toMoment(options.target, format);

      if (!this.options.time) {
        target = setTime(target, 0, 0, 0, 0);
      }

      if (!target.isValid()) {
        return false;
      }

      if (format) {
        options.target = target.format(format);
      }

      return value.isBefore(target);
    },

    after(value, options) {
      const format = options.format || this.options.format;
      let target;

      target = toMoment(options.target, format);

      if (!this.options.time) {
        target = setTime(target, 0, 0, 0, 0);
      }

      if (!target.isValid()) {
        return false;
      }

      if (format) {
        options.target = target.format(format);
      }

      return value.isAfter(target);
    },

    beforeSame(value, options) {
      const format = options.format || this.options.format;
      let target;

      target = toMoment(options.target, format);

      if (!this.options.time) {
        target = setTime(target, 0, 0, 0, 0);
      }

      if (!target.isValid()) {
        return false;
      }

      if (format) {
        options.target = target.format(format);
      }

      return value.isBefore(target) || value.isSame(target);
    },

    afterSame(value, options) {
      const format = options.format || this.options.format;
      let target;

      target = toMoment(options.target, format);

      if (!this.options.time) {
        target = setTime(target, 0, 0, 0, 0);
      }

      if (!target.isValid()) {
        return false;
      }

      if (format) {
        options.target = target.format(format);
      }

      return value.isAfter(target) || value.isSame(target);
    }
  },

  perform(value) {
    if (!isEmpty(value)) {
      value = toMoment(value, this.options.format);

      if (!this.options.time) {
        value = setTime(value, 0, 0, 0, 0);
      }

      this.process(value);
    }
  }
});

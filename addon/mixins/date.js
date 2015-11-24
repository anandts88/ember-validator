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
      let target;

      target = toMoment(options.target, options.format);

      if (!this.options.time) {
        target = setTime(target, 0, 0, 0, 0);
      }

      if (!target.isValid()) {
        return false;
      }

      return value.isSame(target);
    },

    notSame(value, options) {
      let target;

      target = toMoment(options.target, options.format);

      if (!this.options.time) {
        target = setTime(target, 0, 0, 0, 0);
      }

      if (!target.isValid()) {
        return false;
      }

      return !value.isSame(target);
    },

    before(value, options) {
      let target;

      target = toMoment(options.target, options.format);

      if (!this.options.time) {
        target = setTime(target, 0, 0, 0, 0);
      }

      if (!target.isValid()) {
        return false;
      }

      return value.before(target);
    },

    after(value, options) {
      let target;

      target = toMoment(options.target, options.format);

      if (!this.options.time) {
        target = setTime(target, 0, 0, 0, 0);
      }

      if (!target.isValid()) {
        return false;
      }

      return value.after(target);
    },

    beforeSame(value, options) {
      let target;

      target = toMoment(options.target, options.format);

      if (!this.options.time) {
        target = setTime(target, 0, 0, 0, 0);
      }

      if (!target.isValid()) {
        return false;
      }

      return value.isBefore(target) || value.isSame(target);
    },

    afterSame(value, options) {
      let target;

      target = toMoment(options.target, options.format);

      if (!this.options.time) {
        target = setTime(target, 0, 0, 0, 0);
      }

      if (!target.isValid()) {
        return false;
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

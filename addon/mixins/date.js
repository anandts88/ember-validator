import Ember from 'ember';

const {
  Mixin,
  isNone
} = Ember;

export default Mixin.create({
  DAYS: {
    sunday: 0,
    saturday: 6
  },

  setTime(date, hours, minutes, seconds, milliseconds) {
    date.hours(hours);
    date.minutes(minutes);
    date.seconds(seconds);
    date.milliseconds(milliseconds);
    return date;
  },

  transform(value, format, time) {
    let date;
    if (typeof(value) === 'string') {
      if (!isNone(format)) {
        date = moment(value, format, true);
      } else {
        date = moment(new Date(value));
      }
    } else {
      date = moment(value);
    }

    // If the option `time` is not set to true then time is neglected from date validation.
    if (!time) {
      date.hours(0);
      date.minutes(0);
      date.seconds(0);
      date.milliseconds(0);
    }

    return date;
  },

  date(value) {
    let result = value.isValid();

    if (!result) {
      return this.message('date');
    }
  },

  weekend(value) {
    let { weekend } = this.options;
    let result;

    if (isNone(weekend)) {
      return;
    }

    result = value.day() === DAYS.sunday || value.day() === DAYS.saturday;

    if (!result) {
      return this.message('weekend');
    }
  },

  noweekend(value) {
    let { noweekend } = this.options;
    let result;

    if (isNone(noweekend)) {
      return;
    }

    result = value.day() !== DAYS.sunday && value.day() !== DAYS.saturday;

    if (!result) {
      return this.message('noweekend');
    }
  },

  same(value) {
    let { same, time } = this.options;
    let result;

    if (isNone(same)) {
      return;
    }

    if (typeof(same) !== 'object') {
      same = { target: same };
    }

    same = this.transform(same.target, same.format, time);

    result = value.isSame(same);

    if (!result) {
      return this.message('same');
    }
  },

  notSame(value) {
    let { notSame, time } = this.options;
    let result;

    if (isNone(notSame)) {
      return;
    }

    if (typeof(notSame) !== 'object') {
      notSame = { target: notSame };
    }

    notSame = this.transform(notSame.target, notSame.format, time);

    result = !value.isSame(notSame);

    if (!result) {
      return this.message('notSame');
    }
  },

  before(value) {
    let { before, time } = this.options;
    let result;

    if (isNone(before)) {
      return;
    }

    if (typeof(before) !== 'object') {
      before = { target: before };
    }

    before = this.transform(before.target, before.format, time);

    result = value.isBefore(before);

    if (!result) {
      return this.message('before');
    }
  },

  after(value) {
    let { after, time } = this.options;
    let result;

    if (isNone(after)) {
      return;
    }

    if (typeof(after) !== 'object') {
      after = { target: after };
    }

    after = this.transform(after.target, after.format, time);

    result = value.isAfter(after);

    if (!result) {
      return this.message('after');
    }
  },

  afterSame(value) {
    let { afterSame, time } = this.options;
    let result;

    if (isNone(afterSame)) {
      return;
    }

    if (typeof(afterSame) !== 'object') {
      afterSame = { target: afterSame };
    }

    afterSame = this.transform(afterSame.target, afterSame.format, time);

    result = value.isAfter(afterSame) || value.isSame(afterSame);

    if (!result) {
      return this.message('afterSame');
    }
  },

  perform(value) {
    let { format, time } = this.options;
    let result;

    if (!isNone(value)) {
      value = this.transform(value, format, time);

      result = this.date(value);
      if (!isNone(result)) {
        return result;
      }

      result = this.weekend(value);
      if (!isNone(result)) {
        return result;
      }

      result = this.noweekend(value);
      if (!isNone(result)) {
        return result;
      }

      result = this.same(value);
      if (!isNone(result)) {
        return result;
      }

      result = this.notSame(value);
      if (!isNone(result)) {
        return result;
      }

      result = this.after(value);
      if (!isNone(result)) {
        return result;
      }

      result = this.afterSame(value);
      if (!isNone(result)) {
        return result;
      }

      result = this.before(value);
      if (!isNone(result)) {
        return result;
      }

      result = this.beforeSame(value);
      if (!isNone(result)) {
        return result;
      }
    }
  }
});

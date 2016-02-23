import Ember from 'ember';

const {
  Mixin
} = Ember;

export default Mixin.create({
  perform() {
    let value = this.model.get(this.property);
    let specialTest;
    let array;
    let arr;

    if (!Ember.isEmpty(value)) {
      if (this.options.hasSpecial) {
        if (typeof(this.options.hasSpecial) === 'string') {
          specialTest = new RegExp('(?=.*[' + this.options.hasSpecial + '])');
        } else if (this.options.hasSpecial.constructor !== RegExp) {
          specialTest = this.options.hasSpecial;
        } else {
          specialTest = new RegExp('(?=.*[!@$%^&*()-+_=~`{}:;"\'<>,.|?])');
        }
      }

      if (this.options.hasAlphabet && !/(?=.*[a-z]|[A-Z])/.test(value)) {
        this.pushResult(this.options.messages.hasAlphabets);
      } else if (this.options.hasUpperCase && !/(?=.*[A-Z])/.test(value)) {
        this.pushResult(this.options.messages.hasUpperCase);
      } else if (this.options.hasLowerCase && !/(?=.*[a-z])/.test(value)) {
        this.pushResult(this.options.messages.hasLowerCase);
      } else if (this.options.hasNumber && !/(?=.*\d)/.test(value)) {
        this.pushResult(this.options.messages.hasNumber);
      } else if (this.options.hasSpecial && !specialTest.test(value)) {
        this.pushResult(this.options.messages.hasSpecial);
      } else if (this.options.hasNoSpecial && !/^[a-zA-Z0-9]+$/.test(value)) {
        this.pushResult(this.options.messages.hasNoSpecial);
      } else if (this.options.hasNoSpace && /[\s]/.test(value)) {
        this.pushResult(this.options.messages.hasNoSpace);
      } else if (this.options.with && !this.options.with.test(value)) {
        this.pushResult(this.options.messages.with);
      } else if (this.options.without && this.options.without.test(value)) {
        this.pushResult(this.options.messages.without);
      } else if (!Ember.isEmpty(this.options.array)) {
        array = this.options.array;
        for (let count = 0 ; count < array.length ; count++) {
          arr = array[count];
          if (arr.with && !arr.with.test(value)) {
            this.pushResult(arr.message || this.options.messages.array);
            break;
          } else if (arr.without && arr.without.test(value)) {
            this.pushResult(arr.message || this.options.messages.array);
            break;
          }
        }
      }
    }
  }
});

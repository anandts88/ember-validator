import Ember from 'ember';
import EmberValidator from 'ember-validator';

const { Route, RSVP } = Ember;
const { Promise } = RSVP;

export default Route.extend(EmberValidator, {
  model() {
    return new Promise((resolve) => {
      $.getJSON('./json/date.json', (response) => {
        resolve(Ember.Object.create({
          validator: response,
          date: null
        }));
      });
    });
  },

  actions: {
    submit() {
      const model = this.get('controller.model');
      const validations = {
        date: {
          required: true,
          date: {
            format: 'MM/DD/YYYY',
            notWeekend: true,
            after: new Date(),
            beforeSame: moment().add(10, 'days')
          }
        }
      };

      model.set('validationResult', null);
      this.validateMap({ model, validations }).then(() => {
        alert('Valid');
      }).catch((validationResult) => {
        model.set('validationResult', validationResult);
      });
    }
  }
});

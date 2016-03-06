import Ember from 'ember';
import EmberValidator from 'ember-validator';

const { Route, RSVP } = Ember;
const { Promise } = RSVP;

export default Route.extend(EmberValidator, {
  model() {
    return new Promise((resolve) => {
      $.getJSON('./json/notrequired.json', (response) => {
        resolve(Ember.Object.create({
          validator: response,
          userName: 'This must be empty.'
        }));
      });
    });
  },

  actions: {
    submit() {
      const model = this.get('controller.model');
      const validations = {
        userName: {
          notrequired: 'This field must be empty.'
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

import Ember from 'ember';
import EmberValidator from 'ember-validator';

const { Route, RSVP } = Ember;
const { Promise } = RSVP;

export default Route.extend(EmberValidator, {
  model() {
    return new Promise((resolve) => {
      $.getJSON('./json/zip.json', (response) => {
        resolve(Ember.Object.create({
          validator: response
        }));
      });
    });
  },

  actions: {
    submit() {
      const model = this.get('controller.model');
      const validations = {
        field: {
          required: 'Please enter value.',
          zip: 'Please enter valid zip code (NNNNN or NNNNN-NNNN).'
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

import Ember from 'ember';
import EmberValidator from 'ember-validator';

const { Route, RSVP } = Ember;
const { Promise } = RSVP;

export default Route.extend(EmberValidator, {
  model() {
    return new Promise((resolve) => {
      $.getJSON('./json/phone.json', (response) => {
        resolve(Ember.Object.create({
          validator: response,
          field: null
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
          phone: {
            format2: true,
            format9: true,
            message: 'Please enter valid phone number NNNNNNNNNN or (NNN) NNN-NNNN.'
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

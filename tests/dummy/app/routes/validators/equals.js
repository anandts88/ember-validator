import Ember from 'ember';
import EmberValidator from 'ember-validator';

const { Route, RSVP } = Ember;
const { Promise } = RSVP;

export default Route.extend(EmberValidator, {
  model() {
    return new Promise((resolve) => {
      $.getJSON('./json/equals.json', (response) => {
        resolve(Ember.Object.create({
          validator: response,
          field1: null,
          field2: null
        }));
      });
    });
  },

  actions: {
    submit() {
      const model = this.get('controller.model');
      const validations = {
        field1: {
          required: 'Please enter value.',
          equals: {
            ignoreCase: true,
            accept: 'cat',
            message: 'Must be cat'
          }
        },

        field2: {
          required: 'Please enter value.',
          equals: {
            reject: 'dog',
            message: 'Must not be dog'
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

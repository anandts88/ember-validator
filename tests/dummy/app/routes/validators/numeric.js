import Ember from 'ember';
import EmberValidator from 'ember-validator';

const { Route, RSVP } = Ember;
const { Promise } = RSVP;

export default Route.extend(EmberValidator, {
  model() {
    return new Promise((resolve) => {
      $.getJSON('./json/numeric.json', (response) => {
        resolve(Ember.Object.create({
          validator: response,
          field1: null,
          field2: null,
          field3: null,
          field4: null
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
          numeric: true
        },

        field2: {
          required: 'Please enter value.',
          numeric: {
            integer: true
          }
        },

        field3: {
          required: 'Please enter value.',
          numeric: {
            greaterThan: 4,
            lessThanOrEqualTo: 100,
            messages: {
              greaterThan: 'Please enter value greater than 4',
              lessThanOrEqualTo: 'Please enter value less than or equal to 100'
            }
          }
        },

        field4: {
          required: 'Please enter value.',
          numeric: {
            between: [10, 20]
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

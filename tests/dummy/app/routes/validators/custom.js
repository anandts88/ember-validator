import Ember from 'ember';
import EmberValidator, { inlineValidator } from 'ember-validator';

const { Route, RSVP } = Ember;
const { Promise } = RSVP;

export default Route.extend(EmberValidator, {
  model() {
    return new Promise((resolve) => {
      $.getJSON('./json/custom.json', (response) => {
        resolve(Ember.Object.create({
          validator: response,
          field1: 4,
          field2: null
        }));
      });
    });
  },

  actions: {
    submit() {
      const model = this.get('controller.model');
      const validations = {
        field2: {
          required: 'Please enter value.',
          custom: inlineValidator((model, property) => {
            const value = model.get(property);
            if (Number(value) !== model.get('field1')) {
              return `Value must be ${model.get('field1')}`;
            }
          })
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

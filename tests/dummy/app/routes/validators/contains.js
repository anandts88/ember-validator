import Ember from 'ember';
import EmberValidator from 'ember-validator';

const { Route, RSVP } = Ember;
const { Promise } = RSVP;

export default Route.extend(EmberValidator, {
  model() {
    return new Promise((resolve) => {
      $.getJSON('./json/contains.json', (response) => {
        resolve(Ember.Object.create({
          validator: response,
          field1: null,
          field2: null,
          toInclude: ['A', 'B', 'C', 'D'],
          toExludeRange: [4, 9]
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
          contains: {
            include: model.get('toInclude'),
            messages: {
              include: `Must contains only ${model.get('toInclude')}`
            }
          }
        },

        field2: {
          required: 'Please enter value.',
          contains: {
            excludeRange: model.get('toExludeRange'),
            messages: {
              excludeRange: `Must not contains anything within range ${model.get('toExludeRange')}`
            }
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

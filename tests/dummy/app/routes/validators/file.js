import Ember from 'ember';
import EmberValidator from 'ember-validator';

const { Route, RSVP } = Ember;
const { Promise } = RSVP;

export default Route.extend(EmberValidator, {
  model() {
    return new Promise((resolve) => {
      $.getJSON('./json/file.json', (response) => {
        resolve(Ember.Object.create({
          validator: response,
          myFiles: null
        }));
      });
    });
  },

  actions: {
    submit() {
      const model = this.get('controller.model');
      const validations = {
        myFiles: {
          required: true,
          file: {
            extension: ['jpg', 'png'],
            sizeLessThanEqualTo: 1024 * 1024, // In bytes
            messages: {
              extension: 'Select jpg or png files only',
              sizeLessThanEqualTo: 'File size must be less than or equal to 1MB'
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

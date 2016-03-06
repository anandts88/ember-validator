import Ember from 'ember';
import EmberValidator from 'ember-validator';

const { Route, RSVP } = Ember;
const { Promise } = RSVP;

export default Route.extend(EmberValidator, {
  model() {
    return new Promise((resolve) => {
      $.getJSON('./json/pattern.json', (response) => {
        resolve(Ember.Object.create({
          validator: response,
          password: null,
          alphabet: null,
          number: null
        }));
      });
    });
  },

  actions: {
    submit() {
      const model = this.get('controller.model');
      const validations = {
        password: {
          required: 'Please enter value.',
          pattern: {
            hasAlphabet: true,
            hasUpperCase: true,
            hasLowerCase: true,
            hasNumber: true,
            hasNoSpecial: true,
            hasNoSpace: true,
            messages: {
              hasAlphabet: 'Must contains atleast one alphabets',
              hasUpperCase: 'Must contains atleast one upper case alphabets',
              hasLowerCase: 'Must contains atleast one lower case alphabets',
              hasNumber: 'Must contains atleast one number',
              hasNoSpecial: 'Must not contains any special characters',
              hasNoSpace: 'Must not contains space'
            }
          }
        },

        alphabet: {
          required: 'Please enter value.',
          pattern: {
            with: /^([a-zA-Z])+$/,
            message: 'Must contains only alphabets.'
          }
        },

        number: {
          required: 'Please enter value.',
          pattern: {
            array: [
              { with: /^([0-9])+$/ },
              { without: /(?=.*[2])/ }
            ],
            messages: {
              array: [
                'Must contains numbers.',
                'Must not contains 2.'
              ]
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

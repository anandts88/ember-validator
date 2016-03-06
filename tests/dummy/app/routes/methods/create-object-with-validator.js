import Ember from 'ember';
import EmberValidator from 'ember-validator';

const { Route } = Ember;

export default Route.extend(EmberValidator, {
  validations: {
    userName: {
      required: true,
      length: {
        minimum: 4,
        maximum: 15
      }
    },

    password: {
      required: true,
      length: {
        minimum: 4,
        maximum: 15
      },
      pattern: {
        hasAlphabet: true,
        hasUpperCase: true,
        hasLowerCase: true,
        hasNumber: true,
        hasNoSpace: true
      }
    }
  },

  model() {
    const validations = this.get('validations');

    return this.createObjectWithValidator(Ember.Object.extend({
      userName: null,
      password: null
    }), validations, true);
  },

  actions: {
    submit() {
      const model = this.get('controller.model');
      const validations = this.get('validations');

      model.set('validationResult', null);
      this.validateMap({ model, validations }).then(() => {
        alert('Valid');
      }).catch((validationResult) => {
        model.set('validationResult', validationResult);
      });
    }
  }
});

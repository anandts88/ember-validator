import Ember from 'ember';
import EmberValidator from 'ember-validator';

const {
  Controller,
  set
} = Ember;

export default Controller.extend(EmberValidator, {

  actions: {

    login() {
      var validations = {
        userName: {
          required: {
            message: "Please enter user name"
          }
        },

        password: {
          required: {
            message: "Please enter password"
          }
        }
      };


      var promise = this.validateMap({
        model: this.model,
        validations
      });

      set(this, 'validationResult', undefined);

      promise.then(() => {
        alert('Valid');
      }).catch((validationResult) => {
        set(this, 'validationResult', validationResult);
      });

    }
  }

});

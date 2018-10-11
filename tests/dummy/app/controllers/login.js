import Controller from '@ember/controller';
import { set } from '@ember/object';
import EmberValidator from 'ember-validator';

export default Controller.extend(EmberValidator, {

  actions: {

    login() {
      var validations = {
        userName: {
          required: {
            message: "Please enter user name"
          },
          length: {
            minimum: 4,
            messages: {
              minimum: 'Username is minimum of 4 characters'
            }
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

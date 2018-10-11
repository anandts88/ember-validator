import Route from '@ember/routing/route';

export default Route.extend({

  model() {
    return {
      userName: undefined,
      password: undefined
    };
  }

});

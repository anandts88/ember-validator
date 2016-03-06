import Ember from 'ember';
import { scroll } from 'dummy/utils/utility';

const { Route } = Ember;

export default Route.extend({
  actions: {
    willTransition() {
      scroll();
    }
  }
});

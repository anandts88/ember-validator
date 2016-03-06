import Ember from 'ember';
import config from './config/environment';

const { Router } = Ember;

const AppRouter = Router.extend({
  location: config.locationType
});

AppRouter.map(function() {
  this.route('overview', { path: '/' });
  this.route('howtouse');

  // Start Methods
  this.route('methods', {
    resetNamespace: true
  }, function() {
    this.route('validate-map');
    this.route('create-object-with-validator');
    this.route('computed-validate-map');
    this.route('validate');
  });
  // End Methods

  // Start validators
  this.route('validators', {
    resetNamespace: true
  }, function() {
    this.route('required');
    this.route('notrequired');
    this.route('boolean');
    this.route('contains');
    this.route('date');
    this.route('numeric');
    this.route('length');
    this.route('pattern');
    this.route('equals');
    this.route('email');
    this.route('zip');
    this.route('ssn');
    this.route('file');
    this.route('phone');
    this.route('custom');
  });
  // End validators

  // Start Conditional validator
  this.route('conditional', {
    resetNamespace: true
  }, function() {
    this.route('property');
    this.route('rule');
  });
  // End Conditional validator

  this.route('missing', { path: '/*path' });
});

export default AppRouter;

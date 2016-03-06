import Ember from 'ember';

const { Component, computed, isEmpty } = Ember;
const { alias } = computed;

export default Component.extend({
  validator: null,
  rules: alias('validator.rules'),
  options: alias('validator.options'),
  messages: alias('validator.messages'),

  isRuleHasOption: computed('rules.[]', function() {
    const rules = this.get('rules');
    return _.some(rules, (rule) => !isEmpty(rule.option));
  })
});

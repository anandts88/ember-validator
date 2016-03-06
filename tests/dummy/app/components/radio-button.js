import Ember from 'ember';

const { Component, computed } = Ember;

export default Component.extend({
  tagName: 'input',
  type: 'radio',

  attributeBindings: [
    'checked',
    'disabled',
    'name',
    'required',
    'type',
    'value'
  ],

  checked: computed('group', 'value', function() {
    return this.get('group') === this.get('value');
  }).readOnly(),

  doOnChange() {
    const onChange = this.attrs.onChange;
    if (onChange) {
      onChange(this.get('value'));
    }
  },

  change() {
    let value = this.get('value');
    let group = this.get('group');

    if (group !== value) {
      this.set('group', value);
      Ember.run.once(this, 'doOnChange');
    }
  }
});

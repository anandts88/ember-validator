import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({
  tagName: 'nav',

  menus: Ember.A([
    Ember.Object.create({ name: 'Overview', route: 'overview', isOpen: false }),
    Ember.Object.create({ name: 'How to use?', route: 'howtouse', isOpen: false }),
    Ember.Object.create({
      name: 'Methods',
      isOpen: false,
      submenus: Ember.A([
        { name: 'validateMap', route: 'methods.validate-map' },
        { name: 'createObjectWithValidator', route: 'methods.create-object-with-validator' }
      ])
    }),
    Ember.Object.create({
      name: 'Validators',
      isOpen: false,
      submenus: Ember.A([
        { name: 'required', route: 'validators.required' },
        { name: 'notrequired', route: 'validators.notrequired' },
        { name: 'boolean', route: 'validators.boolean' },
        { name: 'equals', route: 'validators.equals' },
        { name: 'contains', route: 'validators.contains' },
        { name: 'length', route: 'validators.length' },
        { name: 'date', route: 'validators.date' },
        { name: 'numeric', route: 'validators.numeric' },
        { name: 'pattern', route: 'validators.pattern' },
        { name: 'email', route: 'validators.email' },
        { name: 'phone', route: 'validators.phone' },
        { name: 'zip', route: 'validators.zip' },
        { name: 'ssn', route: 'validators.ssn' },
        { name: 'custom', route: 'validators.custom' }
      ])
    }),
    Ember.Object.create({
      name: 'Conditional Validators',
      isOpen: false,
      submenus: Ember.A([
        { name: 'For property', route: 'conditional.property' },
        { name: 'For validation rule', route: 'conditional.rule' }
      ])
    })
  ]),

  actions: {
    toogleMain(menu) {
      const isOpen = menu.get('isOpen');
      this.menus.setEach('isOpen', false);
      if (!isOpen) {
        menu.toggleProperty('isOpen');
      }
    }
  }
});

import Ember from 'ember';

export default {
  render: function(attribute, context) {
    if (Ember.I18n) {
      return Ember.I18n.t('errors.' + attribute, context);
    } else {
      var regex = new RegExp("{{(.*?)}}"),
          attributeName = "";
      if (regex.test(this.defaults[attribute])) {
        attributeName = regex.exec(this.defaults[attribute])[1];
      }
      return this.defaults[attribute].replace(regex, context[attributeName]);
    }
  },
  defaults: {
    include: "is not included in the list",
    exclude: "is reserved",
    required: "can't be blank",
    notrequired: "must be blank",
    maximum: "is too long (maximum is {{count}} characters)",
    minimum: "is too short (minimum is {{count}} characters)",
    is: "is the wrong length (should be {{count}} characters)",
    invalid: "is invalid",
    equals: "must be accepted",
    empty: "can't be empty",
    numeric: "is not a number",
    integer: "must be an integer",
    greaterThan: "must be greater than {{count}}",
    greaterThanOrEqualTo: "must be greater than or equal to {{count}}",
    equalTo: "must be equal to {{count}}",
    lessThan: "must be less than {{count}}",
    lessThanOrEqualTo: "must be less than or equal to {{count}}",
    otherThan: "must be other than {{count}}",
    odd: "must be odd",
    even: "must be even",
    url: "is not a valid URL"
  }
};

import Validator from 'ember-validator/validators/validator';

export default Validator.extend({
  init() {
    let pattern = '^';

    this._super();

    // protocol identifier
    if (this.options.protocols) {
      pattern += `(?:(?:${this.options.protocols.join('|')})://)`;
    } else {
      pattern += '(?:(?:https?|ftp)://)';
    }

    // user:pass authentication
    pattern += '(?:\\S+(?::\\S*)?@)?';

    pattern += "(?:";
    // ip address
    // IP address exclusion
    // private & local networks
    pattern += "(?!(?:10|127)(?:\\.\\d{1,3}){3})";
    pattern += "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})";
    pattern += "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})";
    // IP address dotted notation octets
    // excludes loopback network 0.0.0.0
    // excludes reserved space >= 224.0.0.0
    // excludes network & broacast addresses
    // (first & last IP address of each class)
    pattern += "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])";
    pattern += "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}";
    pattern += "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))";

    pattern += "|" +
    // host name
    pattern += "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)";
      // domain name
    pattern += "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*";
      // TLD identifier
    pattern += "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))";
      // TLD may end with dot
    pattern += "\\.?";
    pattern += ")";
    // port number
    pattern += "(?::\\d{2,5})?";
    // resource path
    pattern += "(?:[/?#]\\S*)?";
    pattern += "$";
  },

  rules: {
    url: function(value) {
      var pattern = /^((http|https|ftp)?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i;

      if (this.options.constructor === RegExp ||
        (this.options.with && this.options.with.constructor === RegExp)) {
        pattern = options;
      }

      return pattern.test(value);
    }
  },

  perform: function(value) {
    if (!Ember.isEmpty(value)) {
      this.process(value);
    }
  }
});

# Ember Validator #

## Installation ##

Please add `ember-validator` to your `package.json`:

```javascript
"devDependencies": {
  ...
  "ember-validator": "1.1.2"
}
```

### For Non CLI applications ###

Use [Ember Validator Non CLI library](https://github.com/anandts88/ember-validator/blob/master/ember-validator-non-cli.js) for non CLI applications.
This depends on [moment library](http://momentjs.com/), so please include [moment.js](http://momentjs.com/downloads/moment.min.js) along with this library.


## Issues or Help? ##

If you find a bug or need help [please open an issue on our Github](https://github.com/anandts88/ember-validator/issues).

## How to use? ##

Import `EmberValidator` mixin and use this in any `Ember Object` (route, controller, service).

```javascript
import EmberValidator from 'ember-validator';

export default Ember.Controller.extend(EmberValidations, {});
```

If you want to add this mixin in a regular `Ember.Object` which dont have container support, then
use initilizer to reopen `EmberValidator` and assing container instance to it.

```javascript
/**
  initializers/ember-validator.js
*/
import Ember from 'ember';
import EmberValidator from 'ember-validator';

export default {
  name: 'ember-validator-reopen',
  initialize: function(container) {
    EmberValidator.reopen({
      container: container
    });
  }
}

Ember.Object.extend(EmberValidator, {});
```

`EmberValidator` exposes two functions to perform validation.
1. `validateMap`
2. `validate`

### validateMap ###

This functions is used to validate any object.

```javascript
import Ember from 'ember';
import EmberValidator from 'ember-validator';

export default Ember.Controller.extend(EmberValidations, {

  actions: {
    var obj = Ember.Object.create({
      userName: null,
      password: null
    });

    var rules = {
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
      model: obj, // Pass the object you want to validate
      validations: rules // Define validation rules in the form of JSON,
    });

    promise.then(function() {
      // When no errors or object is valid.
    }).catch(function(result) {
      // When there are errors or object is in valid.
      // result.get('errors') -> Returns all error messages
      // result.get('errors') -> Returns first message
      // result.get('isValid') -> Returns true if the object is valid
      // result.get('isInvalid') -> Returns true if the object is invalid
      // result.get('hasError') -> Returns true if the object has errors

      // result.get('userName.errors') -> Returns all error messages related with userName property
      // result.get('userName.errors') -> Returns first message related with userName property
      // result.get('userName.isValid') -> Returns true if userName property is valid
      // result.get('userName.isInvalid') -> Returns true if userName property is invalid
      // result.get('userName.hasError') -> Returns true if userName property has errors
    }).finally(function() {
      // Regardless object is valid or invalid.
    });
  }

});
```

### validate ###

Use this function if you want to directly validate Ember Object


```javascript
import Ember from 'ember';
import EmberValidator from 'ember-validator';

export default Ember.Controller.extend({

  actions: {
    var obj = Ember.Object.create(EmberValidations, { // Dont forget to reopen mixin to add container.
      userName: null,
      password: null
    });

    var rules = {
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

    var promise = obj.validate({
      validations: rules // Define validation rules in the form of JSON,
    });

    promise.then(function() {
      // When no errors or object is valid.
    }).catch(function(result) {
      // When there are errors or object is in valid.
    }).finally(function() {
      // Regardless object is valid or invalid.
    });
  }
});
```

Both `validateMap` and `validate` is returning back promise.
If you dont want a promise, but only wants the result, then please pass flag `noPromise` as `true`

```javascript
  var result = obj.validate({
    validations: rules,
    noPromise: true
  });

  var result = this.validateMap({
    model: obj,
    validations: rules,
    noPromise: true
  });

  if (result.get('isValid')) {
    // When object is valid
  } else {
    // When object is invalid
  }

  // result.get('errors') -> Returns all error messages
  // result.get('errors') -> Returns first message
  // result.get('isValid') -> Returns true if the object is valid
  // result.get('isInvalid') -> Returns true if the object is invalid
  // result.get('hasError') -> Returns true if the object has errors

  // result.get('userName.errors') -> Returns all error messages related with userName property
  // result.get('userName.errors') -> Returns first message related with userName property
  // result.get('userName.isValid') -> Returns true if userName property is valid
  // result.get('userName.isInvalid') -> Returns true if userName property is invalid
  // result.get('userName.hasError') -> Returns true if userName property has errors
```

## Validators ##

### required ###

Validate the property has value.

#### Options ####

  * `message` - Error message returned when required validation fails.

```javascript
  required: { message: 'Please enter a value' }
```

### notrequired ###

Validate the property dont have value.

#### Options ####

  * `message` - Error message returned when notrequired validation fails.

```javascript
  notrequired: { message: 'Value must be empty' }
```

### equals ###

Validate whether the property equals to the specified value.

#### Options ####
  * `message` - Error message returned when equals validation fails.
  * `accept` - The value to be compared.

```javascript
  equals: {
    message: 'Only myusername is accepted',
    accept: 'myusername'
  }
```

### contains ###
Validate property with array of values, and the array of values contains/notcontains the property.

#### Options ####
  * `exclude`:  An array of values that are excluded
  * `exludeRange`: An array of lower and upper bound, and values within this range is excluded.
  * `include` - An array of values that are excluded
  * `includeRange` - An array of lower and upper bound, and values within this range is excluded.

##### Messages #####
  * `exclude`:  Error message returned when exclude validation fails.
  * `exludeRange`: Error message returned when exludeRange validation fails.
  * `include` - Error message returned when include validation fails.
  * `includeRange` - Error message returned when includeRange validation fails.

```javascript
contains: {
  exclude: ['A', 'B', 'C'],
  messages: {
    exclude: 'Please enter valid value'
  }
}

contains: {
  excludeRange: [1, 10],
  messages: {
    excludeRange: 'cannot be between 1 and 10'
  }
}

contains: {
  include: ['A', 'B', 'C'],
  messages: {
    include: 'Please enter valid value'
  }
}

contains: {
  includeRange: [1, 10],
  messages: {
    includeRange: 'cannot be between 1 and 10'
  }
}
```

### pattern ###
Validate poperty with passed regular expression

#### Options ####
  * `with` - The regular expression to test with
  * `without` - The regular expression to inverse test
  * `array` - Array of regular expression, when you want to validate more than one regex
  * `messages` - Error message for with and without validation

#### messages ####
  * `with` - Error message returned when with validation fails.
  * `without` - Error message returned when without validation fails.

```javascript
  pattern: {
    with: /^([a-zA-Z])+$/,
    messages: {
      with: 'Must be alphabets'  
    }}
  }

  pattern: {
    without: /^([a-zA-Z])+$/,
    messages: {
      without: 'Must not be alphabets'  
    }}
  }

  pattern: {
    array: [
      {
        with: /^([a-zA-Z])+$/,
        message: 'Must be alphabets'  
      },
      {
        without: /^([a-zA-Z])+$/, // Different expression
        message: 'Must be alphabets' // Message to be displayed
      }
    ]
  }
```

### email ###

Validate whether the property is email.

#### Options ####

  * `with` - The regular expression to test with, if you are not happy with the default email pattern.
  * `message` - Error message returned when email validation fails.

```javascript
  email: {
    message: "Invalid email"
  }

  email: {
    with: /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    message: "Invalid email"
  }
```

### ssn ###

Validate whether the property is ssn. Default pattern of ssn NNN-NN-NNNN. change this by setting `with` property

#### Options ####

  * `with` - The regular expression to test with, if you are not happy with the default ssn pattern.
  * `message` - Error message returned when email validation fails.

```javascript
  ssn: {
    message: "Invalid ssn"
  }
```

### zip ###

Validate whether the property is valid zip. Default pattern of ssn NNNNN or NNNNN-NNNN. change this by setting `with` property

#### Options ####

  * `with` - The regular expression to test with, if you are not happy with the default zip pattern.
  * `message` - Error message returned when zip validation fails.

```javascript
  zip: {
    message: "Invalid zip"
  }
```

### phone ###

Validate whether the property is valid phone. Default supported phone number pattern are.

#### Options ####

  * `format1`: (999) 999 9999. Set to `true` if you want to validate this pattern.
  * `format2`: (999) 999-9999. Set to `true` if you want to validate this pattern.
  * `format3`: (999)999 9999. Set to `true` if you want to validate this pattern.
  * `format4`: (999)999-9999. Set to `true` if you want to validate this pattern.
  * `format5`: (999)9999999. Set to `true` if you want to validate this pattern.
  * `format6`: 999 999 9999. Set to `true` if you want to validate this pattern.
  * `format7`: 999-999-9999. Set to `true` if you want to validate this pattern.
  * `format8`: 999.999.9999. Set to `true` if you want to validate this pattern.
  * `format9`: 9999999999. Set to `true` if you want to validate this pattern.
  * `message`: Error message returned when phone validation fails.

```javascript
  phone: {
    format1: true,
    format5: true,
    message: "Invalid phone"
  }
  // This matches format1 and format4 patterns of phone number
```

### length ###
Validate length of property

#### Options ####
  * `minimum` - The minimum length of the value
  * `maximum` - The maximum length of the value
  * `is` - The exact length of the value
  * `tokenizer` - A function that tokenize the string to get length, by default tokenized with ''.

##### Messages #####
  * `minimum` - Error message returned when minimum validation fails.
  * `maximum` - Error message returned when maximum validation fails.
  * `is` - Error message returned when is validation fails.

```javascript
  length: {
    minimum: 4,
    maximum: 20,
    messages: {
      minimum: 'Must be more than 4 characters',
      maximum: 'Must be less than 20 characters'
    }
  }

  length: {
    is: 4,
    messages: {
      is: 'Must be contains 4 characters'
    }
  }

  length: {
    is: 4,
    messages: {
      is: 'Must be contains to 4 words'
    },
    tokenizer: function(value) {
      return value.split(' ');
    }
  }
```

### numeric ###
Validates property is a number, comma separated numbers also supported. Default pattern of numbers /^\d+(,\d{3})*(\.\d*)?$/
You can change this by setting `pattern` property of the options.

#### Options ####
  * `pattern` - Default pattern for number /^\d+(,\d{3})*(\.\d*)?$/, set this if you want any other pattern.
  * `integer` - Validates property is a integer
  * `greaterThan` - Validates property is greater than
  * `greaterThanOrEqualTo` - Validates property is greater than or equal to
  * `equalTo` - Validates property is equal to
  * `lessThan` - Validates property is less than
  * `lessThanOrEqualTo` - Validates property is less than or equal to
  * `odd` - Validates property is odd
  * `even` - Validates property is even
  * `decimal` - Validates maximum no of decimal digits
  * `fraction` - Validates maximum no of fraction digits

##### Messages #####
  * `numeric` - Error message returned when numeric validation fails.
  * `integer` - Error message returned when integer validation fails.
  * `greaterThan` - Error message returned when greaterThan validation fails.
  * `greaterThanOrEqualTo` - Error message returned when greaterThanOrEqualTo validation fails.
  * `equalTo` - Error message returned when equalTo validation fails.
  * `lessThan` - Error message returned when lessThan validation fails.
  * `lessThanOrEqualTo` - Error message returned when lessThanOrEqualTo validation fails.
  * `odd` - Error message returned when odd validation fails.
  * `even` - Error message returned when even validation fails.
  * `decimal` - Error message returned when decimal validation fails.
  * `fraction` - Error message returned when fraction validation fails.

```javascript
  numeric: {
    integer: true,
    messages: {
      integer: 'must be an integer'
    }
  }

  numeric: {
    lessThan: 10,
    messages: {
      lessThan: 'must be less than 10'
    }
  }

  numeric: {
    greaterThan: "10,000.12",
    decimal: 5,
    fraction: 2,
    messages: {
      greaterThan: 'must be greater than 10,000.12'
      decimal: 'must be max of 5 decimal digits',
      fraction: 'must be max of 2 fraction digits'
    }
  }
```

### date ###
Perform date validation. Property can be Date object, moment object or string. If the property is string then set `format` option

#### Options ####
  * `format` - Format of the source date, only if property is date in string.
  * `time` - By default time is not allowed while performing validations, set this to true, if you want to validate time also.
  * `weekend` - Validates property is a weekend.
  * `onlyWeekend` - Validates property is a only saturday or sunday.
  * `before` - Validates property is before target date
  * `beforeSame` - Validates property is before or same as target date
  * `same` - Validates property is same as target date
  * `after` - Validates property is after target date
  * `afterSame` - Validates property is after or same as target date

The below two are options for same, before, after, beforeSame and afterSame
  * `target` - Date to be compared with. This can be date object, moment object or string. If the property is string then set `format` option.
  * `format` -  Format of target date, if it is string.

#### Messages ####
  * `date` - Error message to be displayed if date is not valid.
  * `weekend` - Error message returned when weekend validation fails.
  * `onlyWeekend` - Error message returned when onlyWeekend validation fails.
  * `before` - Error message returned when before validation fails.
  * `beforeSame` - Error message returned when beforeSame validation fails.
  * `same` - Error message returned when same validation fails.
  * `after` - Error message returned when after validation fails.
  * `afterSame` - Error message returned when afterSame validation fails.

```javascript
  date: {
    weekend: true,
    messages: {
      weekend: 'must not be weekend'
    }
  }

// If property date is 'Nov/01/2015'
  date: {
    before: {
      target: 'Oct/31/2015',
      format: 'MMM/DD/YYYY'
    },
    afterSame: {
      target: new Date()
    },
    messages: {
      before: 'date must be before Oct/31/2015',
      afterSame: 'date must be after new Date()'
    }
  }
```

### Conditional Validators ##

In some cases we may want to execute the function only if certain conditions are satisfied.
Please use `if` and `unless` options in validation rules.

* `if` - Validator will be executed only if the supplied call back returns true.
* `unless` - Validator will be executed only if the supplied call back returns false.

```javascript
  userName: {
    length: {
      'if': function(object, validator) {
        return true;
      }
    }
  }

  password: {
    numeric: {
      unless: function(object, validator) {
        return false;
      }
    }
  }
```

### Custom Validators ###

You can place your custom validators into `my-app/app/validators/<name>`:

```javascript
  /**
    my-app/app/validators/myvalidator.js
  */
  import Validator from 'ember-validator/validators/validator';

  export default Validator.extend({
     perform: function() {
       // Do your validation login here.
     }
  });

  userName: {
    myvalidator: {
      ...
    }
  }
```

#### Custom Inline Validators ####

If you want to create validators on the fly then,

```javascript
import { inlineValidator } from 'ember-validator';

{
  userName: {
    custom: inlineValidator(function() {
      return 'Error message';
    })
  }
}
```

### References ###

1. [Dockyard ember-validations](https://github.com/dockyard/ember-validation)
2. [Daniel Kuczewski ember-validations](https://github.com/Dani723/ember-validation)

### NPM ###
[NPM](https://www.npmjs.com/package/ember-validator)

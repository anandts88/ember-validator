# Ember Validator #
[![Build Status](https://travis-ci.org/anandts88/ember-validator.svg?branch=master)](https://travis-ci.org/anandts88/ember-validator)
[![npm version](https://badge.fury.io/js/ember-validator.svg)](https://badge.fury.io/js/ember-validator)
[![Dependency Status](https://david-dm.org/anandts88/ember-validator.svg?style=flat)](https://david-dm.org/anandts88/ember-validator)
[![devDependency Status](https://david-dm.org/anandts88/ember-validator/dev-status.svg?style=flat)](https://david-dm.org/anandts88/ember-validator#info=devDependencies)


1. Performs validation on ember object.
2. Provides facility to perform validation on submit or focus out.
3. Provides facility to perform validation when user starts typing, based on computed property rather using observer.
4. Returns validation result as promise.
5. Provides facility to return result as regular object rather than promise.
6. Supports nested property validation.

## Installation ##

Please add `ember-validator` to your `package.json`:

```javascript
"devDependencies": {
  ...
  "ember-validator": "1.3.6"
}
```

By default date validator is enabled in the validator, so you may need moment library.
If you want to skip importing moment library then set `useDateValidator` to `false` in `ember-cli-build.js`.

```javascript
var app = new EmberApp(defaults, {
  emberValidator: {
    useDateValidator: false
  }
});
```

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).

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
  app/instance-initializers/ember-validator.js
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

For older version of Ember. But we suggest not to use this approach.

```javascript
/**
  app/initializers/ember-validator.js
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
2. `createObjectWithValidator`
3. `computedValidateMap`
4. `validate`

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

### createObjectWithValidator ###

Create or reopen object with validations. So validation will fired whenever the property value changes. In short triggers validator by computing property change.

Takes 3 arguments.
  * model - Object to be validated.
  * validations - Validations rules for an object.
  * validateOnDirty - Default `false`. By default validation will happen irrespective of field is dirty or not. Set to `true` if you want to perform validation only if the field becomes dirty.

For example, if you are defining validation rules for a property called `userName` for the object called `model`, then validation result of that property is available in property `userNameValidatorResult`

model.get('userNameValidatorResult.errors') -> Returns all error messages related with userName property
model.get('userNameValidatorResult.errors') -> Returns first message related with userName property
model.get('userNameValidatorResult.isValid') -> Returns true if userName property is valid
model.get('userNameValidatorResult.isInvalid') -> Returns true if userName property is invalid
model.get('userNameValidatorResult.hasError') -> Returns true if userName property has errors

model.get('validatorResultHasError') -> Computed property which returns true if the validation result has any error
model.get('validatorResultIsInValid') -> Computed property which returns true if model is not valid
model.get('validatorResultIsValid') -> Computed property which returns true if model is valid
model.get('validatorResultErrors') -> Computed property which array of all validation errors
model.get('validatorResultObjectDirty') -> Computed property which returns true if the object is dirty
model.get('validatorResultObjectClean') -> Computed property which returns true if the object is clean

```javascript
  // app/models/login.js
  import Ember from 'ember';

  export default Ember.Object.extend({
    userName: null,
    password: null
  });  

  // app/routes/login.js
  import Ember from 'ember';
  import EmberValidator from 'ember-validator';
  import LoginModel from 'app/models/login';

  export default Ember.Route.extend(EmberValidations, {
    model: function() {
      var model = LoginModel.create();
      var validations = {
        userName: {
          required: { message: 'Enter username' },
          length: {
            minimum: 4,
            messages: {
              minimum: 'Username is minimum of 4 characters'
            }
          }
        },
        password: {
          required: { message: 'Enter Password' }
        }
      };

      return this.createObjectWithValidator(model, validations, true);
    }
  });

  // app/templates/login.hbs
  <form {{action "login" on="submit"}}>
    <p style="color:red">{{model.userNameValidatorResult.error}}</p>
    {{input type="text" value=model.userName}}
    <p style="color:red">{{model.passwordValidatorResult.error}}</p>
    {{input type="password" value=model.password}}
    <button type="submit">Login</button>
  </form>

```

### computedValidateMap ###

Same as `createObjectWithValidator`, but we suggest to use `createObjectWithValidator`.

```javascript
  // app/models/login.js
  import Ember from 'ember';

  export default Ember.Object.extend({
    userName: null,
    password: null
  });  

  // app/routes/login.js
  import Ember from 'ember';
  import EmberValidator from 'ember-validator';
  import LoginModel from 'app/models/login';

  export default Ember.Route.extend(EmberValidations, {
    model: function() {
      var model = LoginModel.create();
      var validations = {
        userName: {
          required: { message: 'Enter username' },
          length: {
            minimum: 4,
            messages: {
              minimum: 'Username is minimum of 4 characters'
            }
          }
        },
        password: {
          required: { message: 'Enter Password' }
        }
      };

      this.computedValidateMap({
        model: model,
        validations: validations,
        validateOnDirty: true
      });
    }
  });

  // app/templates/login.hbs
  <form {{action "login" on="submit"}}>
    <p style="color:red">{{model.userNameValidatorResult.error}}</p>
    {{input type="text" value=model.userName}}
    <p style="color:red">{{model.passwordValidatorResult.error}}</p>
    {{input type="password" value=model.password}}
    <button type="submit">Login</button>
  </form>

```

### validate ###

Use this function if you want to directly validate Ember Object


```javascript
import Ember from 'ember';
import EmberValidator from 'ember-validator';

export default Ember.Controller.extend({

  actions: {
    var obj = Ember.Object.create(EmberValidations, { // Don't forget to reopen mixin to add container.
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

## Nested Property Validations ##

Supports to validation of object with an object.

In case of validation of a nested property, if you want to set validation result of the nested property in different parameter then supply 'errorProperty' along with validation rules.

```javascript
 var validations = {
   'orders.detail': {
     errorProperty: 'orderDetails',
     required: true
   }
 };

 var result = this.validateMap({
   model: obj,
   validations: validations,
   noPromise: true
 });

 result.get('orderDetails.hasError');
```

## Validators ##

### required ###

Validate the property has value.

#### Options ####

  * `message` - Error message returned when required validation fails.

```javascript
  required: { message: 'Please enter a value' }
  required: 'Please enter a value'
  required: true
```

### notrequired ###

Validate the property dont have value.

#### Options ####

  * `message` - Error message returned when notrequired validation fails.

```javascript
  notrequired: { message: 'Value must be empty' }
  notrequired: 'Value must be empty'
  notrequired: true
```

### boolean ###

Validate the property is boolean and has value true or false.

#### Options ####
  * `required` - Validates property is `true`.
  * `notrequired` - Validates property is `false`.
  * `message` - Error message returned when validation fails.

#### messages ####
  If you want to override message of individual rule.

  * `required` - Validates property is `true`.
  * `notrequired` - Validates property is `false`.
  * `boolean` - Validates property is `boolean`.

```javascript
  boolean: {
    required: true
    message: 'must be true'
  }

  boolean: {
    notrequired: true
    messages: {
      boolean: 'must be boolean'
      notrequired: 'must be false'
    }
  }

  boolean: 'must be true'
  boolean: true
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
  * `message` - Error message returned when validation fails.

##### Messages #####
  If you want to override message of individual rule.

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
  exclude: ['A', 'B', 'C'],
  message: 'Please enter valid value'
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
  include: ['A', 'B', 'C'],
  message: 'Please enter valid value'
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
  * `hasAlphabet` - Set to true, to check has atleast one alphabet
  * `hasUpperCase` - Set to true, to check has atleast one upper case alphabet
  * `hasLowerCase` - Set to true, to check has atleast one lower case alphabet
  * `hasNumber` - Set to true, to check has atleast one number
  * `hasSpecial` - Set to true, to check atleast one special character. Supply a string of characters that you want to check or supply your own regex pattern.
  * `hasNoSpecial` - Set to true, to check no special characters
  * `hasNoSpace` - Set to true, to check no spaces
  * `with` - The regular expression to test with
  * `without` - The regular expression to inverse test
  * `array` - Array of regular expression, when you want to validate more than one regex
  * `message` - Error message returned when validation fails.

#### messages ####
  If you want to override message of individual rule.

  * `hasAlphabet` - Error message returned when hasAlphabet validation fails.
  * `hasUpperCase` - Error message returned when hasUpperCase validation fails.
  * `hasLowerCase` - Error message returned when hasLowerCase validation fails.
  * `hasNumber` - Error message returned when hasNumber validation fails.
  * `hasSpecial` - Error message returned when hasSpecial validation fails.
  * `hasNoSpecial` - Error message returned when hasNoSpecial validation fails.
  * `hasNoSpace` - Error message returned when hasNoSpace validation fails.
  * `with` - Error message returned when with validation fails.
  * `without` - Error message returned when without validation fails.

```javascript
  pattern: {
    with: /^([a-zA-Z])+$/,
    messages: {
      with: 'Must be alphabets'  
    }
  }

  pattern: {
    with: /^([a-zA-Z])+$/,
    message: 'Must be alphabets'  
  }

  pattern: {
    without: /^([a-zA-Z])+$/,
    messages: {
      without: 'Must not be alphabets'  
    }
  }

  pattern: {
    without: /^([a-zA-Z])+$/,
    message: 'Must not be alphabets'  
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

  email: true
  email: 'Invalid email'

  email: {
    with: /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    message: "Invalid email"
  }
```

### ssn ###

Validate whether the property is ssn. Default pattern of ssn NNN-NN-NNNN. change this by setting `with` property

#### Options ####

  * `format1`: 999-99-9999. Set to `true` if you want to validate this pattern.
  * `format2`: 999999999. Set to `true` if you want to validate this pattern.
  * `format3`: 999.99.9999. Set to `true` if you want to validate this pattern.
  * `all`: Set to true, if you want to validate with all the default formats.
  * `message` - Error message returned when email validation fails.

```javascript
  ssn: {
    format1: true,
    message: "Invalid ssn"
  }

  ssn: {
    all: true,
    message: "Invalid ssn"
  }

  ssn: true
  ssn: 'Invalid ssn'
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

  zip: true
  zip: 'Invalid zip'
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
  * `all`: Set to true, if you want to validate with all the default formats.
  * `message`: Error message returned when phone validation fails.

```javascript
  phone: {
    format1: true,
    format5: true,
    message: "Invalid phone"
  }
  // This matches format1 and format4 patterns of phone number

  phone: {
    all: true
    message: "Invalid phone"
  }

  phone: true
  phone: 'Invalid phone'
```

### length ###
Validate length of property

#### Options ####
  * `minimum` - The minimum length of the value
  * `maximum` - The maximum length of the value
  * `is` - The exact length of the value
  * `tokenizer` - A function that tokenize the string to get length, by default tokenized with ''.
  * `message` - Error message returned when validation fails.

##### Messages #####
  If you want to override message of individual rule.

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
    message: 'Must be contains 4 characters'
  }

  length: {
    is: 4,
    message: 'Must be contains 4 characters'
    tokenizer: function(value) {
      return value.split(' ');
    }
  }
```

### numeric ###
Validates property is a number, comma separated numbers also supported. Default pattern of numbers /^\d+(,\d{3})*(\.\d*)?$/
You can change this by setting `pattern` property of the options.
By default maximum allowed decimal length is 12 and maximum allowed fraction length is 2.

#### Options ####
  * `pattern` - Default pattern for number /^\d+(,\d{3})*(\.\d*)?$/, set this if you want any other pattern.
  * `integer` - Validates property is a integer
  * `greaterThan` - Validates property is greater than
  * `greaterThanOrEqualTo` - Validates property is greater than or equal to
  * `equalTo` - Validates property is equal to
  * `notEqualTo` - Validates property is not equal to
  * `lessThan` - Validates property is less than
  * `lessThanOrEqualTo` - Validates property is less than or equal to
  * `odd` - Validates property is odd
  * `even` - Validates property is even
  * `decimal` - Validates maximum no of decimal digits. Default allowed digits is 12.
  * `fraction` - Validates maximum no of fraction digits. Default allowed digits is 2.
  * `range` - Validates number falls in the range. This must be an array holding upper and lower limit
  * `between` - Validates number falls between the given range. This must be an array holding upper and lower limit. Difference with range is this validation fails if value is equal to upper or lower limit.
  * `message` - Error message returned when validation fails.

##### Messages #####
  If you want to override message of individual rule.

  * `numeric` - Error message returned when numeric validation fails.
  * `integer` - Error message returned when integer validation fails.
  * `greaterThan` - Error message returned when greaterThan validation fails.
  * `greaterThanOrEqualTo` - Error message returned when greaterThanOrEqualTo validation fails.
  * `equalTo` - Error message returned when equalTo validation fails.
  * `notEqualTo` - Error message returned when notEqualTo validation fails.
  * `lessThan` - Error message returned when lessThan validation fails.
  * `lessThanOrEqualTo` - Error message returned when lessThanOrEqualTo validation fails.
  * `odd` - Error message returned when odd validation fails.
  * `even` - Error message returned when even validation fails.
  * `decimal` - Error message returned when decimal validation fails.
  * `fraction` - Error message returned when fraction validation fails.
  * `range` - Error message returned when range validation fails.
  * `between` - Error message returned when between validation fails.

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

  numeric: {
    greaterThan: "10,000.12",
    decimal: 5,
    fraction: 2,
    message: 'Valid number'
    messages: {
      greaterThan: 'must be greater than 10,000.12'
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
  * `notSame` - Validates property is not same as target date
  * `after` - Validates property is after target date
  * `afterSame` - Validates property is after or same as target date
  * `message` - Error message returned when validation fails.

The below two are options for same, before, after, beforeSame and afterSame
  * `target` - Date to be compared with. This can be date object, moment object or string. If the property is string then set `format` option.
  * `format` -  Format of target date, if it is string.

#### Messages ####
  If you want to override message of individual rule.

  * `date` - Error message to be displayed if date is not valid.
  * `weekend` - Error message returned when weekend validation fails.
  * `onlyWeekend` - Error message returned when onlyWeekend validation fails.
  * `before` - Error message returned when before validation fails.
  * `beforeSame` - Error message returned when beforeSame validation fails.
  * `same` - Error message returned when same validation fails.
  * `notSame` - Error message returned when notSame validation fails.
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
    format: 'MMM/DD/YYYY',
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

* `if` - Validator will be executed only if the supplied call back returns true. This can be a function or a boolean.
* `unless` - Validator will be executed only if the supplied call back returns false. This can be a function or a boolean.

```javascript
  userName: {
    length: {
      'if': function(model, property) {
        return true;
      }
    }
  }

  password: {
    numeric: {
      unless: function(model, property) {
        return false;
      }
    }
  }
```

Conditional validators are also added in property level, so it wont validate any validators defined for the property.

```javascript
  userName: {
    'if': function(model, property) {
      return true;
    },
    length: {

    }
  }

  password: {
    unless: function(model, property) {
      return false;
    },
    numeric: {

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
    custom: inlineValidator(function(model, property) {
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

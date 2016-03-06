/*jshint node:true*/
module.exports = {
  scenarios: [
    {
      name: 'default',
      bower: {
        dependencies: { }
      }
    },
    {
      name: '1.10.1',
      bower: {
        dependencies: {
          'ember': '1.10.1'
        }
      }
    },
    {
      name: '1.11.3',
      bower: {
        dependencies: {
          'ember': '1.10.1'
        }
      }
    },
    {
      name: '1.12.1',
      bower: {
        dependencies: {
          'ember': '1.12.1'
        }
      }
    },
    {
      name: '1.13.11',
      bower: {
        dependencies: {
          'ember': '1.13.11'
        }
      }
    },
    {
      name: '2.0.2',
      bower: {
        dependencies: {
          'ember': '2.0.2'
        }
      }
    },
    {
      name: 'ember-release',
      bower: {
        dependencies: {
          'ember': 'components/ember#release'
        },
        resolutions: {
          'ember': 'release'
        }
      }
    },
    {
      name: 'ember-beta',
      bower: {
        dependencies: {
          'ember': 'components/ember#beta'
        },
        resolutions: {
          'ember': 'beta'
        }
      }
    },
    {
      name: 'ember-canary',
      bower: {
        dependencies: {
          'ember': 'components/ember#canary'
        },
        resolutions: {
          'ember': 'canary'
        }
      }
    }
  ]
};

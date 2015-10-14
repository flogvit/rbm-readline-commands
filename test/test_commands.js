/**
 * Created by flogvit on 2015-06-28.
 *
 * @copyright Cellar Labs AS, 2015, www.cellarlabs.com, all rights reserved
 * @file
 * @license GPL-3.0
 * @author Vegard Hanssen <Vegard.Hanssen@cellarlabs.com>
 *
 */

var should = require('should');
require('assert');
var _ = require('underscore');
var Commands = require('../lib/commands.js');

describe('Check Commands', function () {
  // First is command
  // Second is parsed commandParams
  // Third is error value
  // Forth is errorText value
  var its = {
    'standard mandatory': [
      {
        'foo.bar': {
          mandatory: {
            test: {
              desc: 'Test',
              type: 'string'
            }
          }
        }
      },
      {
        'foo.bar': {
          test: {
            desc: 'Test',
            type: 'string'
          }
        }
      },
        false
    ],
    'standard optional': [
      {
        'foo.bar': {
          optional: {
            test: {
              desc: 'Test',
              type: 'string'
            }
          }
        }
      },
      {
        'foo.bar': {
          test: {
            desc: 'Test',
            type: 'string'
          }
        }
      },
        false
    ],
    'standard mandatory and optional': [
      {
        'foo.bar': {
          mandatory: {
            test: {
              desc: 'Test',
              type: 'string'
            }
          },
          optional: {
            test2: {
              desc: 'Test2',
              type: 'string'
            }
          }
        }
      },
      {
        'foo.bar': {
          test: {
            desc: 'Test',
            type: 'string'
          },
          test2: {
            desc: 'Test2',
            type: 'string'
          }
        }
      },
        false
    ],
    'all types of type': [
      {
        'foo.bar': {
          mandatory: {
            string: {
              desc: 'string',
              type: 'string'
            },
            array: {
              desc: 'array',
              type: 'array'
            },
            number: {
              desc: 'number',
              type: 'number'
            },
            boolean: {
              desc: 'boolean',
              type: 'boolean'
            },
            object: {
              desc: 'object',
              type: 'object'
            },
            mixed: {
              desc: 'mixed',
              type: 'mixed'
            }
          }
        }
      },
      {
        'foo.bar': {
          string: {
            desc: 'string',
            type: 'string'
          },
          array: {
            desc: 'array',
            type: 'array'
          },
          number: {
            desc: 'number',
            type: 'number'
          },
          boolean: {
            desc: 'boolean',
            type: 'boolean'
          },
          object: {
            desc: 'object',
            type: 'object'
          },
          mixed: {
            desc: 'mixed',
            type: 'mixed'
          }
        }
      },
        false
    ],
    'fail on missing type': [
      {
        'foo.bar': {
          mandatory: {
            test: {
              desc: 'Test'
            }
          }
        }
      },
      {
        'foo.bar': {
          test: {
            desc: 'Test'
          }
        }
      },
        true,
        'Missing type in parameter test'+"\n"
    ],
    'fail on wrong type': [
      {
        'foo.bar': {
          mandatory: {
            test: {
              desc: 'Test',
              type: 'unknown'
            }
          }
        }
      },
      {
        'foo.bar': {
          test: {
            desc: 'Test'
          }
        }
      },
      true,
      'Unknown type in parameter test'+"\n"
    ],
    'with values': [
      {
        'foo.bar': {
          mandatory: {
            test: {
              desc: 'Test',
              type: 'string',
              values: ['foo','bar']
            }
          }
        }
      },
      {
        'foo.bar': {
          test: {
            desc: 'Test',
            type: 'string',
            values: ['foo','bar']
          }
        }
      },
        false
    ],
    'with default value': [
      {
        'foo.bar': {
          mandatory: {
            test: {
              desc: 'Test',
              type: 'string',
              defaultValue: 'foo'
            }
          }
        }
      },
      {
        'foo.bar': {
          test: {
            desc: 'Test',
            type: 'string',
            defaultValue: 'foo'
          }
        }
      },
        false
    ],
    'with mandatory sub': [
      {
        'foo.bar': {
          mandatory: {
            test: {
              mandatory: {
                test2: {
                  desc: 'Test2',
                  type: 'string'
                }
              }
            }
          }
        }
      },
      {
        'foo.bar': {
          test: {
            test2: {
              desc: 'Test2',
              type: 'string'
            }
          }
        }
      },
        false
    ]
  }

  _.keys(its).forEach(function (parse) {
    it('should understand "' + parse + '"', function (done) {
      var com = new Commands();
      com.register(its[parse][0]);
      if (its[parse].length>3) {
        com.errorText.should.equal(its[parse][3]);
      } else {
        com.errorText.should.equal('');
      }
      if (its[parse].length>2) {
        should(com.error).equal(its[parse][2]);
      }
      com.commandParams.should.eql(its[parse][1]);
       done();
    });
  });
});

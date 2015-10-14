* RBM readline commands



This module is a part of the upcoming RBM framework.

```javascript

var Parser = require('rbm-readline-commands');
var parser = new Parser();

var commands = {
  'module': {
    'start': {
      mandatory: {
        name: {}
      },
      optional: {
        node: {}
      }
    },
    'stop': {
      '<name>': {}
    },
    'reload': {},
    'list': {
      '[<name>]': {}
    }
  },
  'service': {
    'start': {
      '<module>': {}
    },
    'stop': {
      '<id>': {}
    },
    'list': {
      '[<id>]': {}
    }
  }
  
}

parser.init(commands);


```

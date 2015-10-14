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

The commands are build up of parameters. If a parameter is a normal string, it is required to that point in
the tree. If a node has a "_", it can be terminated at that point. If a string has <> around, it is a
required named parameter. It will be named accordingly. And if a parameter has [] around, it is optional

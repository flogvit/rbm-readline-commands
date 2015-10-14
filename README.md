* RBM readline commands



This module is a part of the upcoming RBM framework.

```javascript

var Parser = require('rbm-readline-commands');
var parser = new Parser();

var defModuleName = { desc: 'Name of the module', type: 'string' };
var defServiceName = { desc: 'Name of the service', type: 'string' };
var defServiceId = { desc: 'Id of the service', type: 'string' };
var defNode = { desc: 'Node name', type: 'string' };

var commands = {
  'module.start': {
      mandatory: {
        name: defModuleName
      },
      optional: {
        node: defNode
      }
  },
  'module.stop': {
      mandatory: {
         name: defModuleName
      }
  },
  'module.reload': {
      mandatory: {
         name: defModuleName
      }
  },
  'module.list': {
      optional: {
          name: defModuleName
      }
  },
  'service.start': {
      mandatory: {
          name: defServiceName
      }
  },
  'service.stop': {
      mandatory: {
          id: defServiceId
      }
  },
  'service.list': {
      optional: {
         id: defServiceId
      }
  }
  
}

parser.init(commands);


```

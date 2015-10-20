```javascript
var command = {
  '<command>': {
    mandatory: {},
    optional: {},
    extra: {},
    response: {},
    errors: {}
    func: function,
    login: boolean,
    internal: boolean,
    loadbalance: string
    schedule: {}
  }
}

var mandatory|optional = {
  '<paramName>': {},
  '..': {}
}

var extra = {
  '<extraName>': {},
  '..': {}
}

var response = {
  '<paramName>': {},
  '..': {}
}

var errors = {
  '<number>': string,
  '..': string
}

var schedule = {
  // Not yet defined
}

var paramName = {
  desc: string,
  type: ['string', 'number', 'boolean', 'array', 'object', 'mixed'],
  values: array,     
  defaultValue: string,
  expand: function|array
}

var paramName = {
  mandatory: {},
  optional: {},
  switches: {},
  extra: {}
}

var extraName = {
  command: string,
  send: string,
  sendAs: string,
  get: string
}
``` 

```javascript
var params = {
  test: 'test',                  // string
  test2: ['test', 'test1'],      // array
  test3: { test: 1, test2: 2 },  // param
  '/test[4]/': 'test'               // regexp key
  test5: [{test: 1},{test: 2}],  // array of params
  test6: [['test'],['test2']]    // ERROR: array of array is not allowed!
}

// var params = { test: 'test' }
// cm: test=test
var p1: {
  mandatory: {
    test: {
      desc: 'test',
      type: 'string
    }
  }
}

// var params = { test2: ['test', 'test1'] }
// cm: test2=test,test1
var p2: {
  mandatory: {
    test2: {
      desc: 'test2',
      type: 'array:string'
    }
  }
}

// var params = { test3: { test: 1, test2: 2 } }
// cm: test3 test=1 test2=2

var p3: {
  mandatory: {
    test3: {
      mandatory: {
        test: {
          desc: 'test',
          type: 'number'
        },
        test2: {
          desc: 'test',
          type: 'number'
        }
      }
    }    
  }
}

// var params = { '/test[4]/': 'test' }
// cm: test4=test

var p4: {
  mandatory: {
    '/test[4]/': {
      desc: 'test',
      type: 'string'
    }
  }
}

// var params = { test5: [{test: 1},{test: 2}] }
// cm: test5 test=1 test=2
var p5: {
  mandatory: {
    test5: [
      {
        mandatory: {
          test: {
            desc: 'test',
            type: 'number'
          }            
        }
      }
    ]
  }
}


```

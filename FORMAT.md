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

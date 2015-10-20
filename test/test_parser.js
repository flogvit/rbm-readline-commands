/**
 * Created by flogvit on 2015-06-19.
 *
 * @copyright Cellar Labs AS, 2015, www.cellarlabs.com, all rights reserved
 * @file
 * @license GPL-3.0
 * @author Vegard Hanssen <Vegard.Hanssen@cellarlabs.com>
 *
 */

var should = require('should');
require('assert');
var util = require('util');
var Parser = require('../parser.js');
var parser = new Parser();
var _ = require('underscore');

var expandModuleName = function (name, result) {
  if ("sudoku".indexOf(name) === 0) {
    return "sudoku";
  }
}

var defModuleName = {desc: 'Module name', type: 'string', expand: expandModuleName};

var commands = {
  'module.start': {
    mandatory: {
      name: defModuleName
    },
    optional: {
      node: {desc: 'Node to run on', type: 'string'}
    }
  },
  'module.stop': {
    mandatory: {
      name: defModuleName
    }
  },
  'module.reload': {},
  'module.list': {
    optional: {
      name: defModuleName
    }
  },
  'module.add': {
    mandatory: {
      name: defModuleName,
      type: {desc: 'Type of module', type: 'string'}
    },
    optional: {
      version: {desc: 'Versions to use', type: 'string'},
      params: {
        optional: {
          '*': {desc: 'Name of a parameter', type: 'string'}
        }
      }
    }
  },
  'service.start': {
    mandatory: {
      module: defModuleName
    }
  },
  'service.stop': {
    mandatory: {
      id: {desc: 'Id of service', type: 'string'}
    }
  },
  'service.list': {
    optional: {
      id: {desc: 'Id of service', type: 'string'}
    }
  },
  'do.something': {
    mandatory: {
      some: {
        desc: '',
        type: 'array|string'
      }
    },
    switches: {
      dummyname: {
        desc: '',
        type: 'string',
        values: ['test', 'foo', 'bar']
      },
      another: {
        desc: '',
        type: 'number',
        values: [1, 4, 5]
      }
    }
  }
}

parser.init(commands);
console.log(util.inspect(parser.tree, false, null));

describe('Check Expand', function () {
  var its = {
    'madule': [
      new Error('Unknown command'),
      {expands: []}
    ],
    'madule test': [
      new Error('Unknown command'),
      {expands: []}
    ],
    'module.list': [
      null,
      {
        command: 'module.list',
        expands: ['module.list']
      }
    ],
    'module.start name=test': [
      null,
      {
        command: 'module.start',
        params: {
          name: 'test'
        },
        expands: ['module.start name=test']
      }
    ],
    'module.start id=test': [
        null,
      {
        command: 'module.start',
        params: {
          id: 'test'
        },
        expands: ['module.start id=test']
      }
    ],
    'module.start name=test node=node1': [
      null,
      {
        command: 'module.start',
        params: {
          name: 'test',
          node: 'node1'
        },
        expands: ['module.start name=test node=node1']
      }
    ],
    'module.start node=node1 name=test': [
      null,
      {
        command: 'module.start',
        params: {
          name: 'test',
          node: 'node1'
        },
        expands: ['module.start node=node1 name=test']
      }
    ],
    'service.l': [
      null,
      {
        expands: ['service.list']
      }
    ],
    'module.add name="test module" type="node" params url="mongodb://localhost/test"': [
      null,
      {
        command: 'module.add',
        params: {
          name: 'test module',
          type: 'node',
          params: {
            url: 'mongodb://localhost/test'
          }
        },
        expands: ['module.add name="test module" type=node params url=mongodb://localhost/test']
      }
    ]
    ,
    'module.start na': [
      null,
      {
        command: 'module.start',
        params: {
          name: {}
        },
        expands: ['module.start name']
      }
    ],
    'module.start na=sudoku': [
        null,
      {
        command: 'module.start',
        params: {
          name: 'sudoku'
        },
        expands: [ 'module.start name=sudoku']
      }
    ]
    /*,
    'module.start name=su': [
        null,
      {
        command: 'module.start',
        expands: ['module.start name=sudoku']
      }
    ] */
  }

  _.keys(its).forEach(function (key) {
    it('should '+(its[key][0]!==null ? 'not ' : '') +'understand ' + key, function (done) {
      parser.expand(key, function (err, res) {
//        console.log(res);
        should(err).eql(its[key][0]);
        should(res).eql(its[key][1]);
        done();
      })
    })
  })

});

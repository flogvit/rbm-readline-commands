/**
 * Created by flogvit on 2015-06-25.
 *
 * @copyright Cellar Labs AS, 2015, www.cellarlabs.com, all rights reserved
 * @file
 * @license GPL-3.0
 * @author Vegard Hanssen <Vegard.Hanssen@cellarlabs.com>
 *
 */

var extend = require('util')._extend;
var _ = require('underscore');

/**
 *
 * @class
 * @classdesc
 */
function Commands() {
  this.commands = {};
  this.commandParams = {};
  this.error = false;    // Setting this if missing something
  this.errorText = '';
}

var extractCommand = function (self) {
  _.keys(self.commands).forEach(function (command) {
    var params = {};
    self.commandParams[command] = params;
    extractParams(self, self.commands[command], params)
  })
}

var extractParams = function (self, command, params) {
  extractMandatory(self, command, params);
  extractOptional(self, command, params);
}

var extractMandatory = function (self, command, params) {
  if ('mandatory' in command) {
    _.keys(command.mandatory).forEach(function (param) {
      extractParam(self, command.mandatory[param], param, params);
    })
  }
}

var extractOptional = function (self, command, params) {
  if ('optional' in command) {
    _.keys(command.optional).forEach(function (param) {
      extractParam(self, command.optional[param], param, params);
    })
  }
}

var extractParam = function (self, command, param, params) {
  var p = {};
  params[param] = p;

  // If no desc, it's a sub
  if (!('desc' in command)) {
    extractParams(self, command, p);
    return;
  }

  // It's a parameter
  p.desc = command.desc; // We know it exists
  if (!('type' in command)) {
    addError(self, 'Missing type in parameter ' + param);
    return;
  }
  if (['string', 'number', 'boolean', 'array', 'object', 'mixed'].indexOf(command.type) == -1) {
    addError(self, 'Unknown type in parameter ' + param);
    return;
  }
  p.type = command.type;
  if ('values' in command) {
    if (!(_.isArray(command.values))) {
      addError(self, 'values in parameter ' + param + ' is not an array');
      return;
    }
    p.values = command.values;
  }
  if ('defaultValue' in command) {
    p.defaultValue = command.defaultValue;
  }
  if ('expand' in command) {
    if (!(_.isArray(command.expand) || !(_.isFunction(command.expand)))) {
      addError(self, 'expand must be an array or function for parameter '+param);
      return;
    }
    p.expand = command.expand;
  }
}

var addError = function(self, text) {
  self.error = true;
  self.errorText += text+"\n";
}

Commands.prototype.register = function (commands) {
  this.commands = commands;
  extractCommand(this);
};

Commands.prototype.evaluate = function (obj) {

}

Commands.prototype.hasCommand = function (command) {
  return _.has(this.commands, command);
}

Commands.prototype.expandCommand = function (command) {
  var result = [];
  _.keys(this.commands).forEach(function (key) {
    if (key.indexOf(command) === 0) {
      result.push(key);
    }
  })
  return result;
}

Commands.prototype.expandParamKey = function (command, key, keys) {
  if (!command in this.commandParams)
    return [key];
  var pos = this.commandParams[command];
  var result = [];
  keys.forEach(function(k) {
    if (!k in pos)
      return [key];
    pos = pos[k];
  })
  _.keys(pos).forEach(function(k) {
    if (k.indexOf(key)===0)
      result.push(k);
  })
  if (result.length===0)
    result.push(key);
  return result;
}

module.exports = Commands;

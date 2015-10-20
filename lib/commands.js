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
var util = require('util');

/**
 *
 * @class
 * @classdesc
 */
function Commands() {
  this.commands = {};
  this.error = false;    // Setting this if missing something
  this.errorText = '';
}

function ParamValue(key) {
  this.type = null;
  this.desc = null;
  this.legalValues = null;
  this.defaultValue = null;
  this.key = key;
}

ParamValue.prototype.check = function(param) {
  switch(this.type) {
    case 'number':
      return this.checkNumber(param);
    case 'string':
      return this.checkString(param);
    case 'boolean':
      return this.checkBoolean(param);
  }
}

ParamValue.prototype.checkNumber = function(param) {
  if (!util.isNumber(param)) return false;
  if (this.legalValues!==null) {
    return _.indexOf(this.legalValues, param)>-1; // Rewrite to sorted
  }
  return true;
}

ParamValue.prototype.checkString = function(param) {
  if (!util.isString(param)) return false;
  if (this.legalValues!==null) {
    return _.indexOf(this.legalValues, param)>-1; // Rewrite to sorted
  }
  return true;
}

ParamValue.prototype.checkBoolean = function(param) {
  return util.isBoolean(param);
}

function ParamHash() {
  this.mandatory = {};
  this.optional = {};
  this.optionalRegexp = {};
}

ParamHash.prototype.addMandatory = function (param) {
  this.mandatory[param.key] = param;
}

ParamHash.prototype.addOptional = function (param) {
  if (param.key.substring(0, 1) === '/')
    this.optionalRegexp[param.key] = param;
  else
    this.optional[param.key] = param;
}

ParamHash.prototype.check = function(params) {
  var self = this;
  var mandatoryCount = 0;
  if (!_.isObject(params)) return false;
  _.keys(params).forEach(function(key) {
    if (key in self.mandatory) {
      if (!self.mandatory[key].check(params[key])) return false;
      mandatoryCount++;
    } else if (key in self.optional) {
      if (!self.optional[key].check(params[key])) return false;
    }
  })
  if (_.keys(self.mandatory).length===mandatoryCount)
    return true;
  return false;
}

function Command(command, definition) {
  this.command = command;
  this.params = new ParamHash();
  this.internal = false;
  this.errors = {};
  this.func = null;
  this.login = false;
  this.loadbalance = null;

  // The
  this.definition = definition;

  // Temporary variable to fill when extracting options
  this._error = null;
}

Commands.prototype.register = function (commands) {
  var self = this;
  var errors = [];
  _.keys(commands).forEach(function (command) {
    var c = new Command(command, commands[command]);
    self.commands[command] = c;
    extractOptions(c);
    if (c._error!==null) {
      errors.push(c._error);
    }
    delete c._error;
  })
  return errors.length===0 ? null : errors;
}

var extractOptions = function (command) {
  var definition = command.definition;
  if ('extra' in definition)
    extractExtra(command, definition.extra);
  if ('errors' in definition)
    extractErrors(command, definition.errors);
  if ('func' in definition)
    extractFunc(command, definition.func);
  if ('login' in definition)
    extractLogin(command, definition.login);
  if ('internal' in definition)
    extractInternal(command, definition.internal);
  if ('loadbalance' in definition)
    extractLoadBalance(command, definition.loadbalance);
  extractParams(command, definition, command.params);
}

var extractExtra = function (command, extra) {

}

var extractErrors = function (command, errors) {
  _.keys(errors).forEach(function (error) {
    var text = errors[error];
    if (!_.isNumber(error)) {
      addError(command, 'errors: ' + error + ' is not a number');
    } else if (!_.isString(text)) {
      addError(command, 'errors: ' + text + ' is not a text');
    } else {
      command.errors[0 + error] = text;
    }
  })
}

var extractFunc = function (command, func) {
  if (!_.isFunction(func)) {
    addError(command, 'func: ' + func + ' is not a function');
  } else {
    command.func = func;
  }
}

var extractLogin = function (command, login) {
  if (!_.isBoolean(login)) {
    addError(command, 'login: ' + login + ' is not a boolean');
  } else {
    command.login = login;
  }
}

var extractInternal = function (command, internal) {
  if (!_.isBoolean(internal)) {
    addError(command, 'internal: ' + internal + ' is not a boolean');
  } else {
    command.internal = internal;
  }
}

var extractLoadBalance = function (command, lb) {
  if (!_.isString(lb)) {
    addError(command, 'loadbalance: ' + lb + ' is not a string');
  } else {
    command.loadbalance = lb;
  }
}

var extractParams = function (command, definition, params) {
  if ('mandatory' in definition)
    extractMandatory(command, definition.mandatory, params);
  if ('optional' in params)
    extractOptional(command, definition.optional, params);
}

var extractMandatory = function (command, definition, params) {
  _.keys(definition).forEach(function (param) {
    var p = extractParam(command, param, definition[param]);
    if (p!==null)
      params.addMandatory(p);
  })
}

var extractOptional = function (command, definition, params) {
  _.keys(definition).forEach(function (param) {
    var p = extractParam(command, param, definition[param]);
    if (p!==null)
      params.addOptional(p);
  })
}

var extractParam = function (command, param, definition) {
  var p = new ParamValue(param);

  if (_.isArray(definition)) {
    p.type = 'array';
    p.legalValues = new ParamHash();
    extractParams(command, definition[0], p.legalValues);
    return p;
  }
  if (!('desc' in definition)) {
    p.type = 'object';
    p.legalValues = new ParamHash();
    extractParams(command, definition, p.legalValues);
    return p;
  }
  p.desc = definition.desc;

  if (!('type' in definition)) {
    addError(command, 'param: '+param+' has no type');
    return null;
  } else if (['string', 'number', 'boolean', 'array', 'object', 'mixed'].indexOf(definition.type) === -1) {
      addError(command, 'param: '+param+' unknown type '+definition.type);
      return null;
  }
  p.type = definition.type;

  if ('defaultValue' in definition) {
    p.defaultValue = definition.defaultValue;
  }
  if ('legalValues' in definition) {
    if (!_.isArray(definition.values)) {
      addError(command, 'param: '+param+' values not an array');
      return null;
    }
    p.legalValues = definition.values;
  }
  return p;
}

var addError = function (self, text) {
  if (self._error === null)
    self._error = [];
  self._error.push(text);
}

Commands.prototype.isLegal = function(command, params) {
  if (!(command in this.commands))
    return false;
  return this.commands[command].params.check(params);
}

Commands.prototype.has = function (command) {
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
  keys.forEach(function (k) {
    if (!k in pos)
      return [key];
    pos = pos[k];
  })
  _.keys(pos).forEach(function (k) {
    if (k.indexOf(key) === 0)
      result.push(k);
  })
  if (result.length === 0)
    result.push(key);
  return result;
}

module.exports = Commands;

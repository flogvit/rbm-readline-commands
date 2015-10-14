/**
 * Created by flogvit on 2015-06-19.
 *
 * @copyright Cellar Labs AS, 2015, www.cellarlabs.com, all rights reserved
 * @file
 * @license GPL-3.0
 * @author Vegard Hanssen <Vegard.Hanssen@cellarlabs.com>
 *
 */

var _ = require('underscore');

function Result() {
  this.commandParts = [];
  this.params = {};
  this.expand = "";
}

Result.prototype.addCommand = function(param) {
  this.commandParts.push(param);
}

Result.prototype.getCommand = function () {
  return this.commandParts.join('.');
}

Result.prototype.getParam = function (param) {
  return _.has(this.params, param) ? this.params[param] : null;
}

Result.prototype.setParam = function(param, value) {
  this.params[param] = value;
}

Result.prototype.hasParam = function (param) {
  return _.has(this.params, param);
}

Result.prototype.getExpand = function () {
  return this.expand;
}

function Tree() {
  this.trees = [];
}

Tree.prototype.add = function(tree) {
  this.trees.push(tree);
}

Tree.prototype.evaluate = function(params) {
  // First to all the mandatory params
  this.trees.forEach(function(tree) {
    if (tree instanceof MandatoryParam)
      if (!tree.evaluate(params)) {
        return false;
    }
  })
  return true;
}

function Option(name) {
  this.name = name;
  this.value = '';
  this.inResult = false;
}

Option.prototype.tree = function(tree) {
  this.tree = tree;
}

Option.prototype.evaluate = function(params) {
  this.value = '';
  this.inResult = false;
  var param = params.length>0 ? params.shift() : null;
  var p = param;
  var value = '';

  if (_.isString(param) && param.indexOf('=')>-1) {
    var s = param.split('=');
    p = s[0];
    value = s[1];
  }
  var result = this.evaluateParam(p, value);
  if (result)
    result = this.tree.evaluate(params);

  console.log('Param '+this.name+' '+param+' '+result);
  if (param!=null)
    params.unshift(param);
  return result;
}

// Should be overridden
Option.prototype.evaluateParam = function(param, value) {
  if (this.name===param) {
    this.value = value ? value : param;
    this.inResult = true;
    return true;
  }
  return false;
}

function MandatoryName(name) {
  Option.call(this, name);
}

MandatoryName.prototype.__proto__ = Option.prototype;

function OptionalName(name) {
  Option.call(this, name);
}

OptionalName.prototype.__proto__ = Option.prototype;

function MandatoryParam(name) {
  Option.call(this, name);
}

MandatoryParam.prototype.__proto__ = Option.prototype;

function OptionalParam(name) {
  Option.call(this, name);
}

OptionalParam.prototype.__proto__ = Option.prototype;

OptionalParam.prototype.evaluateParam = function(param, value) {
  if (this.name===param) {
    this.value = value ? value : param;
    this.inResult = true;
  }
  return true;
}

function TheEnd() {}

TheEnd.prototype.__proto__ = Option.prototype;

function Parser() {
  this.text = "";
  this.result = null;
  this.tree = Tree();
}

Parser.prototype.init = function (commands) {
  this.tree = this.createTree(commands);
}

Parser.prototype.createTree = function(commands) {
  var self = this;
  var tree = new Tree();
  _.keys(commands).forEach(function(key) {
    if (key.substr(0, 2) === '[<') {
      var param = key.substr(2, key.length-4);
      var val = new OptionalParam(param);
      val.tree(self.createTree(commands[key]));
      tree.add(val);
    } else if (key.substr(0, 1) === '[') {
      var param = key.substr(1, key.length-2);
      var val = new OptionalName(param);
      val.tree(self.createTree(commands[key]));
      tree.add(val);
    } else if (key === '_') {
      tree.add(new TheEnd());
    } else if (key.substr(0, 1) === '<') {
      var param = key.substr(1, key.length-2);
      var val = new MandatoryParam(param);
      val.tree(self.createTree(commands[key]));
      tree.add(val);
    } else if (key.substr(0,1) !== '_') {
      var param = key;
      var val = new MandatoryName(param);
      val.tree(self.createTree(commands[key]));
      tree.add(val);
    }
  })
  return tree;
}

Parser.prototype.parse = function (text) {
  this.text = text;
  var parameters = this.text.split(' ');
  this.result = new Result();
  this.result.command = "";
  this.result.params = {};

  if (this.tree.evaluate(parameters, this.result)) {
    console.log("Found it");
  }
  return this.result;
}


module.exports = Parser;

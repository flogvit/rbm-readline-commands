/**
 * Created by flogvit on 2015-06-23.
 *
 * @copyright Cellar Labs AS, 2015, www.cellarlabs.com, all rights reserved
 * @file
 * @license GPL-3.0
 * @author Vegard Hanssen <Vegard.Hanssen@cellarlabs.com>
 *
 */

var _ = require('underscore');
var ParserString = require('@cellarlabs/rbm-keyvalue-parser');
var Commands = require(__dirname + '/lib/commands.js');


function Parser() {
  this.commands = new Commands();
}

Parser.prototype.init = function (commands) {
  this.commands.register(commands);
}

Parser.prototype.parse = function (text) {

}

Parser.prototype.expand = function (text, cb) {
  var pstring = new ParserString(text);

  this.expandCommand(pstring, function(err, res) {
    if (!err && !pstring.hasNext() && res.expands.length===0)
      res.expands = [text];
    cb(err, res);
  });
}

Parser.prototype.expandCommand = function (pstring, cb) {
  var result = {};
  result.expands = [];
  var command = pstring.hasNext() ? pstring.next()[0] : '';
  if (!pstring.hasNext()) {
    if (this.commands.hasCommand(command)) {
      result.command = command;
      result.expands.push(command);
    } else {
      result.expands = this.commands.expandCommand(command);
      if (result.expands.length===0)
        return cb(new Error('Unknown command'), result);
    }
    return cb(null, result);
  }
  if (!this.commands.hasCommand(command)) {
    return cb(new Error('Unknown command'), result);
  }
  result.command = command;
  this.expandParams(pstring, command, function(err, res, expanded) {
    result.params = res;
    result.expands.push(expanded);
    cb(err, result);
  })
}

Parser.prototype.expandParams = function (pstring, command, cb) {
  var result = {};
  var pos = [result];
  var keys = [];
  var expanded = command+' ';
  while (pstring.hasNext()) {
    var posnow = pos[pos.length-1];
    var next = pstring.next();
    var key = next[0];
    var value = next[1];
    // If we find a -, move one step down the stack
    if (key==='-') {
      pos.pop();
      keys.pop();
      if (pos.length==-1) {
        pos.push(result);
      }
      continue;
    }
    // If we find a +, move to the beginning of the stack
    if (key==='+') {
      pos = [result];
      keys = [];
      continue;
    }

    // Check for expanding
    key = this.commands.expandParamKey(command, key, keys)[0];

    // Undefined value means sub
    if (value === undefined) {
      if (key in posnow ) {
        pos.push(posnow[key]);
      } else {
        var newkey = {};
        posnow[key] = newkey;
        pos.push(newkey);
      }
      keys.push(key);
      expanded += key+' ';
      continue;
    }

    if (key in posnow) {
      if (_.isArray(posnow[key])) {
        posnow[key].push(value);
      } else {
        var prev = posnow[key];
        posnow[key] = [prev, value];
      }
    } else {
      posnow[key] = value;
    }
    expanded += key+'='+quoteValues(value)+' ';
  }
  cb(null, result, expanded.substr(0,expanded.length-1));
}

var quoteValues = function(value) {
  if (_.isArray(value)) {
    var res = [];
    value.forEach(function(v) {
      if (v.indexOf(' ')!== -1) {
        res.push('"'+v+'"')
      } else {
        res.push(v);
      }
    })
    return res.join(',');
  } else {
    if (value.indexOf(' ') !== -1)
      return '"' + value + '"';
    return value;
  }
}

module.exports = Parser;

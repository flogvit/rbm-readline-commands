/**
 * Created by flogvit on 2015-06-26.
 *
 * @copyright Cellar Labs AS, 2015, www.cellarlabs.com, all rights reserved
 * @file
 * @license GPL-3.0
 * @author Vegard Hanssen <Vegard.Hanssen@cellarlabs.com>
 *
 */

var _ = require('underscore');
var should = require('should');
require('assert');
var Parser = require('../parser.js');
var parser = new Parser();
var ParserString = require('@cellarlabs/rbm-keyvalue-parser');

describe('Check Expand Params', function () {
  var its = {
    'list=foo': {
      list: 'foo'
    },
    'list=foo list=bar': {
      list: ['foo', 'bar']
    },
    'list=foo bar foo=bar': {
      list: 'foo',
      bar: {
        foo: 'bar'
      }
    },
    'list=foo bar foo=bar - list=bar': {
      list: ['foo', 'bar'],
      bar: {
        foo: 'bar'
      }
    },
    'list=foo bar foo=bar bar bar=foo + list=bar bar foo=foo': {
      list: ['foo', 'bar'],
      bar: {
        foo: ['bar', 'foo'],
        bar: {
          bar: 'foo'
        }
      }
    }
  }

  _.keys(its).forEach(function (parse) {
    it('should expand "' + parse + '"', function (done) {
      var ans = its[parse];
      var ps = new ParserString(parse);
      parser.expandParams(ps, function (err, res) {
        should.not.exist(err);
        res.should.eql(ans);
        done();
      })
    })
  })

})

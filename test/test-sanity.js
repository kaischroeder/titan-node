'use strict';

var assert = require('assert');
var temp = require('temp');
var Gremlin = require('../lib/titan-gremlin');

// make sure we cleanup temporary files at exit
temp.track();

suite('sanity', function () {
  var gremlin;
  var graph;
  var g;

  suiteSetup(function () {
    gremlin = new Gremlin({ loglevel: 'OFF' });
  });

  setup(function () {
    var GraphOfTheGodsFactory = gremlin.java.import('com.thinkaurelius.titan.example.GraphOfTheGodsFactory');
    graph = GraphOfTheGodsFactory.createSync(temp.mkdirSync());
    g = gremlin.wrap(graph);
  });

  test('Who is Saturn\'s grandchild?', function (done) {
    g.V('name', 'saturn').next(function (err, saturn) {
      assert(!err && saturn);
      
      g.start(saturn).in('father').in('father').next(function (err, grandchild) {
        assert(!err && grandchild);

        grandchild.getProperty('name', function (err, name) {
          assert(!err && name === 'hercules');
          done();
        });
      });
    });
  });
});

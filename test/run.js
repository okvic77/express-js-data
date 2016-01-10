"use strict";
var should = require('should'),

  //var assert = require('assert'),
  http = require('http'),
  request = require('request'),
  async = require('async');

var express = require('express'),
  bodyParser = require('body-parser'),
  morgan = require('morgan');

var mongoose = require('mongoose');
var db = require('./mongoose');



var Bridge = require('../lib').default;


var api, app;


before('connect to database', function(done) {
  mongoose.connect('mongodb://docker/bridge', done);
})

before('clean data', function(done) {
  db.data.remove({}, done)
})

before('run server', function(done) {
  app = express();
  //app.use(morgan('dev'))
  app.use(bodyParser.json(), bodyParser.urlencoded({
    extended: true
  }));
  app.get('/', function(req, res) {
    res.send('hi');
  });
  app.listen(process.env.PORT || 3000, function(err) {
    api = request.defaults({
      baseUrl: `http://localhost:${this.address().port}/`,
      json: true
    });
    done(err);
  });
});

before(function() {
  var bridge = new Bridge({
    data: db.data
  });
  app.use('/bridge', bridge.router);
})

describe('test add and read', function() {


  Array(1, 2, 3).forEach(function(number) {
    describe(`Data ${number}`, function() {
      var create, id;
      it(`create`, function(done) {
        api.post('/bridge/data', {
          json: {
            number: number,
            hi: true
          }
        }, function(err, res, data) {
          res.statusCode.should.equal(200);
          data.should.have.property('_id');
          id = data._id;
          done(err);
        });
      });

      it(`read`, function(done) {
        api.get(`/bridge/data/${id}`, function(err, res, data) {
          res.statusCode.should.equal(200);
          data.should.have.property('_id');
          done(err);
        });
      });

      it(`update`, function(done) {
        api.put(`/bridge/data/${id}`, {
          json: {
            updated: true,
            more: {
              ok: true
            }
          }
        }, function(err, res, data) {
          res.statusCode.should.equal(200);
          data.should.have.property('_id');
          should(data.updated).be.exactly(true);
          done(err);
        });
      });

      it(`delete`, function(done) {
        api.del(`/bridge/data/${id}`, function(err, res, data) {
          res.statusCode.should.equal(200);
          done(err);
        });
      });


    })
  })
});




describe('action on collection', function() {
  it(`add sample data`, function(done) {
    async.each([{
      flag: true
    }, {
      flag: false
    }, {
      flag: null
    }], function(me, done) {
      api.post('/bridge/data', {
        json: me
      }, function(err, res, data) {
        done(err);
      });
    }, done)
  })



  it(`update flag`, function(done) {
    api.put(`/bridge/data`, {
      json: {
        flag: true
      }
    }, function(err, res, data) {
      res.statusCode.should.equal(200);
      data.ok.should.be.exactly(1)
      data.n.should.be.exactly(3)
      data.nModified.should.be.exactly(2)
      done(err);
    });
  })


  it(`delete`, function(done) {
    api.del(`/bridge/data`, function(err, res, data) {
      res.statusCode.should.equal(200);
      data.n.should.be.exactly(3)
      data.ok.should.be.exactly(1)
      done(err);
    });
  })


});

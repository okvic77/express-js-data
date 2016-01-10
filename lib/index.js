'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mongoose = function () {
  function Mongoose() {
    _classCallCheck(this, Mongoose);
  }

  _createClass(Mongoose, [{
    key: 'get',
    value: function get() {}
  }, {
    key: 'getAll',
    value: function getAll() {}
  }, {
    key: 'create',
    value: function create() {}
  }, {
    key: 'update',
    value: function update() {}
  }, {
    key: 'updateAll',
    value: function updateAll() {}
  }, {
    key: 'delete',
    value: function _delete() {}
  }, {
    key: 'deleteAll',
    value: function deleteAll() {}
  }]);

  return Mongoose;
}();

var Bridge = function () {
  function Bridge(data) {
    _classCallCheck(this, Bridge);

    this.id = '_id';
    this.router = (0, _express.Router)();
    this.data = data;
    this.createRouter();
    this.sets = [];
  }

  _createClass(Bridge, [{
    key: 'createRouter',
    value: function createRouter() {
      var _this = this;

      this.router.param('resource', function (req, res, next, value) {
        if (!(value in _this.data)) return next(new Error('no found'));
        req.model = _this.data[value];
        next();
      });

      this.router.route('/:resource/:id').get(function (req, res, next) {
        req.model.findOne(_defineProperty({}, _this.id, req.params.id), function (err, result) {
          if (err) return next(result);
          res.json(result);
        });
      }).put(function (req, res, next) {
        req.model.findOneAndUpdate(_defineProperty({}, _this.id, req.params.id), _underscore2.default.omit(req.body, _this.id), { new: true }, function (err, result) {
          if (err) return next(result);
          res.json(result);
        });
      }).delete(function (req, res, next) {
        req.model.findOneAndRemove(_defineProperty({}, _this.id, req.params.id), function (err, result, out) {
          if (err) return next(result);
          res.json(result);
        });
      });

      this.router.route('/:resource').get(function (req, res, next) {
        var options = {};
        req.model.find({}, {}, options, function (err, result) {
          if (err) return next(result);
          res.json(result);
        });
      }).post(function (req, res, next) {
        req.model.create(req.body, function (err, result) {
          if (err) return next(result);
          res.json(result);
        });
      }).put(function (req, res, next) {
        var query = {};
        req.model.update(query, { $set: _underscore2.default.omit(req.body, '_id') }, { multi: true }, function (err, result) {
          if (err) return next(result);
          res.json(result);
        });
      }).delete(function (req, res, next) {
        var query = {};
        req.model.remove(query, function (err, result) {
          if (err) return next(result);
          res.json(result);
        });
      });

      this.router.use(function (req, res, next) {
        res.status(400).json({});
      }, function (err, req, res, next) {
        console.log(err);
        res.status(500).json({});
      });
    }
  }]);

  return Bridge;
}();

exports.default = Bridge;
import { Router } from 'express'
import _ from 'underscore'


class Bridge {
  constructor(data) {
    this.id = '_id';
    this.router = Router();
    this.data = data;
    this.createRouter();
    this.sets = [];
  }
  createRouter() {

    this.router.param('resource', (req, res, next, value) => {
      if (!(value in this.data)) return next(new Error('no found'));
      req.model = this.data[value];
      next();
    });

    this.router.route('/:resource/:id').get((req, res, next) => {
      req.model.findOne({[this.id]:req.params.id}, function (err, result) {
        if (err) return next(result);
        res.json(result)
      })
    }).put((req, res, next) => {
      req.model.findOneAndUpdate({[this.id]:req.params.id}, _.omit(req.body, this.id), {new: true}, function (err, result) {
        if (err) return next(result);
        res.json(result)
      })
    }).delete((req, res, next) => {
      req.model.findOneAndRemove({[this.id]:req.params.id}, function (err, result, out) {
        if (err) return next(result);
        res.json(result)
      })
    });

    this.router.route('/:resource').get(function(req, res, next) {
      var options = req.query;
      var advanced = {
        limit: options.limit,
        skip: options.offset,
        lean: true
      }

      // TODO add tests for advanced query

      try {
        advanced.sort = JSON.parse(options.orderBy);
      } catch (e) {

      } finally {

      }

      var query = req.model.find(options.where, options.fields, advanced);


      // TODO with query populate

      
      query.exec(function (err, result) {
        if (err) return next(result);
        res.json(result)
      })
    }).post((req, res, next) => {
      req.model.create(req.body, function (err, result) {
        if (err) return next(result);
        res.json(result)
      })
    }).put((req, res, next) => {
      var query = {}
      req.model.update(query, {$set:_.omit(req.body, '_id')}, {multi: true}, function (err, result) {
        if (err) return next(result);
        res.json(result)
      })
    }).delete((req, res, next) => {
      var query = {}
      req.model.remove(query, function (err, result) {
        if (err) return next(result);
        res.json(result)
      })
    });

    this.router.use(function(req, res, next) {
      res.status(400).json({});
    }, function(err, req, res, next) {
      console.log(err);
      res.status(500).json({})
    });

  }
}

export default Bridge

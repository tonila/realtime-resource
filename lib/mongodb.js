"use strict";
module.exports = function(connection_string) {
  var debug = require('debug')('server:mongodb');
  var pmongo = require('promised-mongo');
  // default to a 'localhost' configuration:
  if (!connection_string) {
    throw 'db connection_string must be defined';
  }
  // if OPENSHIFT env variables are present, use the available connection info:
  if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
      process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
      process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
      process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
      process.env.OPENSHIFT_APP_NAME;
  }
  var db = pmongo('mongodb://' + connection_string);

  this.save = function(collection, data) {
    debug('save', collection);
    if (data._id) {
      data._id = pmongo.ObjectId(data._id);
    }
    return db.collection(collection).save(data);
  }

  this.remove = function(collection, id) {
    debug('remove', collection, id);
    return db.collection(collection).remove({
      _id: pmongo.ObjectId(id)
    });
  }

  this.get = function(collection, query, params) {
    debug('get', collection, query);
    var cursor;
    if (query && query._id) {
      query._id = pmongo.ObjectId(query._id);
    }
    if (params) {
      if (params.filter) {
        cursor = db.collection(collection).find(query, params.filter);
      } else {
        cursor = db.collection(collection).find(query);
      }
      if (params.limit) {
        cursor = cursor.limit(parseInt(params.limit));
      }
      if (params.skip) {
        cursor = cursor.skip(parseInt(params.skip));
      }
      if (params.sort) {
        cursor = cursor.sort(params.sort);
      }
    } else {
      cursor = db.collection(collection).find(query);
    }
    return cursor.toArray();
  }
  this.getOne = function(collection, query, params) {
    var cursor;
    debug('getOne', collection);
    if (query && query._id) {
      query._id = pmongo.ObjectId(query._id);
    }
    if (params) {
      if (params.filter) {
        cursor = db.collection(collection).find(query, params.filter);
      } else {
        cursor = db.collection(collection).find(query);
      }
      if (params.sort) {
        cursor = cursor.sort(params.sort);
      }
    } else {
      cursor = db.collection(collection).find(query);
    }
    return cursor.toArray().then(function(arr) {
      return arr[0];
    });
  }

  this.exists = function(collection, query) {
    debug('exists', collection, query);
    if (query && query._id) {
      query._id = pmongo.ObjectId(query._id);
    }
    return db.collection(collection).find(query, {
      _id: 1
    }).limit(1).toArray().then(function(item) {
      return (item && item.length);
    });
  }
  this.count = function(collection) {
    return db.collection(collection).count();
  }
}

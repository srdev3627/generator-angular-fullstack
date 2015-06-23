'use strict';<% if(filters.mongoose) { %>

var _ = require('lodash');
var <%= classedName %> = require('./<%= name %>.model');

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(function(updated) {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(function() {
          res.status(204).end();
        });
    }
  };
}<% } %>

// Get list of <%= name %>s
exports.index = function(req, res) {<% if (!filters.mongoose) { %>
  res.json([]);<% } %><% if (filters.mongoose) { %>
  <%= classedName %>.findAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));<% } %>
};<% if (filters.mongoose) { %>

// Gets a single <%= name %> from the DB.
exports.show = function(req, res) {
  <%= classedName %>.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new <%= name %> in the DB.
exports.create = function(req, res) {
  <%= classedName %>.createAsync(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Updates an existing <%= name %> in the DB.
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  <%= classedName %>.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a <%= name %> from the DB.
exports.destroy = function(req, res) {
  <%= classedName %>.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};<% } %>

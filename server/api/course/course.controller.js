'use strict';

var _ = require('lodash');
var Course = require('./course.model');

// Get list of courses in organization
exports.index = function(req, res) {
  Course.find({organization: req.user.organization},function (err, courses) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(courses);
  });
};

// Get list of courses the user is in
exports.userCourses = function(req, res) {
  var userId = req.user._id;
  User.findById(userId, function (err, user) {
    Course.find({_id: {$in: user.courses}}, function (err, courses) {
      if(err) { return handleError(res, err); }
      return res.status(200).json(courses);
    });
  });
};

// join a course
exports.join = function(req, res) {
  var userId = req.user._id;
  User.findById(userId, function (err, user) {
    if(err) { return handleError(res, err); }
    user.courses.push(req.params.id);
    user.save(function(err) {
      if(err) { return handleError(res, err); }
      res.status(200).json(user);
    });
  });
};

// Get a single course
exports.show = function(req, res) {
  Course.findById(req.params.id, function (err, course) {
    if(err) { return handleError(res, err); }
    if(!course) { return res.status(404).send('Not Found'); }
    return res.json(course);
  });
};

// Creates a new course in the DB.
exports.create = function(req, res) {
  Course.create(req.body, function(err, course) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(course);
  });
};

// Updates an existing course in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Course.findById(req.params.id, function (err, course) {
    if (err) { return handleError(res, err); }
    if(!course) { return res.status(404).send('Not Found'); }
    var updated = _.merge(course, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(course);
    });
  });
};

// Deletes a course from the DB.
exports.destroy = function(req, res) {
  Course.findById(req.params.id, function (err, course) {
    if(err) { return handleError(res, err); }
    if(!course) { return res.status(404).send('Not Found'); }
    course.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
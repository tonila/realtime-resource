'use strict';

Zepto(function($) {
  var body = $(document.body);
  var table = $('#tests');

  var $C = function(name) {
    return $(document.createElement(name));
  }

  var button = $C('button').text('Add test').appendTo(body);
  button.click(function() {
    var t = test.create({one: 'one', two: 'two'});
    t.save();
  });

  function addTest(t) {
    var tr = $C('tr').attr('id', t._id).appendTo(table);
    $C('td').text(t._id).appendTo(tr);
    $C('td').text(t.one).appendTo(tr);
    $C('td').text(t.two).appendTo(tr);
    var td = $C('td').appendTo(tr);
    var b = $C('button').text('remove').appendTo(td);
    b.click(function() {
      t.remove();
    });
  }

  function removeTest(id) {
    $('#' + id).remove();
  }

  // create test Resource
  var Resource = require('resource');
  var test = new Resource('test');

  // initial get call to receive all tests
  test.get({}, function(err, tests) {
    for (var i = 0, len = tests.length; i < len; i++) {
      addTest(tests[i]);
    }
  });

  // start listening on save events
  test.on('save', function(err, data) {
    addTest(data);
  });

  // start listening on save events
  test.on('remove', function(err, id) {
    removeTest(id);
  });
});

module.exports = function (grunt) {
  'use strict';
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // start development server at port 9000
    connect: {
      web: {
        options: {
          port: 3333,
          hostname: '127.0.0.1',
          bases: '.',
          keepalive: true,
          open:{
            target: 'http://localhost:3333', // target url to open
            callback: function() {} // called when the app has opened
          }
        }
      }
    },

    // improves run time by running tasks concurrently
    concurrent: {
      tasks: ['connect'],
      options: {
        logConcurrentOutput: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('default', ['concurrent']);
};

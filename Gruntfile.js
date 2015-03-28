module.exports = function (grunt) {
  'use strict';
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    nodemon: {
      dev: {
        script: 'server.js'
      }
    },
    // improves run time by running tasks concurrently
    concurrent: {
      tasks: ['nodemon'],
      options: {
        logConcurrentOutput: true
      }
    },

    browserify: {
      js: {
        src: 'resource.js',
        dest: 'dist/resource.js',
        options: {
          alias:['resource:resource']
        }
      }
    },

    uglify : {
      js: {
        files: {
          'dist/resource.min.js' : [ 'dist/resource.js' ]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['concurrent']);
  grunt.registerTask('build', ['browserify', 'uglify']);
};

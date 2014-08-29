module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    build: {
      version: '_<%= grunt.template.today("yyyy-mm-dd-HHMM") %>_<%= pkg.version %>',
      dir: "client/rsvp/"
    },

    neuter: {

      '<%= build.dir %>/application.js': 'client/rsvp/app/app.js'
    },
    /*
      Finds Handlebars templates and precompiles them into functions.
      The provides two benefits:

      1. Templates render much faster
      2. We only need to include the handlebars-runtime microlib
         and not the entire Handlebars parser.

      Files will be written out to dependencies/compiled/templates.js
      which is required within the project files so will end up
      as part of our application.

      The compiled result will be stored in
      Ember.TEMPLATES keyed on their file path (with the 'client/rsvp/app/templates' stripped)
    */
    emberTemplates: {
      options: {
        templateName: function(sourceFile) {
          return sourceFile.replace(/client\/rsvp\/app\/templates\//, '').replace(/_template/, "");
        }
      },
      'client/dependencies/compiled/templates.js': ["client/rsvp/app/templates/**/*.hbs"]
    }
  });

  grunt.loadNpmTasks('grunt-neuter');
  grunt.loadNpmTasks('grunt-ember-templates');

  // Default task(s).
  grunt.registerTask('default', ['emberTemplates', 'neuter']);

};

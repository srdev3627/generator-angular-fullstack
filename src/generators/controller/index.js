'use strict';
var yeoman = require('yeoman-generator');

var Generator = yeoman.Base.extend({
  compose: function() {
    this.composeWith('ng-component:controller', {arguments: this.arguments}, { local: require.resolve('generator-ng-component/generators/controller') });
  }
});

module.exports = Generator;

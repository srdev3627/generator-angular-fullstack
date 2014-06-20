'use strict';
var yeoman = require('yeoman-generator');

var Generator = yeoman.generators.Base.extend({
  compose: function() {
    this.composeWith('ng-component:route', {arguments: this.arguments});
  }
});

module.exports = Generator;
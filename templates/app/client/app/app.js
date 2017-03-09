'use strict';
import angular from 'angular';
// import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
import ngValidationMatch from 'angular-validation-match';
<%_ if(filters.socketio) { _%>
import 'angular-socket-io';<% } %>
<%_ if(filters.ngroute) { _%>
const ngRoute = require('angular-route');<% } %>
<%_ if(filters.uirouter) { _%>
import uiRouter from 'angular-ui-router';<% } %>
<%_ if(filters.uibootstrap) { _%>
import uiBootstrap from 'angular-ui-bootstrap';<% } %>
// import ngMessages from 'angular-messages';
<%_ if(filters.auth) { _%>
<% } %>


import {routeConfig} from './app.config';

<%_ if(filters.auth) { _%>
import _Auth from '../components/auth/auth.module';
import account from './account';
import admin from './admin';<% } %>
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import constants from './app.constants';
import util from '../components/util/util.module';
<%_ if(filters.socketio) { _%>
import socket from '../components/socket/socket.service';<% } %>


import './app.<%= styleExt %>';

angular.module('<%= scriptAppName %>', [
  ngCookies,
  ngResource,
  ngSanitize,
  'validation.match',
  <%_ if(filters.socketio) { %>
  'btford.socket-io',<% } %>
  <%_ if(filters.ngroute) { %>
  ngRoute,<% } _%>
  <%_ if(filters.uirouter) { %>
  uiRouter,<% } _%>
  <%_ if(filters.uibootstrap) { %>
  uiBootstrap,<% } %>
  <%_ if(filters.auth) { %>
  _Auth,
  account,
  admin,<% } _%>
  navbar,
  footer,
  main,
  constants,
  <%_ if(filters.socketio) { _%>
  socket,<% } %>
  util
])
  .config(routeConfig)
  <%_ if(filters.auth) { _%>
  .run(function($rootScope, $location, Auth) {
    'ngInject';
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function(event, next) {
      Auth.isLoggedIn(function(loggedIn) {
        if(next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  })<% } %>;

angular
  .element(document)
  .ready(() => {
    angular.bootstrap(document, ['<%= scriptAppName %>'], {
      strictDi: true
    });
  });

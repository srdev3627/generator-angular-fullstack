'use strict';

angular.module('<%= scriptAppName %>', [<%= angularModules %>])
  <% if (filters.ngroute) { %>.config(function($routeProvider, $locationProvider<% if (filters.auth) { %>, $httpProvider<% } %>) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);<% if (filters.auth) { %>
    $httpProvider.interceptors.push('authInterceptor');<% } %>
  })<% } if (filters.uirouter) { %>.config(function($stateProvider, $urlRouterProvider, $locationProvider<% if (filters.auth) { %>, $httpProvider<% } %>) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);<% if (filters.auth) { %>
    $httpProvider.interceptors.push('authInterceptor');<% } %>
  })<% } if (filters.auth) { %>

  .factory('authInterceptor', function($rootScope, $q, $cookieStore<% if (filters.ngroute) { %>, $location<% } if (filters.uirouter) { %>, $injector<% } %>) {
    <% if (filters.uirouter) { %>var state;
    <% } %>return {
      // Add authorization token to headers
      request: function(config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if (response.status === 401) {
          <% if (filters.ngroute) { %>$location.path('/login');<% } if (filters.uirouter) { %>(state || (state = $injector.get('$state'))).go('login');<% } %>
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function($rootScope<% if (filters.ngroute) { %>, $location<% } if (filters.uirouter) { %>, $state<% } %>, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on(<% if (filters.ngroute) { %>'$routeChangeStart'<% } %><% if (filters.uirouter) { %>'$stateChangeStart'<% } %>, function(event, next) {
      Auth.isLoggedIn(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          event.preventDefault();
          <% if (filters.ngroute) { %>$location.path('/login');<% } if (filters.uirouter) { %>$state.go('login');<% } %>
        }
      });
    });
  })<% } %>;

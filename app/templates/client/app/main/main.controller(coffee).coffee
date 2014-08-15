'use strict'

angular.module '<%= scriptAppName %>'
.controller 'MainCtrl', ($scope, $http<% if(filters.socketio) { %>, socket<% } %><% if(filters.uibootstrap && filters.mongoose) { %>, Modal<% } %>) ->
  $scope.awesomeThings = []

  $http.get('/api/things').success (awesomeThings) ->
    $scope.awesomeThings = awesomeThings
    <% if(filters.socketio) { %>socket.syncUpdates 'thing', $scope.awesomeThings<% } %>
<% if(filters.mongoose) { %>
  $scope.addThing = ->
    return if $scope.newThing is ''
    $http.post '/api/things',
      name: $scope.newThing

    $scope.newThing = ''

  $scope.deleteThing = <% if(filters.uibootstrap) { %>Modal.confirm.delete <% } %>(thing) ->
    $http.delete '/api/things/' + thing._id<% } %><% if(filters.socketio) { %>

  $scope.$on '$destroy', ->
    socket.unsyncUpdates 'thing'<% } %>
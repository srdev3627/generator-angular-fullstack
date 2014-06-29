# global io 

'use strict'

angular.module('<%= scriptAppName %>').factory 'socket', (socketFactory) ->
  retryInterval = 5000
  retryTimer = undefined
  clearInterval retryTimer
  ioSocket = io.connect('',
    'force new connection': true
    'max reconnection attempts': Infinity
    'reconnection limit': 10 * 1000
    # Send auth token on connection
    # 'query': 'token=' + Auth.getToken()
  )
  
  retryTimer = setInterval(->
    ioSocket.connect()  if not ioSocket.socket.connected and not ioSocket.socket.connecting and not ioSocket.socket.reconnecting
  , retryInterval)
  socket = socketFactory(ioSocket: ioSocket)

  socket: socket

  ###
  Register listeners to sync an array with updates on a model

  Takes the array we want to sync, the model name that socket updates are sent from,
  and an optional callback function after new items are updated.

  @param {String} modelName
  @param {Array} array
  @param {Function} cb
  ###
  syncUpdates: (modelName, array, cb) ->
    cb = cb or angular.noop

    ###
    Syncs item creation/updates on 'model:save'
    ###
    socket.on modelName + ":save", (newItem) ->
      oldItem = _.find(array,
        _id: newItem._id
      )
      index = array.indexOf(oldItem)

      # replace oldItem if it exists
      # otherwise just add newItem to the collection
      if oldItem
        array.splice index, 1, newItem
      else
        array.push newItem
      cb array

    ###
    Syncs removed items on 'model:remove'
    ###
    socket.on modelName + ":remove", (newItem) ->
      _.remove array,
        _id: newItem._id

      cb array

  ###
  Removes listeners for a models updates on the socket

  @param modelName
  ###
  unsyncUpdates: (modelName) ->
    socket.removeAllListeners modelName + ":save"
    socket.removeAllListeners modelName + ":remove"
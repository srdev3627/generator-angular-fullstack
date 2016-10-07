# Starting your app

Now that you've gone through everything in the Getting Started section, lets get our app up and running. We do this by running the following:

```bash
$ gulp serve
```

We should see something like this spit out after it:

```bash
$ gulp serve
[12:15:45] Requiring external module babel-register
(node:23392) fs: re-evaluating native module sources is not supported. If you are using the graceful-fs module, please update it to a more recent version.
[12:16:03] Using gulpfile ~/aftest/gulpfile.babel.js
(node:23392) DeprecationWarning: crypto.createCredentials is deprecated. Use tls.createSecureContext instead.
(node:23392) DeprecationWarning: crypto.Credentials is deprecated. Use tls.SecureContext instead.
[12:16:04] Starting 'serve'...
[12:16:04] Starting 'clean:tmp'...
[12:16:04] Starting 'lint:scripts'...
[12:16:04] Starting 'lint:scripts:client'...
[12:16:04] Starting 'lint:scripts:server'...
[12:16:04] Starting 'inject'...
[12:16:04] Starting 'inject:scss'...
[12:16:04] Starting 'copy:fonts:dev'...
[12:16:04] Starting 'env:all'...
[12:16:04] Finished 'env:all' after 63 ms
[12:16:04] Finished 'clean:tmp' after 370 ms
[12:16:06] gulp-inject 6 files into app.scss.
[12:16:06] Finished 'inject:scss' after 2.63 s
[12:16:06] Finished 'inject' after 2.63 s
[12:16:08] Finished 'copy:fonts:dev' after 4.04 s
[12:16:08] Finished 'lint:scripts:server' after 4.74 s
[12:16:09] Finished 'lint:scripts:client' after 5.33 s
[12:16:09] Finished 'lint:scripts' after 5.33 s
[12:16:09] Starting 'start:server'...
[12:16:09] Finished 'start:server' after 16 ms
[12:16:09] Starting 'start:client'...
[nodemon] 1.9.2
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: /home/user/aftest/server/**/*
[nodemon] starting `node server`
(node:22180) DeprecationWarning: crypto.createCredentials is deprecated. Use tls.createSecureContext instead.
(node:22180) DeprecationWarning: crypto.Credentials is deprecated. Use tls.SecureContext instead.
Express server listening on 9000, in development mode
(node:22180) DeprecationWarning: crypto.pbkdf2 without specifying a digest is deprecated. Please specify a digest
[12:16:18] Finished 'start:client' after 8.97 s
[12:16:18] Starting 'watch'...
[12:16:18] Finished 'watch' after 234 ms
[12:16:18] Finished 'serve' after 15 s
finished populating users
webpack: wait until bundle finished: /
[BS] Proxying: http://localhost:9000
[BS] Access URLs:
 ----------------------------------
       Local: http://localhost:3000
    External: http://10.0.75.1:3000
 ----------------------------------
          UI: http://localhost:3002
 UI External: http://10.0.75.1:3002
 ----------------------------------
webpack done hook
Hash: eb4e167635a3952856e9
Version: webpack 1.13.1
Time: 16538ms
                  Asset     Size  Chunks             Chunk Names
          app.bundle.js  2.83 MB       0  [emitted]  app
    polyfills.bundle.js   209 kB       1  [emitted]  polyfills
       vendor.bundle.js  2.62 MB       2  [emitted]  vendor
      app.bundle.js.map  3.34 MB       0  [emitted]  app
polyfills.bundle.js.map   271 kB       1  [emitted]  polyfills
   vendor.bundle.js.map  3.06 MB       2  [emitted]  vendor
   ../client/index.html  1.39 kB          [emitted]
Child html-webpack-plugin for "..\client\index.html":
                   Asset     Size  Chunks       Chunk Names
    ../client/index.html  2.69 kB       0
webpack: bundle is now VALID.
```

And then our default browser should open up to the app:


<img src="/images/afs-screenshot.png" style="max-width: 800px; box-shadow: 0px 6px 6px -3px rgba(0, 0, 0, 0.2), 0px 10px 14px 1px rgba(0, 0, 0, 0.14), 0px 4px 18px 3px rgba(0, 0, 0, 0.12);" alt="App Screenshot">


Fantastic! We're now up and running with our Full-Stack Angular web application! So what can it do?

### Homepage

Assuming you scaffolded with a back-end database, you should see some 'features'. If you scaffolded with socket.io, you should see 'x' buttons next to each, and an input box. Try opening two browser windows to the same page side-by-side, and hitting the 'x' on one of the features. You should see the feature get removed on both web pages. Neat! This is because these database object changes are communicated to clients using socket.io.


<img src="/images/socket.io-demo.gif" style="max-width: 800px; box-shadow: 0px 6px 6px -3px rgba(0, 0, 0, 0.2), 0px 10px 14px 1px rgba(0, 0, 0, 0.14), 0px 4px 18px 3px rgba(0, 0, 0, 0.12);" alt="Socket.io demo">


Neat. Let's see what else we can do.

### Sign Up

[TODO]

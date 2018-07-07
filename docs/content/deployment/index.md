---
title: Deployment
sort: 0
---

[STUB]

# Deployment

## Manual (Linux server)

1. Run `gulp build`. This will build your project into the `dist` folder by default.

2. Zip up the contents of your `dist` folder and send it off to your server.

3. On your server, unzip your built files somewhere on the disk. Ex: in a `myproj` folder.

4. ```bash
$ cd myproj
```

5. ```
$ NODE_ENV=production node ./server
```

## [Gcloud App Engine (Standard Environment)](gcloud-deployment.md)
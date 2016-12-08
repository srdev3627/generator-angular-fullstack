# Documentation Home

## Generators

Available generators:

* App
    - [angular-fullstack](Generators/app.md) (aka [angular-fullstack:app](Generators/app.md))
* Server Side
    - [angular-fullstack:endpoint](Generators/endpoint.md)
* Client Side (via [generator-ng-component](https://github.com/DaftMonk/generator-ng-component))
    - [angular-fullstack:route](Generators/route.md)
    - [angular-fullstack:component](Generators/component.md)
    - [angular-fullstack:controller](Generators/controller.md)
    - [angular-fullstack:filter](Generators/filter.md)
    - [angular-fullstack:directive](Generators/directive.md)
    - [angular-fullstack:service](Generators/service.md)
    - [angular-fullstack:provider](Generators/service.md)
    - [angular-fullstack:factory](Generators/service.md)
    - [angular-fullstack:decorator](Generators/decorator.md)
* Deployment
    - [angular-fullstack:openshift](Generators/openshift.md)
    - [angular-fullstack:heroku](Generators/heroku.md)


## Injection

A gulp task looks for new SCSS/LESS/Stylus files in your `client/app` and `client/components` folder and automatically injects them into the main style file (ex `client/app/app.scss`) based on an injection block.


## Configuration
Yeoman generated projects can be further tweaked according to your needs by modifying project files appropriately.

A `.yo-rc` file is generated for helping you copy configuration across projects, and to allow you to keep track of your settings. You can change this as you see fit.

## Testing

Running `gulp test` will run the client and server unit tests with karma and mocha.

Use `gulp test:server` to only run server tests.

Use `gulp test:client` to only run client tests.

**Protractor tests**

To setup protractor e2e tests, you must first run

`npm run update-webdriver`

Use `gulp test:e2e` to have protractor go through tests located in the `e2e` folder.

**Code Coverage**

Use `gulp test:coverage` to run mocha-istanbul and generate code coverage reports.

`coverage/server` will be populated with `e2e` and `unit` folders containing the `lcov` reports.

The coverage taget has 3 available options:
- `test:coverage:unit` generate server unit test coverage
- `test:coverage:e2e` generate server e2e test coverage
- `test:coverage:check` combine the coverage reports and check against predefined thresholds

* *when no option is given `test:coverage` runs all options in the above order*

**Debugging**

Use `gulp serve:debug` for a more debugging-friendly environment.

## Environment Variables

Keeping your app secrets and other sensitive information in source control isn't a good idea.
To have gulp launch your app with specific environment variables, add them to the git ignored environment config file: `server/config/local.env.js`.

## Project Structure

Overview

    ├── client
    │   ├── app                 - All of our app specific components go in here
    │   ├── assets              - Custom assets: fonts, images, etc…
    │   ├── components          - Our reusable components, non-specific to our app
    │
    ├── e2e                     - Our protractor end to end tests
    │
    └── server
        ├── api                 - Our apps server api
        ├── auth                - For handling authentication with different auth strategies
        ├── components          - Our reusable or app-wide components
        ├── config              - Where we do the bulk of our apps configuration
        │   └── local.env.js    - Keep our environment variables out of source control
        │   └── environment     - Configuration specific to the node environment
        └── views               - Server rendered views

An example client component in `client/app`

    main
    ├── main.js                 - Routes
    ├── main.controller.js      - Controller for our main route
    ├── main.controller.spec.js - Test
    ├── main.html               - View
    └── main.less               - Styles

An example server component in `server/api`

    thing
    ├── index.js                - Routes
    ├── thing.controller.js     - Controller for our `thing` endpoint
    ├── thing.model.js          - Database model
    ├── thing.socket.js         - Register socket events
    └── thing.spec.js           - Test

import {exec} from 'child_process';
import path from 'path';
import Promise from 'bluebird';
import { runCmd } from '../util';
import { Base } from '../generator-base';
import insight from '../insight-init';
import tap from 'gulp-tap';
import filter from 'gulp-filter';
import eslint from 'gulp-eslint';
import html2jade from 'gulp-html2jade';
import rename from 'gulp-rename';
import semver from 'semver';
import jscodeshift from 'jscodeshift';

export class Generator extends Base {
  constructor(...args) {
    super(...args);

    this.argument('name', { type: String, required: false });

    this.option('skip-install', {
      desc: 'Do not install dependencies',
      type: Boolean,
      defaults: false
    });

    // This is mainly for development purposes
    this.option('skip-config', {
      desc: 'Always use existing .yo-rc.json',
      type: Boolean,
      defaults: false
    });

    // this.option('app-suffix', {
    //   desc: 'Allow a custom suffix to be added to the module name',
    //   type: String,
    //   defaults: 'App'
    // });

    this.option('dev-port', {
      desc: 'Port to use for the development HTTP server',
      type: String,
      defaults: '9000'
    });

    this.option('debug-port', {
      desc: 'Port to use for the server debugger',
      type: String,
      defaults: '5858'
    });

    this.option('prod-port', {
      desc: 'Port to use for the production HTTP Server',
      type: String,
      defaults: '8080'
    });
  }

  get initializing() {
    return {
      init: function () {
        this.config.set('generatorVersion', this.rootGeneratorVersion());
        this.filters = {};

        let promises = [];

        if(process.env.CI) {
          insight.optOut = true;
        } else if(insight.optOut === undefined) {
          promises.push(new Promise((resolve, reject) => {
            insight.askPermission(null, (err, optIn) => {
              if(err) return reject(err);
              else return resolve(optIn);
            });
          }));
        }

        insight.track('generator', this.rootGeneratorVersion());
        this.nodeVersion = semver.clean(process.version);
        this.semver = semver;
        insight.track('node', this.nodeVersion);
        insight.track('platform', process.platform);

        const npmVersionPromise = runCmd('npm --version').then(stdout => {
          this.npmVersion = stdout.toString().trim();
          return insight.track('npm', this.npmVersion);
        });
        promises.push(npmVersionPromise);

        return Promise.all(promises);
      },
      info: function () {
        this.log(this.yoWelcome);
        this.log(`Angular Fullstack v${this.rootGeneratorVersion()}\n`);
        this.log('Out of the box I create an Angular app with an Express server.\n');
      },
      checkForConfig: function() {
        const existingFilters = this.config.get('filters');

        if(!existingFilters) return;

        let promise = this.options['skip-config']
          ? Promise.resolve({skipConfig: true})
          : this.prompt([{
              type: 'confirm',
              name: 'skipConfig',
              message: 'Existing .yo-rc configuration found, would you like to use it?',
              default: true,
            }]);

        return promise.then(answers => {
          this.skipConfig = answers.skipConfig;

          if(this.skipConfig) {
            insight.track('skipConfig', 'true');
            this.filters = existingFilters;

            this.scriptExt = this.filters.ts ? 'ts' : 'js';
            this.templateExt = this.filters.pug ? 'pug' : 'html';
            this.styleExt = this.filters.sass ? 'scss' :
              this.filters.less ? 'less' :
              this.filters.stylus ? 'styl' :
              'css';
          } else {
            insight.track('skipConfig', 'false');
            this.filters = {};
            this.forceConfig = true;
            this.config.set('filters', this.filters);
            this.config.save();
          }
        });
      },
      assignPorts() {
        this.devPort = this.options['dev-port'];
        this.debugPort = this.options['debug-port'];
        this.prodPort = this.options['prod-port'];
      }
    };
  }

  get prompting() {
    return {
      clientPrompts: function() {
        if(this.skipConfig) return;

        this.log('# Client\n');

        return this.prompt([{
            type: 'list',
            name: 'transpiler',
            message: 'What would you like to write scripts with?',
            choices: ['TypeScript', 'Babel'],
            filter: val => {
              return {
                'Babel': 'babel',
                'TypeScript': 'ts'
              }[val];
            }
          }, {
            type: 'confirm',
            name: 'flow',
            default: true,
            message: 'Would you like to use Flow types with Babel?',
            when: answers => answers.transpiler === 'babel'
          }, {
            type: 'list',
            name: 'markup',
            message: 'What would you like to write markup with?',
            choices: ['HTML', 'Pug'],
            filter: val => val.toLowerCase()
          }, {
            type: 'list',
            name: 'stylesheet',
            default: 1,
            message: 'What would you like to write stylesheets with?',
            choices: ['CSS', 'Sass', 'Stylus', 'Less'],
            filter: val => val.toLowerCase()
          },  {
          //  type: 'list',
          //  name: 'router',
          //  default: 1,
          //  message: 'What Angular router would you like to use?',
          //  choices: ['ngRoute', 'uiRouter'],
          //  filter: val => val.toLowerCase()
          //}, {
            type: 'confirm',
            name: 'bootstrap',
            message: 'Would you like to include Bootstrap?'
          }, {
            type: 'confirm',
            name: 'uibootstrap',
            message: 'Would you like to include UI Bootstrap?',
            when: answers => answers.bootstrap
          }]).then(answers => {
            this.filters.js = true;
            this.filters[answers.transpiler] = true;
            insight.track('transpiler', answers.transpiler);

            this.filters.flow = !!answers.flow;
            insight.track('flow', !!answers.flow);

            this.filters[answers.markup] = true;
            insight.track('markup', answers.markup);

            this.filters[answers.stylesheet] = true;
            insight.track('stylesheet', answers.stylesheet);

            //this.filters[answers.router] = true;
            //insight.track('router', answers.router);
            this.filters.ngroute = true;

            this.filters.bootstrap = !!answers.bootstrap;
            insight.track('bootstrap', !!answers.bootstrap);

            this.filters.uibootstrap =  !!answers.uibootstrap;
            insight.track('uibootstrap', !!answers.uibootstrap);

            this.scriptExt = answers.transpiler === 'ts' ? 'ts' : 'js';
            this.templateExt = answers.markup;

            const styleExt = {sass: 'scss', stylus: 'styl'}[answers.stylesheet];
            this.styleExt = styleExt ? styleExt : answers.stylesheet;
          });
      },
      serverPrompts: function() {
        if(this.skipConfig) return;

        this.log('\n# Server\n');

        return this.prompt([{
          type: 'checkbox',
          name: 'odms',
          message: 'What would you like to use for data modeling?',
          choices: [{
            value: 'mongoose',
            name: 'Mongoose (MongoDB)',
            checked: true
          }, {
            value: 'sequelize',
            name: 'Sequelize (MySQL, SQLite, MariaDB, PostgreSQL)',
            checked: false
          }]
        }, {
          type: 'list',
          name: 'models',
          message: 'What would you like to use for the default models?',
          choices: [ 'Mongoose', 'Sequelize' ],
          filter: val => val.toLowerCase(),
          when: answers => answers.odms && answers.odms.length > 1
        }, {
          type: 'confirm',
          name: 'auth',
          message: 'Would you scaffold out an authentication boilerplate?',
          when: answers => answers.odms && answers.odms.length !== 0
        }, {
          type: 'checkbox',
          name: 'oauth',
          message: 'Would you like to include additional oAuth strategies?',
          when: answers => answers.auth,
          choices: [{
            value: 'googleAuth',
            name: 'Google',
            checked: false
          }, {
            value: 'facebookAuth',
            name: 'Facebook',
            checked: false
          }, {
            value: 'twitterAuth',
            name: 'Twitter',
            checked: false
          }]
        }, {
          type: 'confirm',
          name: 'ws',
          message: 'Would you like to use WebSockets?',
          // to-do: should not be dependent on ODMs
          when: answers => answers.odms && answers.odms.length !== 0,
          default: true
        }]).then(answers => {
          if(answers.ws) this.filters.ws = true;
          insight.track('ws', !!answers.ws);

          if(answers.auth) this.filters.auth = true;
          insight.track('auth', !!answers.auth);

          if(answers.odms && answers.odms.length > 0) {
            let models;
            if(!answers.models) {
              models = answers.odms[0];
            } else {
              models = answers.models;
            }
            this.filters.models = true;
            this.filters[models + 'Models'] = true;
            answers.odms.forEach(odm => {
              this.filters[odm] = true;
            });
            insight.track('oauth', !!answers.oauth);
          } else {
            this.filters.noModels = true;
          }
          insight.track('odms', answers.odms && answers.odms.length > 0);
          insight.track('mongoose', !!this.filters.mongoose);
          insight.track('mongooseModels', !!this.filters.mongooseModels);
          insight.track('sequelize', !!this.filters.sequelize);
          insight.track('sequelizeModels', !!this.filters.sequelizeModels);

          if(answers.oauth) {
            if(answers.oauth.length) this.filters.oauth = true;
            answers.oauth.forEach(oauthStrategy => {
              this.filters[oauthStrategy] = true;
            });
          }
          insight.track('oauth', !!this.filters.oauth);
          insight.track('google-oauth', !!this.filters.googleAuth);
          insight.track('facebook-oauth', !!this.filters.facebookAuth);
          insight.track('twitter-oauth', !!this.filters.twitterAuth);
        });
      },
      projectPrompts: function() {
        if(this.skipConfig) return;

        this.log('\n# Project\n');

        return this.prompt([{
          type: 'list',
          name: 'testing',
          message: 'What would you like to write tests with?',
          choices: ['Jasmine', 'Mocha + Chai + Sinon'],
          default: 1,
          filter: function(val) {
            return {
              'Jasmine': 'jasmine',
              'Mocha + Chai + Sinon': 'mocha'
            }[val];
          }
        }, {
          type: 'list',
          name: 'chai',
          message: 'What would you like to write Chai assertions with?',
          choices: ['Expect', 'Should'],
          filter: val => val.toLowerCase(),
          when: answers => answers.testing === 'mocha'
        }]).then(answers => {
          this.filters[answers.testing] = true;
          insight.track('testing', answers.testing);
          if(answers.testing === 'mocha') {
            this.filters.jasmine = false;
            this.filters.should = false;
            this.filters.expect = false;
            this.filters[answers.chai] = true;
            insight.track('chai-assertions', answers.chai);
          }
          if(answers.testing === 'jasmine') {
            this.filters.mocha = false;
            this.filters.should = false;
            this.filters.expect = false;
          }
        });
      }
    };
  }

  get configuring() {
    return {
      saveSettings: function() {
        if(this.skipConfig) return;
        this.config.set('endpointDirectory', 'server/api/');
        this.config.set('insertRoutes', true);
        this.config.set('registerRoutesFile', 'server/routes.js');
        this.config.set('routesNeedle', '// Insert routes below');

        this.config.set('routesBase', '/api/');
        this.config.set('pluralizeRoutes', true);

        this.config.set('insertSockets', true);
        this.config.set('registerSocketsFile', 'server/config/websockets.js');
        this.config.set('socketsNeedle', '// Insert sockets below');

        this.config.set('insertModels', true);
        this.config.set('registerModelsFile', 'server/sqldb/index.js');
        this.config.set('modelsNeedle', '// Insert models below');

        this.config.set('filters', this.filters);
        this.config.save();
      },
      angularComponent: function() {
        if(this.skipConfig) return;
        const appPath = 'client/app/';
        const extensions = [];
        const filters = [
          'jasmine',
          'mocha',
          'expect',
          'should'
        ].filter(v => this.filters[v]);

        if(this.filters.babel) extensions.push('babel');
        if(this.filters.ts) extensions.push('ts');
        if(this.filters.js) extensions.push('js');
        if(this.filters.html) extensions.push('html');
        if(this.filters.pug) extensions.push('pug');
        if(this.filters.css) extensions.push('css');
        if(this.filters.stylus) extensions.push('styl');
        if(this.filters.sass) extensions.push('scss');
        if(this.filters.less) extensions.push('less');

        this.composeWith(require.resolve('generator-angular-fullstack-component/generators/app/index.js'), {
          appModulePath: `${appPath}app.module.${this.filters.ts ? 'ts' : 'js'}`,
          routeDirectory: appPath,
          directiveDirectory: appPath,
          filterDirectory: appPath,
          serviceDirectory: appPath,
          componentDirectory: `${appPath}components/`,
          filters: filters,
          extensions: extensions,
          basePath: 'client',
          forceConfig: this.forceConfig
        });
      },
    };
  }

  get default() {
    return {};
  }

  get writing() {
    return {
      generateProject: function() {
        const flow = this.filters.flow;

        const genDir = path.join(__dirname, '../../');

        // TODO: remove babel stuff from dependencies
        const codeshiftStream = tap(function(file) {
          let contents = file.contents.toString();

          if(!flow) {
            // remove `implements Foo` from class declarations
            contents = jscodeshift(contents)
              .find(jscodeshift.ClassDeclaration)
              .forEach(path => {
                path.value.implements = null;
              })
              .toSource();

            // remove any type annotations
            contents = jscodeshift(contents)
              .find(jscodeshift.TypeAnnotation)
              .remove()
              .toSource();
            contents = jscodeshift(contents)
              .find(jscodeshift.GenericTypeAnnotation)
              .remove()
              .toSource();

            // remove any `type Foo = { .. }` declarations
            contents = jscodeshift(contents)
              .find(jscodeshift.TypeAlias)
              .remove()
              .toSource();

            // remove any flow directive comments
            contents = jscodeshift(contents)
              .find(jscodeshift.Comment, path => path.type === 'CommentLine' && path.value.includes('@flow'))
              .forEach(path => path.prune())
              .toSource();
          }

          file.contents = Buffer.from(contents);
        });

        let clientJsFilter = filter(['client/**/*.js'], {restore: true});
        this.registerTransformStream([
          clientJsFilter,
          codeshiftStream,
          eslint({
            fix: true,
            configFile: path.join(genDir, 'templates/app/client/.eslintrc(babel)')
          }),
          clientJsFilter.restore
        ]);

        // Convert HTML into Pug
        if(this.filters.pug) {
          const pugFilter = filter(['**/*.pug'], {restore: true});

          const pugReplacer = (contents) => {
            return contents
              .replace(/confirmpassword/g, 'confirmPassword')
              .replace(/loginform/g, 'loginForm')
              .replace(/changepasswordform/g, 'changePasswordForm')
              .replace(/newpassword/g, 'newPassword')
              .replace(/ngif/g, 'ngIf')
              .replace(/ngfor/g, 'ngFor')
              .replace(/ngmodel/g, 'ngModel')
              .replace(/ngsubmit/g, 'ngSubmit')
              .replace(/oldpassword/g, 'oldPassword')
              .replace(/routerlinkactive/g, 'routerLinkActive')
              .replace(/routerlink/g, 'routerLink')
              .replace(/signupform/g, 'signupForm');
          };

          this.registerTransformStream([
            pugFilter,
            html2jade({
              nspaces: 2,
              noemptypipe: true,
              bodyless: true,
            }),
            rename(path => {
              path.extname = '.pug';
            }),
            tap(file => {
              const contents = pugReplacer(file.contents.toString());
              file.contents = Buffer.from(contents);
            }),
            pugFilter.restore
          ]);
        }

        // ESLint fix server files
        let serverJsFilter = filter(['server/**/*.js'], {restore: true});
        this.registerTransformStream([
          serverJsFilter,
          eslint({
            fix: true,
            configFile: path.join(genDir, 'templates/app/server/.eslintrc')
          }),
          serverJsFilter.restore
        ]);

        this.sourceRoot(path.join(__dirname, '../../templates/app'));
        this.processDirectory('.', '.');
      },
      generateEndpoint: function() {
        let models;
        if(this.filters.mongooseModels) {
          models = 'mongoose';
        } else if(this.filters.sequelizeModels) {
          models = 'sequelize';
        }
        this.composeWith(require.resolve('../endpoint'), {
          route: '/api/things',
          models: models,
          arguments: ['thing'],
        });
      }
    };
  }

  install() {
    if(!this.options['skip-install']) {
      let yarnCheckCommand;
      if (process.platform === 'win32') {
        yarnCheckCommand = 'yarn --version >nul 2>&1';
      } else {
        yarnCheckCommand = 'type yarn >/dev/null 2>&1';
      }
      exec(yarnCheckCommand, (error) => {
        return this.spawnCommand((!error) ? 'yarn' : 'npm', ['install']);
      });
    }
  }

  get end() {
    return {};
  }
}

module.exports = Generator;

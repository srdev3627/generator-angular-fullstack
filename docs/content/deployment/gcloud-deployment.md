
The following are the instructions to deploy the angular-fullstack app to Google Cloud App Engine Standard Environment

# Prequsites
> ## Google Cloud SDK
>> Download and install [Google Cloud SDK](https://cloud.google.com/sdk/)
> ## Create GCP Project
```
... `gcloud projects create PROJECT_ID`
```
> ## Enable Billing
>>   `gcloud alpha billing projects link my-project \ 
      --billing-account 0X0X0X-0X0X0X-0X0X0X`

> ## Create a MongoDB database
>> Create a MongoDB instance and obtain the uri and credentials

# Deployment Setup
> ## Set Node / NPM versions
>> GCloud App Engine supports only only for the newest version of Node.js 8
>> `"engines": {
    "node": ">=8.0",
    "npm": "^5.1.1"
  },`

> ## Create Application configuration file (app.yaml)
>>A Node.js app in App Engine is configured through a file named app.yaml, that contains runtime, handlers, scaling, and other general settings including environment variables.

>> create a 'app.yaml' file with the following contents

>>> `env: standard`

>>> `runtime: nodejs8`

>>>  ` `

>>> `env_variables:`

>>> `  MONGODB_URI:  "mongodb://<dbuser>:<dbpassword>@<environment_URI/deployment_name"`

>> ## Add app.yaml to .gitignore

# Deployment Steps
> ## Build the app
>> `gulp build`
> ## Copy app.yaml to dist
>> `copy app.yaml dist`
> ## Change to build directory
>> `cd dist`
> ## Deploy
>> `gcloud app deploy`

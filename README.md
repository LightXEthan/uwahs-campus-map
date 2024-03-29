
# UWAHS Campus Map

[![Build Status](https://dev.azure.com/UWA-map-app/UWAHS%20Map%20App/_apis/build/status/LightXEthan.uwahs-campus-map?branchName=master)](https://dev.azure.com/UWA-map-app/UWAHS%20Map%20App/_build/latest?definitionId=1&branchName=master)

A web application for the UWA Historical Society. The app will use a map of the UWA Crawley Campus to orientate new students and utilise excerpts from the [UWAHS Oral Collection](https://www.web.uwa.edu.au/uwahs/oral-histories) in the History Mode.

## Demo
![User Demo](https://github.com/LightXEthan/uwahs-campus-map/blob/docs/demos/demo/mainDemoUser.gif)

The user can look around the map and view points of interest. Points of interest can contain a description, images and oral histories.

![Admin Demo](https://github.com/LightXEthan/uwahs-campus-map/blob/docs/demos/demo/demoMainAdmin.gif)

The admins (UWAHS Volunteers) can add points of interest for the users.

## Meetings
Find the meeting agendas and minutes at the [wiki](https://github.com/LightXEthan/uwahs-campus-map/wiki).

## Scripts
- `npm install` to install dependencies. Required to do before anything else.
- `npm start` to run in development mode. Open [http://localhost:3000](http:localhost:3000) to view it in the browser.
- `npm test` to launch the test runner in interactive watch mode.
- `npm run build` to build the app for production. Find it in the `/build` folder.

## Getting started
1. Install [NodeJS](https://nodejs.org/)
2. `git clone https://github.com/LightXEthan/uwahs-campus-map` to download the files
3. `npm install` to install the dependencies, node_modules file will appear with the dependencies
4. Rename the `.env_template` file to `.env` and add the project configuration keys found in the Firebase project settings. See below for more info.
5. `npm start` to start a local server

## Setup the Firebase back-end API and Google Maps API ##
The `env_template` file is for the api keys, add the api keys and rename the file to `.env`, Getting api keys:

**Firebase API**
1. Go to the console: https://console.firebase.google.com
2. Add a new project
3. Go to the project settings: http://prntscr.com/ox786z.
4. Find the Web API Key, scroll down for the project config
5. Do `firebase login` in console

**Google Maps API**
1. Go to the console: https://console.cloud.google.com
2. Add Google Maps JavaScript API
3. Go to library: http://prntscr.com/p09y44
4. Enable JavaScript Maps API
5. Go to credentials and find the API Key, a verified billing account is needed to increase the number of map loads from one. To verify, a credit card is needed. There is no upfront costs. Otherwise, the map will have a ‘For Development Purposes’ watermark.

## To Host using Firebase

1. Follow the Firebase documentation [Get started with Firebase for web](https://firebase.google.com/docs/web/setup) to create and register a Firebase project.
2. `npm i -g firebase-tools`  to install the Firebase CLI.
3. `firebase login` to connect your machine to Firebase.
4. `firebase init` to initialize your Firebase project in this app. Select `hosting` when prompted.
5. Ensure you have the `.env` file with the project configuration keys found in the Firebase project settings.
6. Add an API key for Google Maps [Google Cloud Platform](https://console.cloud.google.com/google/maps-apis/), more info can be found in the [dev documentation](https://docs.google.com/document/d/1KBm7-WoN9Ej_YCd167hBMFTxSYeOZo-kPdkqS3dOfWc)
7. `npm run build` to build the React app.
8. Modify the `public` key-value pair in `firebase.json` to `"public": "build"`.
9. `firebase deploy` to deploy.

## Tech Stack

- [NodeJS](https://nodejs.org/)
- [React](https://reactjs.org/)
- [React Router](https://reacttraining.com/react-router/web/)
- [Firebase](https://firebase.google.com)
- [Google Maps](https://cloud.google.com/maps-platform/maps/)

## Resources

- [React Documentation](https://reactjs.org/docs/hello-world.html)
- [React Router Documentation](https://reacttraining.com/react-router/web/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Google Maps Documentation](https://developers.google.com/maps/documentation/javascript/tutorial)

## Documentation
- [Campus Map Wikipage](https://github.com/LightXEthan/uwahs-campus-map/wiki)
- [Admin Documentation](https://github.com/LightXEthan/uwahs-campus-map/wiki/Admin-Documentation)
- [Development Documentation](https://github.com/LightXEthan/uwahs-campus-map/wiki/Development-Documentation)

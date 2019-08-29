
# UWAHS Campus Map

A web application for the UWA Historical Society. The app will use a map of the UWA Crawley Campus to orientate new students and utilise excerpts from the [UWAHS Oral Collection](https://www.web.uwa.edu.au/uwahs/oral-histories) in the History Mode.

## Meetings
Find the meeting agendas and minutes at the [wiki](https://github.com/LightXEthan/uwahs-campus-map/wiki).

## Scripts

- `npm install` to install dependencies. Required to do before anything else.
- `npm start` to run in development mode. Open [http://localhost:3000](http:localhost:3000) to view it in the browser.
- `npm test` to launch the test runner in interactive watch mode.
- `npm run build` to build the app for production. Find it in the `/build` folder.

## To Host using Firebase

1. Follow the Firebase documentation [Get started with Firebase for web](https://firebase.google.com/docs/web/setup) to create and register a Firebase project.
2. `npm i -g firebase-tools`  to install the Firebase CLI.
3. `firebase login` to connect your machine to Firebase.
4. `firebase init` to initialize your Firebase project in this app. Select `hosting` when prompted.
5. `npm run build` to build the React app.
6. Modify the `public` key-value pair in `firebase.json` to `"public": "build"`.
7. `firebase deploy` to deploy.

## Tech Stack

- [React](https://reactjs.org/)
- [React Router](https://reacttraining.com/react-router/web/)
- [Firebase](https://firebase.google.com)

## Resources

- [React Documentation](https://reactjs.org/docs/hello-world.html)
- [React Router Documentation](https://reacttraining.com/react-router/web/)
- [Firebase Documentation](https://firebase.google.com/docs)

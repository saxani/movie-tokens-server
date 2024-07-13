# Server for Movie Tokens - React Native mobile app with Node server

A movie showtimes mobile app that allows users to see all films playing in their country, and see show times for (select) films. It turns out movie showtimes APIs are expensive!

## Features

This uses the following:

- [React 18](https://reactjs.org)
- [React Native 0.74.3](https://reactnative.dev/)
- [Expo 51.0.18](https://expo.dev/)
- [Node 20](https://nodejs.org/en/)
- [Express 4](https://expressjs.com/)
- [Nodemon](https://nodemon.io/)
- [The Movie Database API](https://www.themoviedb.org)

## Dev setup

1. Clone this repository.
2. Check you have proper node version (20) using [nvm](https://github.com/nvm-sh/nvm).
3. Ask Shaun for `.env` variables since they're super sneaky
4. Run `npm install` to install the dependencies in the server and client folders.
5. Make sure you have the Expo app installed on your phone for [iPhone](https://apps.apple.com/us/app/expo-go/id982107779) or [Android](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_CA&pli=1)
6. Run `npm start` on both the server and client folders
7. Use the QR code in the terminal to load the app through the Expo app

## Structure

The entry point to the server is at `./index.js`. In the first version of this, films that are now playing are saved to the 'now_playing' folder, rather than reloading constantly. Scraped showtimes for Seattle are in the 'showtimes' folder for 5 of the major films in theatres.

The client side is located in `/client/`. The entry to the mobile app is 'App.js' which then uses a navigator to point to the different screens in the (you guessed it) 'screens' folder.

---

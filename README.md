# Travel Planner App

## Overview
This project is a web app that is built on node js and express server.
The project is designed to help users plan their travel/trips in such a way that the user supplies
the the app with the city they plan to travel to and the date they plan to travel and/or return and the app will automatically provide the user with information of about the weather forcast for that day (ie their travel date) (even if it's in the future) as well as the picture of the city they are traveling to.

## Instructions/Usage
1. clone the project to your local directory eg git clone https://github.com/bright-ic/travel-planner.git
2. cd into the cloned directory eg cd travel-planner
3. Install the project dependencies eg npm install
4. Build the project eg npm run build or start development server eg npm run dev
5. if you used npm run build then Run the app eg npm start
5. Navigate to localhost:3030 on your browser.

## Development Stack
Javascript, Node js, Express, html, css.

## API USED
1. Pixabay (https://pixabay.com/api/docs/) - for getting pictures of the city
2. Weatherbit (https://www.weatherbit.io/account/create) -  for fetching weather forcast
3. Geonames (http://www.geonames.org/export/web-services.html) -  for fetching the country and location of the city (latitude and longitued: used with weatherbit)

## Project Dependencies
Express, cors, flatpickr, webpack, webpack-cli

## Project Dev Dependencies
babel, babel-loader, clean-webpack-plugin, css-loader", file-loader, html-loader,
html-webpack-plugin, jest, mini-css-extract-plugin, node-sass, sass-loader": "^7.1.0",
style-loader, "supertest, webpack-dev-server, workbox-webpack-plugin

## Note
You will need to signup and get your api key from the api's listed above.
You need the api key for the app to work.

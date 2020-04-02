# News Article Evaluation App With Natural Language Processing

## Overview
This project is a web app that uses natural language processing to evaluate news/articles so as to ascertain it's polarity and subjectivity (ie. wether it's opinion or fact based).
It is part of the requirements for completing UDACITY.COM NANODEGREE program for frontend development.

## Instructions/Usage
1. clone the project to your local directory eg git clone https://github.com/bright-ic/news-article-evaluation-with-nlp.git
2. cd into the cloned directory eg cd news-article-evaluation-with-nlp
3. Install the project dependencies eg npm install
4. Build the project eg npm run build-prod or start development server eg npm run build-dev
5. if you sed npm run build-prod then Run the app eg npm start
5. Navigate to localhost:3000 on your browser.

## Development Stack
Javascript, Node js, Express.

## API USED
aylien API - for natural language processing

## Note
The natural language processing is done with https://aylien.com/ provided api
You will need to signup with them to get your own api key and app ID then assign to AYLIEN_API_KEY and AYLIEN_APP_ID varriable in the .env file.
You need the api key for the app to work.

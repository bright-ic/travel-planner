const express = require('express');
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express()

app.use(express.static('dist'));
app.use(cors());


app.get('/', function (req, res) {
     res.sendFile('dist/index.html')
})

// designates what port the app will listen to for incoming requests
app.listen(3030, function () {
    console.log('Example app listening on port 3030 !')
})

// app routes

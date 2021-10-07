const express = require('express')
const mongoose = require('mongoose')
const app = express()

// Parse request body
app.use(express.json());

// Loads .env file contents into process.env
require("dotenv").config()

// Register routes
app.use('/users', require('./routes/users'))

// Open connection to MongoDB
mongoose.connect(process.env.MONGODB_URL, function (err) {
    if (err)
        console.log(err);

    console.log("Connected to Mongo")

})

// Listen for connections
app.listen(process.env.PORT, () => {
    console.log(`App listening at http://localhost:${process.env.PORT}`)
})
const express = require('express')
const mongoose = require('mongoose')
const swaggerUi = require('swagger-ui-express');
const app = express()
const yaml = require('js-yaml');
const fs = require('fs');
const {processTransactions} = require('./middlewares')

// Get document, or throw exception on error
try {
    const swaggerDocument = yaml.load(fs.readFileSync('swagger.yaml', 'utf8'));
    console.log(swaggerDocument);
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (e) {
    console.log(e);
}


// Parse request body
app.use(express.json());

// Loads .env file contents into process.env
require("dotenv").config()

// Register routes
app.use('/users', require('./routes/users'))

// Sessions
app.use('/sessions', require('./routes/sessions'))

// Transactions
app.use('/transactions', require('./routes/transactions'))


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
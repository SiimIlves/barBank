const mongoose = require('mongoose')

// Describe bank collection
module.exports = mongoose.model('bank', new mongoose.Schema({
    name: {type: String, required: true},
    transactionUrl: {type: String, required: true},
    bankPrefix: {type: String, required: true},
    owners: {type: String, required: true},
    jwksUrl: {type: String, required: true}
}));
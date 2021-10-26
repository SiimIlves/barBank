const mongoose = require('mongoose')

// Describe transaction collection
module.exports = mongoose.model('transaction', new mongoose.Schema({
        accountFrom: {type: String, required: true},
        accountTo: {type: String, required: true},
        amount: {type: Number, unique: false, required: true},
        currency: {type: String, required: true},
        explanation: {type: String, required: true, maxlength: 200},
        status: {type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending'},
        statusDetails: {type: String, default: ''}
    }, {
        toJSON: {
            transform: function (doc, ret) {
                delete ret._id
                delete ret.__v
            }
        }
    }
));
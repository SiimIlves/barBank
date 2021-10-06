const mongoose = require('mongoose')
module.exports = mongoose.model('User', new mongoose.Schema({
    name: {type:String,required:true,minlength:2,maxlength:50},
    username: {type:String,unique:true,dropdups:true,required:true,minlength:2,maxlength:50},
    password: {type:String,required:true,minlength:2,maxlength:100}
}));

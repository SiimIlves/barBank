const express = require('express')
const mongoose = require('mongoose')
const User = require('./models/User')
const app = express()
app.use(express.json());

require("dotenv").config()

app.post('/users', async (req, res) => {
    try {
        await new User({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password
        }).save()
        res.status(201).end()
    } catch (e) {
        if (/User validation failed:/.test(e.message)) {
            return res.status(400).send({error: e.message})
        }
        if (/E11000 duplicate key error collection: .*username/.test(e.message)) {
            return res.status(409).send({error: "Username already exists"})
        }
        return res.status(500).send({error: e.message})
    }
})
mongoose.connect(process.env.MONGODB_URL, function (err) {
    if (err) throw Error
    console.log("Connected to Mongo")
})

app.listen(process.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})
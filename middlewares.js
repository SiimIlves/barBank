const Session = require('./models/Session');
const Bank = require('./models/Bank');
const axios = require('axios');
const Transaction = require('./models/Transaction');

exports.verifyToken = async function (req, res, next) {

    // Check Authorization header existence
    if (!req.header('authorization')) {
        return res.status(401).send({error: "Missing authorization"})
    }

    // Split Authorization header by space
    const auth_head = req.headers.authorization.split(" ");

    // Check that Authorization header includes a space
    if (!auth_head[1]) {
        return res.status(400).send({error: "Invalid authorization format"})
    }

    // Validate that the provided token conforms to MongoDB id format
    const token = auth_head[1]
    if (!require('mongoose').Types.ObjectId.isValid(token)) {
        return res.status(400).send({error: "Invalid authorization format"})
    }

    // Find a session with given token
    const session = await Session.findOne({_id: token});

    // Check that the session existed
    if (!session) {
        return res.status(401).send({error: "Invalid token"})
    }

    // Store that users id in the req objects
    req.userId = session.userId
    req.sessionId = session.id

    // Pass the execution to the next middleware function
    return next();
}

exports.refreshBanksFromCentralBank = async () => {

    // GET list of banks from central bank
    try {
        let bankList = await axios.get('https://keskpank.diarainfra.com/banks', {
            headers:{
                'Api-Key':process.env.API_KEY
            }
        })

        // Delete current banks list
        await Bank.deleteMany()

        // Insert new data into banks
        for (let bank of bankList.data) {
            await new Bank({
                name: bank.name,
                transactionUrl: bank.transactionUrl,
                bankPrefix: bank.bankPrefix,
                owners: bank.owners,
                jwksUrl: bank.jwksUrl
            }).save();
        }

        // Return true
        return true

    } catch (e) {
         // Return exception message when encounter error
        return {error: e.message}
    }


}



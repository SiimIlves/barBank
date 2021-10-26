const router = require('express').Router();
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const Bank = require('../models/Bank');
const {verifyToken, refreshBanksFromCentralBank} = require('../middlewares');

module.exports = router.post('/', verifyToken, async (req, res) => {

    // Get account data from db
    const accountFrom = await Account.findOne({account_number: req.body.accountFrom});

    // Check that account exists
    if (!accountFrom) {
        return res.status(404).send({error: 'account not found'});
    }

    // Check that accountFrom belongs to the user
    if (JSON.stringify(accountFrom.userId) !== JSON.stringify(req.userId)) {

        return res.status(403).send({error: 'Account does not belong to a user'})
    }

    // Check for sufficient funds
    if (accountFrom.balance <= req.body.amount) {
        return res.status(422).send({error: 'Not enough money on account'})
    }

    // Check for invalid amounts
    if (req.body.amount < 0) {
        return res.status(400).send({error: 'Invalid amount'})
    }

    // Get destination bank prefix
    //EEE1231023u123
    let destinationBankPrefix = req.body.accountTo.substring(0, 3);

    //ALL OF ACCOUNT DATA
    let destinationBank = await Bank.findOne({bankPrefix: destinationBankPrefix});
    let statusDetails = undefined;

    // Check if destination bank existed locally
    if (!destinationBank) {

        // Refresh banks from central bank if not
        const result = refreshBanksFromCentralBank();

        // Store the error message to statusDetails variable if request to central bank was unsuccessful
        statusDetails = result.error;

        // Check if there was an error refreshing the banks collection from central bank
        if (!result || typeof result.error !== 'undefined') {
            statusDetails = result.error;

        } else {
            // Try getting the details of the destination bank again
            destinationBank = await  Bank.findOne({destinationBankPrefix});
            // Check for destination bank once more and return 404 if it's still missing from banks collection
            if (!destinationBank) {
                return res.status(404).send({error: 'Destination bank not found'})
            }

        }}

        // Add new document to transactions collection

        await new Transaction({
            accountFrom: req.body.accountFrom,
            accountTo: req.body.accountTo,
            amount: req.body.amount,
            currency: req.body.currency,
            explanation: req.body.explanation,
            statusDetails: statusDetails

        }).save();

        // 201 Created
        return res.status(200).end()


   // return res.status(502).send({error: 'Bad gateway'});

})

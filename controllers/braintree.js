const User = require('../models/user');
const braintree = require('braintree');
require('dotenv').config();


// connecting to braintree via gateway first before generating the token
const gateway = braintree.connect({
    environment:  braintree.Environment.Sandbox,
    merchantId:   's5894y5d257rbm7c',
    publicKey:    '9979hjxy78nfybzb',
    privateKey:   '92e2609358ee627779ce4cb42b691114'
});

// use gateway to generate the token
exports.generateToken = (req, res) => {
    gateway.clientToken.generate({}, function(err, response) {
        if(err){
            res.status(500).send(err);
        } else {
            res.send(response);
        }
    })
}

exports.processPayment = (req, res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce;
    let amountFromTheClient = req.body.amount;
    // charge 
    let newTransaction = gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        options: {
            submitForSettlement: true,
        },
    }, (error, result) => {
        if (error) {
            res.status(500).json(error);
        } else {
            res.json(result);
        }
    });
}
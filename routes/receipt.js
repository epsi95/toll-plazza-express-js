const express = require('express');
const tollPlazza = require('../models/tollPlazza');
const db = require('../models/db');

const router = express.Router();

router.get('/:receiptID', (req, res)=>{
    const receiptId = req.params.receiptID;
    const receiptObject = db.getReceiptFromDatabase(receiptId);
    if(!!receiptObject){
        try{
            return res.send(receiptObject);
        }catch(error){
            console.log(error);
            return res.status(400).send(error.toString());
        }
    }else{
        return res.status(400).send('invalid receipt ID');
    }
});

router.post('/', (req, res)=>{
    const VIN = req.body.VIN;
    const fromAddress = req.body.fromAddress;
    const toAddress = req.body.toAddress;
    const isBothWay = req.body.isBothWay;
    const newGeneratedreceipt = tollPlazza.generateReceipt(VIN, fromAddress, toAddress, isBothWay);
    try{
        tollPlazza.validateReceiptObject(newGeneratedreceipt);
        db.insertReceiptIntoDatabase(newGeneratedreceipt);
        return res.send(newGeneratedreceipt);
    }catch(error){
        console.log(error);
        return res.status(400).send(error.toString());
    }
});

router.put('/', (req, res)=>{
    const receiptId = req.body.receiptId;
    const routeNumber = req.body.routeNumber;

    const receiptObject = db.getReceiptFromDatabase(receiptId);
    if(!!receiptObject){
        try{
            const modifiedReceiptObject = tollPlazza.checkRoute(routeNumber, receiptObject);
            return res.send(modifiedReceiptObject);
        }catch(error){
            console.log(error);
            return res.status(400).send(error.toString());
        }
    }else{
        return res.status(400).send('invalid receipt ID');
    }
});

module.exports = router;

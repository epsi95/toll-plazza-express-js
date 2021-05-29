const dbArray = [];

const insertReceiptIntoDatabase = (receiptObject)=>{
    dbArray.push(receiptObject);
}

const getReceiptFromDatabase = (receiptId)=>{
    return dbArray.find((receiptObject)=>receiptObject.receiptId === receiptId);
}

module.exports.insertReceiptIntoDatabase = insertReceiptIntoDatabase;
module.exports.getReceiptFromDatabase = getReceiptFromDatabase;
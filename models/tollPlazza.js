const Joi = require('joi');

const receiptObjectSchema = Joi.object({
    receiptId: Joi.string().required(),
    generationTimeStamp: Joi.date().timestamp('javascript').required(),
    VIN: Joi.string().min(15).required(),
    price: Joi.number().integer().required(),
    fromAddress: Joi.string().required(),
    toAddress: Joi.string().required(),
    isBothWay: Joi.boolean().required(),
    isRouteOneTaken: Joi.boolean().required(),
    isRouteTwoTaken: Joi.boolean().required()
});

// this function will generate receipt object
const generateReceipt = (VIN, fromAddress, toAddress, isBothWay)=>{
    const generationTimeStamp = new Date().getTime();
    const price = 100.0;
    return {
        receiptId : `TollID-111-${VIN}-${generationTimeStamp}`,
        generationTimeStamp : generationTimeStamp,
        VIN: VIN,
        price: isBothWay? price*2: price,
        fromAddress: fromAddress,
        toAddress: toAddress,
        isBothWay: isBothWay,
        isRouteOneTaken: false,
        isRouteTwoTaken: false
    }
};


// this function will check a particuler way
const checkRoute = (routeNumber, receiptObject)=>{
    // routeNumber 1 is way 1
    // routeNumber 2 means way 2 i.e. returning
    if(!(routeNumber === 1 || routeNumber === 2)) throw new Error('invalid route');
    if(routeNumber === 1){
        receiptObject.isRouteOneTaken = true;
        return receiptObject;
    }else{
        if(receiptObject.isBothWay){
            receiptObject.isRouteOneTaken = true; // assuming that if returning the first trip should be true
            receiptObject.isRouteTwoTaken = true;
            return receiptObject;
        }else{
            throw new Error('returning route not acceptable');
        }
    }
};

// validate receiptObject
const validateReceiptObject = (receiptObject)=>{
    const { error, value } =  receiptObjectSchema.validate(receiptObject);
    if(!!error) {
        let errorMessage = '';
        error.details.forEach((e)=> errorMessage += e.message + '\n');
        throw new Error(errorMessage);
    }
}

module.exports.generateReceipt = generateReceipt;
module.exports.checkRoute = checkRoute;
module.exports.validateReceiptObject = validateReceiptObject;
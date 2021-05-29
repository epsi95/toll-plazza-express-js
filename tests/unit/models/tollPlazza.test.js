// just writing test on model as an example
// similar way integration test can be written

const tollPlazza = require('../../../models/tollPlazza');

describe('Suite: tollPlazza', ()=>{
    it('should throw error if I pass invalid vin', ()=>{
        expect(()=>tollPlazza.validateReceiptObject({})).toThrow();
    });

    it('should return a valid receipt object', ()=>{
        const receiptObject = tollPlazza.generateReceipt('ABCDEF123456789', 'address1', 'address2', true);
        expect(receiptObject.receiptId).toBeDefined();
        expect(receiptObject.generationTimeStamp).toBeGreaterThan(new Date(1970, 1, 1).getTime());
        expect(receiptObject.VIN).toBe('ABCDEF123456789');
        expect(receiptObject.price).toBeCloseTo(200.0);
        expect(receiptObject.fromAddress).toBe('address1');
        expect(receiptObject.toAddress).toBe('address2');
        expect(receiptObject.isBothWay).toBeTruthy();
        expect(receiptObject.isRouteOneTaken).toBeFalsy();
        expect(receiptObject.isRouteTwoTaken).toBeFalsy();
    });
});
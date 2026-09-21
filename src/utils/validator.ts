export interface validationError{
    path: string,
    message: string
}

export function validateAndFix(rawJson: any){
    const errors: validationError[]=[];
    const fixedJson:Record<string, unknown>={...rawJson};

    if (!rawJson.invoiceNumber){
        errors.push({path:"invoiceNumber", message:"Missing invoiceNumber"});
        fixedJson.invoiceNumber="INV-000";
    }

    if (!rawJson.buyerTin){
        errors.push({path:"buyerTin", message:"Missing buyerTin"});
        fixedJson.buyerTin="C500000000";
    }

    const quantity=parseFloat(rawJson.quantity)|| 0;
    const unitPrice=parseFloat(rawJson.unitPrice)|| 0;
    const lineTotal=parseFloat(rawJson.lineAmount)|| 0;

    const expectedTotal=quantity*unitPrice;

    if (lineTotal!==expectedTotal){
        errors.push({path:"total", message:`Total should be ${expectedTotal} but got ${lineTotal}`});
        fixedJson.lineAmount=expectedTotal;
    }

    return{
        isValid: errors.length===0,
        errors:errors,
        originalJson: rawJson,
        fixedJson: fixedJson
    }
}
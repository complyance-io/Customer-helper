import {z} from 'zod';

export const invoiceSchema = z.object({
    invoiceNumber: z.string().min(1,"invoice number is required"),
    buyerTin: z.string().min(1,"buyer tin cant be empty"),
    quantity: z.refine((val)=> !isNaN(Number(val)) && Number(val)>0,{
        message : "quantity must be a valid number string",
    }),
    unitPrice: z.refine((val)=> !isNaN(Number(val)) && Number(val)>0,{
        message : "unitprice must be a valid number string"
    }),
    lineAmount: z.refine((val)=> !isNaN(Number(val)) && Number(val)>0,{
        message : "lineamount must be a valid number string"
    })
}).refine((data)=>)
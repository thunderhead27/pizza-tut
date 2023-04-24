import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return;
    }

    await dbConnect();
    //@ts-ignore
    const updatedProduct = await Product.findByIdAndUpdate(req.query.id, req.body)

    res.send({
        message: 'Product updated successfully',
        updatedProduct
    })

    console.log(req.body);
    console.log(req.query);
}
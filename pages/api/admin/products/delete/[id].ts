import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'DELETE') {
        return;
    }

    await dbConnect();
    const deletedProduct = await Product.findByIdAndDelete(req.query.id)

    res.send({
        message: 'Product deleted successfully',
        deletedProduct
    })

    console.log(req.body);
    console.log(req.query);
}
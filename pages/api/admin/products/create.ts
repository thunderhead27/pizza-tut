import bcryptjs from 'bcryptjs';
import dbConnect from "@/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import Product from "@/models/Product";
import { v4 as uuidv4 } from 'uuid';



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return;
    }

    console.log(req.body);

    const { name, image, description, category, price, points, flavor, dressing } = req.body;

    await dbConnect();

    const newProduct = new Product({
        cartId: uuidv4(),
        name: name,
        image: image,
        description: description,
        category: category,
        price: price,
        points: points,
        flavor: flavor,
        dressing: dressing
    })

    const product = await newProduct.save();

    res.status(201).send({
        message: 'Created product!',
        product
    })
}

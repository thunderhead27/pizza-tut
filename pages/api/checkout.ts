import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import User from "@/models/User";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return;
    }
    const { order } = req.body;
    const { points } = req.body;

    console.log(order);
    console.log(points);

    await dbConnect();

    //@ts-ignore
    const user = await User.findById(order.userId);
    const newOrder = new Order(order);
    const savedOrder = await newOrder.save();

    //@ts-ignore
    const updatedUser = await User.findByIdAndUpdate(points.user, { points: points.points });
    user.orders = user.orders.concat(savedOrder._id)
    await user.save()

    res.send({
        message: 'Created order',
        updatedUser,
        savedOrder
    });
};
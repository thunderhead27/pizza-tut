import { getServerSession } from 'next-auth/next';
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return;
    }

    const { myStore } = req.body

    const session = await getServerSession(req, res, authOptions);

    console.log(session)
    if (!session) {
        return res.status(401).send({ message: 'You must be logged in.' });
    }
    const { user } = session;

    await dbConnect();

    //@ts-ignore
    const updatedUser = await User.findByIdAndUpdate({ _id: user._id }, { $set: { myStore: myStore } })

    res.status(201).send({
        message: 'Updated user!',
        updatedUser
    })
}
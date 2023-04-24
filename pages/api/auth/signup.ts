import bcryptjs from 'bcryptjs';
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return;
    }

    console.log(req.body);

    const { firstName, lastName, email, password } = req.body;

    if (!firstName ||
        !lastName ||
        !email ||
        !email.includes('@') ||
        !password ||
        password.trim().length < 5
    ) {
        res.status(422).json({
            message: 'Validation error',
        });
        return;
    }
    await dbConnect();

    //@ts-ignore
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
        res.status(422).json({ message: 'User exists already!' });
        return;
    }

    const newUser = new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: bcryptjs.hashSync(password),
        isAdmin: false,
        points: 0
    })

    const user = await newUser.save();

    res.status(201).send({
        message: 'Created user!',
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
        myStore: user.myStore,
        points: user.points
    })
}

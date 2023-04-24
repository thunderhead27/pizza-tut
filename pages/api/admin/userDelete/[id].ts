import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'DELETE') {
        return;
    }

    await dbConnect();
    const deletedUser = await User.findByIdAndDelete(req.query.id)

    res.send({
        message: 'Product deleted successfully',
        deletedUser
    })

}
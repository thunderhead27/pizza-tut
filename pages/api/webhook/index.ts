import Stripe from 'stripe';
import { buffer } from 'micro';
import { NextApiRequest, NextApiResponse } from "next";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2022-11-15",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {

        let event;

        try {
            const rawBody = await buffer(req);
            const signature = req.headers['stripe-signature'];

            event = stripe.webhooks.constructEvent(
                rawBody.toString(),
                signature,
                process.env.STRIPE_WEBHOOK_SECRET
            );

        } catch (err) {
            console.log(`❌ Error message: ${err.message}`);
            res.status(400).json({ message: `Webhook Error: ${err.message}` });
            return;
        }

        if (event.type === 'payment_intent.succeeded') {
            console.log(`💰  Payment received!`);
            console.log(event.data.object)
        } else {
            console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
        }

        // Return a response to acknowledge receipt of the event.
        res.json({ received: true });

    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).json({ message: 'Method not allowed' });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};

import React, { useContext } from "react";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "@/components/checkoutForm";
import { CartContext } from "@/context/CartContext";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Payment() {
    const [clientSecret, setClientSecret] = React.useState("");
    const { state, dispatch } = useContext(CartContext)

    React.useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        fetch("/api/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: state.cart.totalPrice }),
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret));
    }, []);

    const appearance = {
        theme: 'stripe',
    };

    const options: StripeElementsOptions = {
        clientSecret,
        // @ts-ignore
        appearance,
    };

    return (
        <div className="App">
            {clientSecret && (
                <div className="flex flex-row h-screen items-center place-content-center xl:px-[165px]">
                    <Elements options={options} stripe={stripePromise}>
                        <CheckoutForm />
                    </Elements>
                </div>
            )}
        </div>
    );
}
import Layout from "@/components/layout";
import { CartContext } from "@/context/CartContext";
import axios from 'axios';
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]";
import { useContext, useEffect, useState } from "react";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { v4 as uuidv4 } from 'uuid';


export default function ThankYou({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { state, dispatch } = useContext(CartContext)
    const [newPoints, setNewPoints] = useState(0);

    useEffect(() => {
        setNewPoints(state.cart.cartItems.reduce((acc, cur) => acc + cur.points * cur.totalQuantity, 0))

        const order = {
            orderId: uuidv4(),
            userId: user._id,
            cartItems: state.cart.cartItems,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            myStore: user.myStore,
            method: state.cart.method,
            paymentMethod: state.cart.paymentMethod,
            itemsPrice: state.cart.itemsPrice,
            taxPrice: state.cart.taxPrice,
            totalPrice: state.cart.totalPrice,
            deliveryAddress: state.cart.deliveryAddress,
            paidAt: Date.now()
        }

        const points = {
            user: user._id,
            points: user.points + state.cart.cartItems.reduce((acc, cur) => acc + cur.points * cur.totalQuantity, 0)
        }

        if (state.cart.cartItems.length !== 0) {
            axios.post('/api/checkout', {
                order,
                points
            })

            dispatch({ type: 'CART_RESET', payload: {} })
        }
    }, [])

    return (
        <Layout>
            <div className="flex flex-col items-center">
                <h1 className="font-bold text-4xl font-thunder mt-6 lg:mt-12">CONFIRMATION</h1>
                <div className="text-center mt-12 font-bold">
                    <p className="text-2xl">THANK YOU FOR YOUR ORDER!</p>
                    <p className="text-xl">YOU WILL RECEIVE A CONFIRMATION EMAIL SOON!</p>
                    <p className="text-xl mt-48">YOU RECEIVED <span className="font-black">{newPoints}</span> POINTS FROM THIS ORDER</p>
                </div>
            </div>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions)

    await dbConnect()

    //@ts-ignore
    const result = await User.findOne({ _id: session.user._id })

    return { props: { user: JSON.parse(JSON.stringify(result)) } }
}

ThankYou.auth = true;
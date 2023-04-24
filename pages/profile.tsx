import Layout from "@/components/layout";
import dbConnect from "@/lib/dbConnect";
import { useEffect, useState } from "react";
import axios from 'axios';
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { signOut, useSession } from "next-auth/react";
import { getServerSession } from "next-auth/next"
import User from "@/models/User";
import { authOptions } from "./api/auth/[...nextauth]";
import { useRouter } from "next/router";
import Order from "@/models/Order";
import styled from "styled-components";

interface PaginationProps {
    readonly disabled: boolean;
}

const Pagination = styled.button<PaginationProps>`
    color: black;
    ${({ disabled }) => (disabled ? `color: gray;
` : ``)};
`

export default function Profile({ user, orders, pages }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { data: session } = useSession();
    const router = useRouter();
    const { query } = router;

    const page = Object.keys(query).length === 0 ? 1 : Number(query.page);

    console.log(Object.keys(query).length === 0);
    console.log(query);

    const logoutHandler = () => {
        signOut({ callbackUrl: '/' })
    }

    const paginationHandler = (page: number) => {
        router.push(`/profile?page=${page}`)
    }


    return (
        <Layout>
            <div className="flex flex-col items-center gap-y-4 xl:w-[1200px]">
                <h1 className="font-bold text-4xl font-thunder py-6 lg:py-12">PROFILE</h1>
                <div className="flex flex-row justify-between w-full mb-8">
                    {session.user.isAdmin && (
                        <button className="bg-dOrange text-white font-bold py-2 px-4 rounded-md shadow-xl" onClick={() => router.push('/admin/dashboard')}>ADMIN DASHBOARD</button>
                    )}
                    <button className="bg-cBrown text-white font-bold py-2 px-4 rounded-md shadow-xl" onClick={() => logoutHandler()}>LOGOUT</button>
                </div>
                <div className="flex flex-col xl:flex-row w-full justify-between gap-y-8">
                    <div className="">
                        <h2 className="text-xl font-bold">HELLO <span className="uppercase font-black">{user.firstName}</span></h2>
                        <p className="uppercase text-lg font-bold">You have <span className="font-black">{user.points ? user.points : 0}</span> points</p>
                    </div>
                    {user.myStore ?
                        <div className="font-bold uppercase">
                            <h1 className="text-lg border-b-2">MY STORE</h1>
                            <h2 className="font-black">{user.myStore.name}</h2>
                            <p>{user.myStore.streetAddress}</p>
                            <p>{user.myStore.city}, {user.myStore.state} {user.myStore.zipCode}</p>
                        </div> : null}
                </div>
                <div className="flex flex-col items-center w-[300px] xl:w-full">
                    <h1 className="font-bold text-2xl mb-8">ORDER HISTORY</h1>
                    <table className="border border-cBrown text-xs xl:text-lg uppercase table-fixed">
                        <thead>
                            <tr>
                                <th className="border border-cBrown">ORDER ID</th>
                                <th className="border border-cBrown">DATE</th>
                                <th className="border border-cBrown">ITEMS</th>
                                <th className="border border-cBrown">TOTAL PAID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td className="border border-cBrown xl:px-4 xl:w-[130px]">{order.orderId.substring(0, 8)}</td>
                                    <td className="border border-cBrown xl:px-4 xl:w-[125px]">{order.paidAt.substring(0, 10)}</td>
                                    <td className="border border-cBrown xl:px-4 w-[150px] xl:w-[640px]">
                                        {order.cartItems.map((item, i) => (
                                            <div key={i}>{item.totalQuantity}<span className="lowercase">x</span> {item.toppings.length > 0 ? item.name + ' with ' + item.toppings.map(topping => (topping)) : item.name}</div>
                                        ))}
                                    </td>
                                    <td className="border border-cBrown xl:px-4 xl:w-[140px]">${order.totalPrice}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-4 flex flex-row font-bold gap-x-4">
                        <Pagination disabled={page === 1} onClick={() => paginationHandler(Number(query.page) - 1)}>&lt;&lt;</Pagination>
                        {[...Array(pages).keys()].map((pageNumber, i) => (
                            <button key={i} onClick={() => paginationHandler(pageNumber + 1)}>{pageNumber + 1}</button>
                        ))}
                        <Pagination disabled={Number(query.page) === pages} onClick={() => paginationHandler(page + 1)}>&gt;&gt;</Pagination>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions)
    console.log(context.query.page)

    const page = context.query.page === '1' ? 0 : context.query.page ? Number(context.query.page) - 1 : 0;
    const ordersPerPage = 5;

    await dbConnect()

    //@ts-ignore
    const fetchedUser = await User.findOne({ _id: session.user._id })

    const fetchedOrders = await Order
        //@ts-ignore
        .find({ userId: session.user._id })
        .sort({ paidAt: -1 })
        .skip(page * ordersPerPage)
        .limit(ordersPerPage);

    //@ts-ignore
    const ordersCount = await Order.find({ userId: session.user._id }).countDocuments();

    const orders = fetchedOrders.map((doc) => {
        const order = doc.toObject()
        order._id = order._id.toString()
        return order
    })

    return {
        props: {
            user: JSON.parse(JSON.stringify(fetchedUser)),
            orders: JSON.parse(JSON.stringify(orders)),
            pages: Math.ceil(ordersCount / ordersPerPage)
        }
    }
}

Profile.auth = true;

import Layout from "@/components/layout";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import styled from "styled-components";

interface PaginationProps {
    readonly disabled: boolean;
}

const Pagination = styled.button<PaginationProps>`
    color: black;
    ${({ disabled }) => (disabled ? `color: gray;
` : ``)};
`

export default function AdminOrders({ orders, pages }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter();
    const { query } = router;

    const page = Object.keys(query).length === 0 ? 1 : Number(query.page);

    const paginationHandler = (page: number) => {
        router.push(`/admin/orders?page=${page}`)
    }

    return (
        <Layout>
            <div className="flex flex-col items-center">
                <div className="absolute flex flex-col gap-y-4 top-[200px] left-8 xl:text-2xl uppercase">
                    <button onClick={() => router.back()}>GO BACK</button>
                </div>
                <h1 className="font-bold text-4xl font-thunder mt-6 lg:mt-12">ORDER HISTORY</h1>
                <table className="border border-cBrown text-xs xl:text-lg uppercase table-fixed">
                    <thead>
                        <tr>
                            <th className="border border-cBrown">ORDER ID</th>
                            <th className="border border-cBrown">DATE</th>
                            <th className="border border-cBrown">NAME</th>
                            <th className="border border-cBrown">METHOD</th>
                            <th className="border border-cBrown">ADDRESS</th>
                            <th className="border border-cBrown">ITEMS</th>
                            <th className="border border-cBrown">TOTAL PAID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td className="border border-cBrown xl:px-4 xl:w-[130px]">{order.orderId.substring(0, 8)}</td>
                                <td className="border border-cBrown xl:px-4 xl:w-[125px]">{order.paidAt.substring(0, 10)}</td>
                                <td className="border border-cBrown xl:px-4 xl:w-[125px]">{order.firstName} {order.lastName}</td>
                                <td className="border border-cBrown xl:px-4 xl:w-[125px]">{order.method}</td>
                                <td className="border border-cBrown xl:px-4 xl:w-[125px]">
                                    {order.method === 'delivery' ? <div>
                                        <div>{order.deliveryAddress.streetAddress}</div>
                                        <div>{order.deliveryAddress.city + ", " + order.deliveryAddress.state + " " + order.deliveryAddress.zipCode}</div>
                                    </div> : <div>N/A</div>}
                                </td>
                                <td className="border border-cBrown xl:px-4 w-[150px] xl:w-[640px]">
                                    {order.cartItems.map((item, i) => (
                                        <div key={i}>{item.totalQuantity}<span className="lowercase">x</span> {item.toppings.length > 0 ? item.name + ' with ' + item.toppings.map(topping => (topping)) : item.name}</div>
                                    ))}
                                </td>
                                <td className="border border-cBrown xl:px-4 xl:w-[140px]">${order.totalPrice.toFixed(2)}</td>
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
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {

    const page = context.query.page === '1' ? 0 : context.query.page ? Number(context.query.page) - 1 : 0;
    const ordersPerPage = 10;

    await dbConnect()



    const fetchedOrders = await Order
        //@ts-ignore
        .find({})
        .sort({ paidAt: -1 })
        .skip(page * ordersPerPage)
        .limit(ordersPerPage);

    //@ts-ignore
    const ordersCount = await Order.find({}).countDocuments();

    const orders = fetchedOrders.map((doc) => {
        const order = doc.toObject()
        order._id = order._id.toString()
        return order
    })

    return {
        props: {
            orders: JSON.parse(JSON.stringify(orders)),
            pages: Math.ceil(ordersCount / ordersPerPage)
        }
    }
}

AdminOrders.auth = true;

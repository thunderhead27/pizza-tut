import Layout from "@/components/layout";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import moment from "moment";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Link from "next/link";
import { useRouter } from "next/router";
import Calendar from 'react-calendar';
import { useState } from "react";
import Head from "next/head";


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: false,
            text: 'Sales',
        },
    },
};

const currentWeek = moment().week();
const currentYear = moment().year();

export default function AdminDashboard({ orders }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const arrOfData = new Array(7).fill(0);
    const arrOfOrderCounts = new Array(7).fill(0);
    const labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const [value, setValue] = useState(new Date());

    const router = useRouter();
    const { query } = router;

    const page = Object.keys(query).length === 0 ? 1 : Number(query.page);

    function onChange(nextValue) {
        setValue(nextValue);
        const week = moment(nextValue, "MMDDYYYY").isoWeek();
        const year = moment(nextValue, "MMDDYYYY").year();
        router.push(`/admin/dashboard?week=${week}&year=${year}`)
    }


    for (let i = 0; i < orders.length; i++) {
        arrOfData[orders[i]._id.dayOfWeek - 1] = orders[i].totalAmount;
    }

    for (let i = 0; i < orders.length; i++) {
        arrOfOrderCounts[orders[i]._id.dayOfWeek - 1] = orders[i].count;
    }

    for (let i = 0; i < orders.length; i++) {
        labels[orders[i]._id.dayOfWeek - 1] = labels[orders[i]._id.dayOfWeek - 1].concat(" ", orders[i]._id.date);
    }

    const data = {
        labels,
        datasets: [
            {
                label: 'Sales',
                data: arrOfData,
                backgroundColor: 'rgba(242, 124, 56, 0.5)',
            },
        ],
    };

    return (
        <Layout>
            <div>
                <Head>
                    <title>Admin Dashboard</title>
                </Head>
                <div className="absolute flex flex-col gap-y-4 top-[200px] left-8 xl:text-2xl uppercase">
                    <Link href="/admin/orders">Orders</Link>
                    <Link href="/admin/products">Products</Link>
                    <Link href="/admin/users">Users</Link>
                </div>
                <div>
                    <div className="flex flex-col items-center gap-y-4">
                        <h1 className="font-bold text-4xl font-thunder py-6 lg:py-12">SALES</h1>
                    </div>
                    <div className="xl:w-[1000px] mb-12">
                        <Bar options={options} data={data} />
                    </div>
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col">
                            <h2 className="font-bold text-2xl mb-8">SALES COUNT</h2>
                            {labels.map((date, i) => (
                                <div key={i}>{date}: <span className="font-bold">{arrOfOrderCounts[i]}</span></div>
                            ))}
                        </div>
                        <div>
                            <Calendar
                                onChange={onChange}
                                value={value}
                                calendarType="US"
                                defaultActiveStartDate={new Date()}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    await dbConnect()

    let week;
    let year;

    if (context.query.week === undefined) {
        week = currentWeek;
    } else {
        week = Number(context.query.week);
    }

    console.log(week);

    if (context.query.year === undefined) {
        year = currentYear;
    } else {
        year = Number(context.query.year);
    }



    const orders = await Order
        .aggregate(
            [
                {
                    $match: {
                        $and: [
                            { $expr: { $eq: [week, { $week: "$paidAt" }] }, },
                            { $expr: { $eq: [year, { $year: "$paidAt" }] }, },
                        ]
                    }
                },
                {
                    $group:
                    {
                        _id: { date: { $dateToString: { format: "%m/%d/%Y", date: "$paidAt" } }, day: { $dayOfYear: "$paidAt" }, week: { $week: "$paidAt" }, month: { $month: "$paidAt" }, year: { $year: "$paidAt" }, dayOfWeek: { $dayOfWeek: "$paidAt" } },
                        totalAmount: { $sum: "$totalPrice" },
                        count: { $sum: 1 },
                    }
                },
                { $sort: { week: 1 } }
            ]
        )



    return {
        props: {
            orders: orders,
        }
    }
}

AdminDashboard.auth = { adminOnly: true };
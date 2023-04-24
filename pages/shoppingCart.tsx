import Layout from "@/components/layout";
import { CartContext } from "@/context/CartContext";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next"
import { useSession } from 'next-auth/react';
import Link from "next/link";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';


const RadioButton = ({ label, value, onChange }) => {
    return (
        <label className="uppercase font-bold">
            <input type="radio" className="accent-cBrown" checked={value} onChange={onChange} />
            {label}
        </label>
    );
};

interface FormValues {
    streetAddress: string
    city: string
    state: string
    zipCode: number
}


export default function ShoppingCart({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { state, dispatch } = useContext(CartContext)
    const [cartItems, setCartItems] = useState([]);
    const [quantity, setQuantity] = useState([]);
    const [method, setMethod] = useState('delivery');
    const [paymentMethod, setPaymentMethod] = useState(state.cart.paymentMethod || '');


    const router = useRouter();
    const { data: session } = useSession();

    let myStore;

    if (user) {
        myStore = user.myStore;
    }

    useEffect(() => {
        dispatch({ type: 'SET_MY_STORE', payload: myStore });
    }, [myStore, dispatch])

    useEffect(() => {
        const fetchData = async () => {
            const data = JSON.parse(localStorage.getItem('cartItems'))
            setCartItems(data);
            const initialQuantity = data?.map(item => item.totalQuantity)
            setQuantity(initialQuantity);
        }
        fetchData();
    }, [state.cart.cartItems])



    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            streetAddress: state?.cart?.deliveryAddress?.streetAddress,
            city: state?.cart?.deliveryAddress?.city,
            state: state?.cart?.deliveryAddress?.state,
            zipCode: Number(state?.cart?.deliveryAddress?.zipCode)
        }
    });


    const handleDeliveryChange = () => {
        setMethod('delivery');
        const methodObj = {
            method: 'delivery',
            deliveryPrice: 4.50
        }
        dispatch({ type: 'SET_METHOD', payload: methodObj });
    };

    const handleCarryoutChange = () => {
        setMethod('carryout');
        const methodObj = {
            method: 'carryout',
            deliveryPrice: 0
        }
        dispatch({ type: 'SET_METHOD', payload: methodObj });
    };

    const handleCashPaymentChange = () => {
        setPaymentMethod('cash');
        dispatch({ type: 'SET_PAYMENT_METHOD', payload: 'cash' });
    };

    const handleCreditPaymentChange = () => {
        setPaymentMethod('credit');
        dispatch({ type: 'SET_PAYMENT_METHOD', payload: 'credit' });
    };


    const decreaseQuantity = (i: number, id: string) => {
        let data = [...quantity];
        data[i] -= 1;
        setQuantity(data);

        const changedQuantity = {
            totalQuantity: data[i],
            cartId: id,
        }

        dispatch({ type: 'CART_CHANGE_QUANTITY', payload: changedQuantity });
    }

    const increaseQuantity = (i: number, id: string) => {
        let data = [...quantity];
        data[i] += 1;
        setQuantity(data);

        const changedQuantity = {
            totalQuantity: data[i],
            cartId: id,
        }

        dispatch({ type: 'CART_CHANGE_QUANTITY', payload: changedQuantity });
    }

    const handleDelete = (id: string) => {
        dispatch({ type: 'DELETE_FROM_CART', payload: id });
    }

    const onSubmitCredit: SubmitHandler<FormValues> = (data) => {
        const deliveryAddress = {
            streetAddress: data.streetAddress,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode.toString()
        }

        dispatch({ type: 'SET_DELIVERY_ADDRESS', payload: deliveryAddress })

        const cart = {
            itemsPrice: Number(cartItems?.reduce((acc, cur, i) => acc + quantity[i] * cur.priceEach, 0).toFixed(2)),
            taxPrice: Number(((cartItems?.reduce((acc, cur, i) => acc + quantity[i] * cur.priceEach, 0).toFixed(2)) * 0.08).toFixed(2)),
            totalPrice: method === 'delivery' ? Number(((cartItems?.reduce((acc, cur, i) => acc + quantity[i] * cur.priceEach, 0).toFixed(2)) * 1.08 + 4.50).toFixed(2)) : Number(((cartItems?.reduce((acc, cur, i) => acc + quantity[i] * cur.priceEach, 0).toFixed(2)) * 1.08).toFixed(2))
        }

        dispatch({ type: 'SET_PRICE', payload: cart })

        if (!session) {
            router.push('/signIn');
        } else {
            router.push(`/payment`);
        }
    }

    const onSubmitCash: SubmitHandler<FormValues> = async (data) => {
        const deliveryAddress = await {
            streetAddress: data.streetAddress,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode.toString()
        }

        await dispatch({ type: 'SET_DELIVERY_ADDRESS', payload: deliveryAddress })

        const cart = await {
            itemsPrice: Number(cartItems?.reduce((acc, cur, i) => acc + quantity[i] * cur.priceEach, 0).toFixed(2)),
            taxPrice: Number(((cartItems?.reduce((acc, cur, i) => acc + quantity[i] * cur.priceEach, 0).toFixed(2)) * 0.08).toFixed(2)),
            totalPrice: method === 'delivery' ? Number(((cartItems?.reduce((acc, cur, i) => acc + quantity[i] * cur.priceEach, 0).toFixed(2)) * 1.08 + 4.50).toFixed(2)) : Number(((cartItems?.reduce((acc, cur, i) => acc + quantity[i] * cur.priceEach, 0).toFixed(2)) * 1.08).toFixed(2))
        }

        await dispatch({ type: 'SET_PRICE', payload: cart })

        if (!session) {
            router.push('/signIn');
        } else {
            router.push(`/thankYou`);
        }
    }

    const findNearestStore: SubmitHandler<FormValues> = (data) => {
        const query = data.streetAddress + ' ' + data.city + ' ' + data.state + ' ' + data.zipCode

        router.push(`/locations?query=${query}`);
    }

    return (
        <Layout>
            <div>
                <Head>
                    <title>Pizza Tut - Shopping Cart</title>
                </Head>
                <div className="flex flex-col items-center gap-y-4">
                    <h1 className="font-bold text-4xl font-thunder py-6 lg:py-12">SHOPPING CART</h1>
                    {cartItems ?

                        <div className="flex flex-col">
                            <div className="self-start flex flex-row gap-x-8">
                                <RadioButton
                                    label="Delivery"
                                    value={method === 'delivery'}
                                    onChange={handleDeliveryChange}
                                />
                                <RadioButton
                                    label="Carryout"
                                    value={method === 'carryout'}
                                    onChange={handleCarryoutChange}
                                />
                            </div>
                            <div>
                                <div className="flex flex-col xl:w-[1200px] gap-y-8">
                                    {cartItems?.map((item, i) => (
                                        <div key={i} className="flex flex-col xl:flex-row xl:items-center gap-x-8 uppercase">
                                            <div className="w-[100px] h-full"><img src={item.image} /></div>
                                            <div className="text-lg font-bold w-[300px]">{item.name}</div>
                                            <div className="font-normal w-[200px]">PRICE: <span className="font-bold">${item.priceEach}</span></div>
                                            <div className="flex flex-row items-center font-bold">
                                                <span className="mr-4 font-normal">QUANTITY</span>
                                                <button className="flex flex-row items-center place-content-center cursor-pointer select-none bg-dOrange text-white h-4 w-4 md:h-6 md:w-6 rounded-sm" onClick={() => decreaseQuantity(i, item.cartId)} disabled={quantity[i] <= 1}>-</button>
                                                <div className="w-8 text-center">
                                                    {quantity[i]}
                                                </div>
                                                <button className="flex flex-row items-center place-content-center cursor-pointer select-none bg-dOrange text-white h-4 w-4 md:h-6 md:w-6 rounded-sm" onClick={() => increaseQuantity(i, item.cartId)} disabled={quantity[i] >= 99}>+</button>
                                            </div>
                                            <div>
                                                <button onClick={() => handleDelete(item.cartId)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="xl:ml-auto">
                                                SUBTOTAL: <span className="font-bold">${(item.priceEach * quantity[i]).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex flex-col self-start xl:ml-auto">
                                        <div className="self-end">SUBTOTAL: <span className="font-bold">${(cartItems?.reduce((acc, cur, i) => acc + quantity[i] * cur.priceEach, 0).toFixed(2))}</span></div>
                                        <div className="self-end">TAX: <span className="font-bold">${((cartItems?.reduce((acc, cur, i) => acc + quantity[i] * cur.priceEach, 0).toFixed(2)) * 0.08).toFixed(2)}</span></div>
                                        {method === 'delivery' && <div className="self-end">DELIVERY FEE: <span className="font-bold">$4.50</span></div>}
                                        <div className="font-bold self-end">TOTAL: ${((cartItems?.reduce((acc, cur, i) => acc + quantity[i] * cur.priceEach, 0).toFixed(2)) * 1.08 + 4.50).toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>
                            {!session?.user ? <div><button className="bg-cBrown text-white font-bold text-xl py-2 px-4 rounded-md shadow-xl" onClick={() => router.push('/signIn')}>LOGIN TO COMPLETE ORDER</button></div> :
                                <div className="flex flex-col xl:flex-row gap-x-8 mt-12">
                                    <div className="flex flex-col">
                                        <div>
                                            <h1 className="font-bold text-xl mb-4">MY STORE</h1>
                                            {myStore && <div className="uppercase font-bold text-lg">
                                                <h2 className="font-black text-xl">{myStore.name}</h2>
                                                <p>{myStore.streetAddress}</p>
                                                <p>{myStore.city}, {myStore.state} {myStore.zipCode}</p>
                                            </div>
                                            }
                                        </div>
                                        {myStore ?
                                            null
                                            :
                                            <div>
                                                <button className="bg-cBrown text-white font-bold py-2 px-4 rounded-md shadow-xl" onClick={handleSubmit(findNearestStore)}>
                                                    FIND NEAREST STORE
                                                </button>

                                            </div>
                                        }
                                    </div>
                                    {method === 'delivery' &&
                                        <div className="mr-24 w-full xl:w-[400px]">
                                            <h1 className="font-bold text-xl mb-4">ENTER DELIVERY ADDRESS</h1>

                                            <form className="flex flex-col gap-y-2 xl:basis-1/2">
                                                <div className="relative flex flex-col">
                                                    <div>
                                                        <label className="font-bold text-sm" htmlFor="streetAddress">STREET ADDRESS</label>
                                                    </div>
                                                    <input className="bg-white text-black rounded-md p-2 border-cOrange border-2 focus:outline-cBrown w-full" placeholder="Street Address" {...register("streetAddress", { required: true })} />
                                                    {errors.streetAddress &&
                                                        <div className="text-xs font-bold uppercase">Can&apos;t be empty</div>
                                                    }
                                                </div>

                                                <div className="relative flex flex-col">
                                                    <div>
                                                        <label className="font-bold text-sm" htmlFor="city">CITY</label>
                                                    </div>
                                                    <input className="bg-white text-black rounded-md p-2 border-cOrange border-2 focus:outline-cBrown w-full" placeholder="City" {...register("city", { required: true })} />
                                                    {errors.city && <div className="text-xs font-bold uppercase">Can&apos;t be empty</div>
                                                    }
                                                </div>

                                                <div className="flex flex-row gap-x-8">
                                                    <div className="relative flex flex-col basis-1/4">
                                                        <div>
                                                            <label className="font-bold text-sm" htmlFor="state">STATE</label>
                                                        </div>
                                                        <input className="bg-white text-black rounded-md p-2 border-cOrange border-2 focus:outline-cBrown w-full" placeholder="State" {...register("state", { required: true })} />
                                                        {errors.state && <div className="text-xs font-bold uppercase">Can&apos;t be empty</div>
                                                        }
                                                    </div>

                                                    <div className="relative flex flex-col basis-3/4">
                                                        <div>
                                                            <label className="font-bold text-sm" htmlFor="zipCode">ZIP CODE</label>
                                                        </div>
                                                        <input className="bg-white text-black rounded-md p-2 border-cOrange border-2 focus:outline-cBrown w-full" placeholder="Zip Code" {...register("zipCode", { required: true })} />
                                                        {errors.zipCode && <div className="text-xs font-bold uppercase">Can&apos;t be empty</div>
                                                        }
                                                    </div>
                                                </div>
                                            </form>
                                        </div>

                                    }
                                    <div className="font-bold">
                                        <h1 className="mb-4 text-lg">PAYMENT METHOD:</h1>
                                        <div className="self-start flex flex-col gap-y-4">
                                            <div className="flex flex-row items-center gap-x-4">
                                                <RadioButton
                                                    label="Credit/Debit"
                                                    value={paymentMethod === 'credit'}
                                                    onChange={handleCreditPaymentChange}
                                                />
                                                <img src="/images/creditCards.png" alt="creditCards" className="w-[100px] h-full" />
                                            </div>
                                            <RadioButton
                                                label="Cash"
                                                value={paymentMethod === 'cash'}
                                                onChange={handleCashPaymentChange}
                                            />
                                        </div>
                                    </div>
                                    {!myStore ?
                                        null
                                        :
                                        paymentMethod === 'credit' ?
                                            <div>
                                                <button className="bg-cBrown text-white font-bold py-2 px-4 rounded-md mt-4 shadow-xl" onClick={handleSubmit(onSubmitCredit)}>
                                                    PROCEED TO PAYMENT
                                                </button>
                                            </div>
                                            :
                                            <div>
                                                <button className="bg-cBrown text-white font-bold py-2 px-4 rounded-md mt-4 shadow-xl" onClick={handleSubmit(onSubmitCash)}>
                                                    PROCEED TO CHECKOUT
                                                </button>
                                            </div>
                                    }
                                </div>
                            }
                        </div> : <div className="flex flex-col items-center font-bold text-xl gap-y-8"><h1>YOUR SHOPPING CART IS EMPTY</h1><Link className="bg-cBrown text-white py-2 px-4 rounded-md" href="/menu">ADD SOMETHING!</Link></div>
                    }
                </div>

            </div>
        </Layout >
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions)

    await dbConnect()

    //@ts-ignore
    const result = session ? await User.findById({ _id: session.user._id }) : null;

    let user;

    if (session) {
        user = result.toObject()
        user._id = user._id.toString()
    }


    return { props: { user: session ? JSON.parse(JSON.stringify(user)) : null } }
}
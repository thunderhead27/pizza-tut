import Layout from "@/components/layout";
import { GetServerSideProps } from "next";
import { InferGetServerSidePropsType } from 'next'
import dbConnect from '../lib/dbConnect'
import Product from "@/models/Product";
import Image from "next/image";
import { useState, useContext, useEffect } from "react";
import { CartContext } from "@/context/CartContext";
import Head from "next/head";
import Link from "next/link";
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface Pizza {
    id: number;
    name: string;
    image: string;
    description: string;
    price: Array<{ size: string; price: number }>;
    points: number;
}

export default function Pizzas({ pizzas }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [size, setSize] = useState(Array<string>);

    const initialQuantity = new Array(pizzas.length).fill(1);
    const [quantity, setQuantity] = useState(initialQuantity);

    const { state, dispatch } = useContext(CartContext)

    const notify = () => toast("Added to cart!");


    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(state.cart.cartItems))
    }, [state.cart.cartItems])

    const handleAddToCart = (i: number, pizza: Pizza) => {
        const prices = pizza.price.find(el => el.size === size[i]);

        const product = {
            cartId: uuidv4(),
            name: pizza.name,
            priceEach: prices!.price,
            image: pizza.image,
            pizzaSize: size[i],
            id: pizza.id,
            totalQuantity: quantity[i],
            points: pizza.points
        }

        dispatch({ type: 'CART_ADD_ITEM', payload: product });

    }


    const handleSizeChange = (i: number, e: React.ChangeEvent<HTMLSelectElement>) => {
        let data = [...size];
        data[i] = e.target.value;
        setSize(data);
    }

    const decreaseQuantity = (i: number) => {
        let data = [...quantity];
        data[i] -= 1;
        setQuantity(data);
    }

    const increaseQuantity = (i: number) => {
        let data = [...quantity];
        data[i] = data[i] + 1;
        setQuantity(data);
    }

    const handleQuantityChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
        let data = [...quantity];
        data[i] = Number(e.target.value);
        setQuantity(data);
    }

    return (
        <Layout>
            <div>
                <Head>
                    <title>Pizza Tut - Pizzas</title>
                </Head>
                <ToastContainer theme="colored" autoClose={2000} />
                <div className="flex flex-col items-center gap-y-4">
                    <h1 className="font-bold text-4xl font-thunder py-6 lg:py-12">PIZZAS</h1>
                    <div className="flex flex-row gap-x-4">
                        <div className="bg-[url('/images/pizzas/deluxe.png')] lg:w-[400px] lg:h-[250px] md:w-[200px] md:h-[120px] w-[100px] h-[60px] bg-cover"></div>
                        <div className="flex flex-col lg:w-[750px] w-[250px]">
                            <h1 className="font-bold lg:text-3xl md:text-xl text-sm">BUILD-YOUR-OWN PIZZA</h1>
                            <p className="lg:text-lg text-xs font-medium mb-4">FOR A LIMITED TIME ONLY.  <span className="font-black">UNLIMITED</span> TOPPINGS ON A LARGE PIZZA FOR ONLY <span className="font-black">$22.99</span></p>
                            <Link href="/pizzaBuilder">
                                <button className="bg-cOrange w-fit p-2 lg:p-4 rounded-md font-bold shadow-xl">TAKE ME TO PIZZA BUILDER!</button>
                            </Link>
                        </div>
                    </div>
                    {pizzas.map((pizza: Pizza, i: number) => (
                        <div key={pizza.id} className="flex flex-row gap-x-4 pt-12">
                            <img src={pizza.image} className="lg:w-[400px] lg:h-[250px] md:w-[200px] md:h-[120px] w-[100px] h-[60px]" alt={pizza.name} />
                            <div className="flex flex-col lg:w-[750px] w-[250px]">
                                <h1 className="font-bold lg:text-3xl md:text-xl text-sm uppercase">{pizza.name}</h1>
                                <p className="lg:text-lg text-xs font-medium mb-4">{pizza.description}</p>
                                <div className="flex flex-col lg:items-center gap-y-2 lg:flex-row gap-x-6">
                                    <div className="flex flex-row items-center gap-x-4 text-sm lg:text-xl">
                                        <div className="flex flex-row gap-x-4">
                                            <label htmlFor="size-select" className="font-bold">SIZE</label>
                                            <select className="rounded-md" value={size[i]} onChange={e => handleSizeChange(i, e)} name="size" id="size-select">
                                                <option value="">CHOOSE SIZE</option>
                                                <option value="small">SMALL</option>
                                                <option value="medium">MEDIUM</option>
                                                <option value="large">LARGE</option>
                                                <option value="xLarge">X-LARGE</option>
                                            </select>
                                        </div>
                                        <div className="text-xs xl:text-xl xl:w-[150px] font-bold uppercase">
                                            Price: <span className="text-sm lg:text-xl">${size[i] ? pizza.price.find(el => el.size === size[i])!.price : null}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex flex-row gap-x-4 text-sm lg:text-xl">
                                            <div className="font-bold">QTY:</div>
                                            <div className="flex flex-row items-center font-bold">
                                                <button className="flex flex-row items-center place-content-center cursor-pointer select-none bg-dOrange text-white h-4 w-4 md:h-6 md:w-6 rounded-sm" onClick={() => decreaseQuantity(i)} disabled={quantity[i] <= 1}>-</button>
                                                <input type="number" className="w-8 text-center" value={quantity[i]} onChange={e => handleQuantityChange(i, e)}></input>
                                                <button className="flex flex-row items-center place-content-center cursor-pointer select-none bg-dOrange text-white h-4 w-4 md:h-6 md:w-6 rounded-sm" onClick={() => increaseQuantity(i)} disabled={quantity[i] >= 99}>+</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <button className="bg-cOrange rounded-md font-bold w-fit h-fit text-sm p-2 shadow-xl" onClick={() => { handleAddToCart(i, pizza); notify(); }} disabled={!size[i]}>ADD TO CART</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {
    await dbConnect()

    // @ts-ignore
    const result = await Product.find({}).sort({ id: 1 })

    const products = result.map((doc) => {
        const product = doc.toObject()
        product._id = product._id.toString()
        return product
    })

    const pizzas = products.filter(product => product.category === "pizza")

    return { props: { pizzas: JSON.parse(JSON.stringify(pizzas)) } }
}
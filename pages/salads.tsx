import Layout from "@/components/layout";
import { CartContext } from "@/context/CartContext";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { GetServerSideProps } from "next";
import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface Salad {
    id: number;
    name: string;
    image: string;
    description: string;
    price: number
    points: number
}

export default function Salads({ salads }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const initialQuantity = new Array(salads.length).fill(1);
    const [quantity, setQuantity] = useState(initialQuantity);

    const { state, dispatch } = useContext(CartContext)

    const notify = () => toast("Added to cart!");


    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(state.cart.cartItems))
    }, [state.cart.cartItems])

    const handleAddToCart = (i: number, salad: Salad) => {

        const product = {
            cartId: uuidv4(),
            name: salad.name,
            priceEach: salad.price,
            image: salad.image,
            id: salad.id,
            points: salad.points,
            totalQuantity: quantity[i],
        }

        dispatch({ type: 'CART_ADD_ITEM', payload: product });

        console.log(state);
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
                    <title>Pizza Tut - Salads</title>
                </Head>
                <ToastContainer theme="colored" autoClose={2000} />

                <div className="flex flex-col items-center gap-y-4">
                    <h1 className="font-bold text-4xl font-thunder py-6 lg:py-12">SALADS</h1>

                    {salads.map((salad: Salad, i: number) => (
                        <div key={salad.id} className="flex flex-row gap-x-4 pt-12">
                            <img src={salad.image} className="lg:w-[400px] lg:h-[250px] md:w-[200px] md:h-[120px] w-[100px] h-[60px]" alt={salad.name} />
                            <div className="flex flex-col lg:w-[750px] w-[250px]">
                                <h1 className="font-bold lg:text-3xl md:text-xl text-sm uppercase">{salad.name}</h1>
                                <p className="lg:text-lg text-xs font-medium mb-4">{salad.description}</p>
                                <div className="flex flex-col lg:items-center gap-y-2 lg:flex-row gap-x-6">
                                    <div className="flex flex-row items-center gap-x-4 text-sm lg:text-xl">
                                        <div className="text-xs lg:text-xl font-bold uppercase">
                                            Price: <span className="text-sm lg:text-xl">{salad.price}</span>
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
                                        <button className="bg-cOrange rounded-md font-bold w-fit text-sm p-2 shadow-xl" onClick={() => { handleAddToCart(i, salad); notify(); }}>ADD TO CART</button>
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

    const salads = products.filter(product => product.category === "salad")

    return { props: { salads: JSON.parse(JSON.stringify(salads)) } }
}
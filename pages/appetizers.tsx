import Layout from "@/components/layout";
import { CartContext } from "@/context/CartContext";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Appetizer {
    id: number;
    name: string;
    image: string;
    description: string;
    price: number;
    points: number;
    dressing?: [string];
    flavor?: [string];
}

export default function Appetizers({ appetizers }: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const initialQuantity = new Array(5).fill(1);
    const [quantity, setQuantity] = useState(initialQuantity);

    const [flavor, setFlavor] = useState('MILD');

    const initialDressing = new Array(appetizers.length).fill('RANCH');
    const [dressing, setDressing] = useState(initialDressing);

    const { state, dispatch } = useContext(CartContext)

    const notify = () => toast("Added to cart!");



    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(state.cart.cartItems))
    }, [state.cart.cartItems])

    const handleAddToCart = (i: number, appetizer: Appetizer) => {

        const product = {
            cartId: uuidv4(),
            name: appetizer.name,
            priceEach: appetizer.price,
            image: appetizer.image,
            id: appetizer.id,
            totalQuantity: quantity[i],
            points: appetizer.points,
            flavor: flavor,
            dressing: dressing[i]
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

    const handleDressingChange = (i: number, e: React.ChangeEvent<HTMLSelectElement>) => {
        let data = [...dressing];
        data[i] = (e.target.value);
        setDressing(data);
    }

    const handleFlavorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFlavor(e.target.value);
    }



    return (
        <Layout>
            <div>
                <Head>
                    <title>Pizza Tut - Appetizers</title>
                </Head>
                <ToastContainer theme="colored" autoClose={2000} />
                <div className="flex flex-col items-center gap-y-4">
                    <h1 className="font-bold text-4xl font-thunder py-6 lg:py-12">APPETIZERS</h1>

                    {appetizers.map((appetizer: Appetizer, i: number) => (
                        <div key={appetizer.id} className="flex flex-row gap-x-4 pt-12">
                            <img src={appetizer.image} className="lg:w-[400px] lg:h-[250px] md:w-[200px] md:h-[120px] w-[100px] h-[60px]" alt={appetizer.name} />
                            <div className="flex flex-col lg:w-[750px] w-[250px]">
                                <h1 className="font-bold lg:text-3xl md:text-xl text-sm uppercase">{appetizer.name}</h1>
                                <p className="lg:text-lg text-xs font-medium mb-4">{appetizer.description}</p>
                                <div className="flex flex-col lg:items-center gap-y-2 lg:flex-row gap-x-6">
                                    <div className="flex flex-col gap-x-4 text-sm lg:text-xl">
                                        {appetizer.flavor!.length > 0 && appetizer.dressing!.length > 0 ?
                                            <div className="flex flex-col gap-y-8">
                                                {appetizer.flavor!.length > 0 ?
                                                    <div className="flex flex-row gap-x-4">
                                                        <label htmlFor="flavor-select" className="font-bold">FLAVOR</label>
                                                        <select className="rounded-md" value={flavor} onChange={e => handleFlavorChange(e)} name="flavor" id="flavor-select">
                                                            <option value="mild">MILD</option>
                                                            <option value="medium">MEDIUM</option>
                                                            <option value="hot">HOT</option>
                                                            <option value="extraHot">EXTRA HOT</option>
                                                        </select>
                                                    </div>
                                                    :
                                                    null}
                                                {appetizer.dressing!.length > 0 ?
                                                    <div className="flex flex-row gap-x-4">
                                                        <label htmlFor="dressing-select" className="font-bold">DRESSING</label>
                                                        <select className="rounded-md" value={dressing} onChange={e => handleDressingChange(i, e)} name="dressing" id="dressing-select">
                                                            <option value="ranch">RANCH</option>
                                                            <option value="medium">BLUE CHEESE</option>
                                                        </select>
                                                    </div>
                                                    :
                                                    null}
                                            </div> : null
                                        }
                                        <div className="text-xs lg:text-xl font-bold uppercase">
                                            Price: <span className="text-sm lg:text-xl">{appetizer.price}</span>
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
                                        <button className="bg-cOrange rounded-md font-bold w-fit text-sm p-2 shadow-xl" onClick={() => { handleAddToCart(i, appetizer); notify() }}>ADD TO CART</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout >
    )
}

export const getServerSideProps: GetServerSideProps = async () => {
    await dbConnect()

    //@ts-ignore
    const result = await Product.find({}).sort({ id: 1 })

    const products = result.map((doc) => {
        const product = doc.toObject()
        product._id = product._id.toString()
        return product
    })

    const appetizers = products.filter(product => product.category === "appetizer")

    return { props: { appetizers: JSON.parse(JSON.stringify(appetizers)) } }
}
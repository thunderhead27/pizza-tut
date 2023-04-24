import Layout from "@/components/layout";
import { CartContext } from "@/context/CartContext";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from 'uuid';


interface ToppingProps {
    readonly isOn: boolean;
}

const Topping = styled.div<ToppingProps>`
    position: absolute;
    background-size: cover;
    width: 1000px;
    height: 1000px;
    top: -3000px;
    transition: 350ms;

    @media (max-width: 1280px) {
        width: 500px;
        height: 500px;
    }   

    @media (max-width: 768px) and (min-width: 320px) {
        width: 350px;
        height: 350px;
    }
    

    ${({ isOn }) => (isOn ? `top: 0` : ``)};

`

const Pepperoni = styled(Topping)`
    background-image: url('/images/pizzaBuilder/Pepperoni.png')
`

const Onions = styled(Topping)`
    background-image: url('/images/pizzaBuilder/Onions.png')
`

const Peppers = styled(Topping)`
    background-image: url('/images/pizzaBuilder/Peppers.png')
`

const Mushrooms = styled(Topping)`
    background-image: url('/images/pizzaBuilder/Mushrooms.png')
`

const Sausages = styled(Topping)`
    background-image: url('/images/pizzaBuilder/Sausages.png')
`

const Olives = styled(Topping)`
    background-image: url('/images/pizzaBuilder/Olives.png')
`

export default function PizzaBuilder() {
    const toppings = ['pepperoni', 'green pepper', 'red onion', 'mushroom', 'italian sausage', 'olive'];

    const [checkedState, setCheckedState] = useState(new Array(toppings.length).fill(false))
    const [quantity, setQuantity] = useState(1);

    const { state, dispatch } = useContext(CartContext)

    const router = useRouter();

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(state.cart.cartItems))
    }, [state.cart.cartItems])

    const decreaseQuantity = () => {
        setQuantity(prev => prev - 1);
    }

    const increaseQuantity = () => {
        setQuantity(prev => prev + 1);
    }

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuantity(Number(e.target.value));
    }

    const handleOnChange = (position: number) => {
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );
        setCheckedState(updatedCheckedState)
    }

    const handleAddToCart = () => {
        let addedToppings = [];

        for (let i = 0; i < checkedState.length; i++) {
            if (checkedState[i] === true) {
                addedToppings.push(toppings[i]);
            }
        }

        const product = {
            name: "Custom Pizza",
            priceEach: 22.99,
            cartId: uuidv4(),
            id: 50,
            image: '/images/pizzas/deluxe.png',
            totalQuantity: quantity,
            toppings: addedToppings,
        }

        dispatch({ type: 'CART_ADD_ITEM', payload: product });

        router.push('/shoppingCart')
    }

    return (
        <Layout>
            <div>
                <Head>
                    <title>Pizza Tut - Pizza Builder</title>
                </Head>
                <div className="flex flex-col items-center gap-y-4">
                    <h1 className="font-bold text-4xl font-thunder pt-6 xl:pt-12">PIZZA BUILDER</h1>
                    <div className="xl:flex flex-row w-[1440px]">
                        <div className="relative">
                            <div className="absolute z-0 bg-[url('/images/pizzaBuilder/Cheese_Pizza.png')] w-[350px] h-[350px] md:w-[500px] md:h-[500px] xl:w-[1000px] xl:h-[1000px] bg-cover mx-auto left-0 right-0 xl:left-24">
                            </div>
                            <Pepperoni className="mx-auto left-0 right-0 xl:left-24" isOn={checkedState[0]} />
                            <Peppers className="mx-auto left-0 right-0 xl:left-24" isOn={checkedState[1]} />
                            <Onions className="mx-auto left-0 right-0 xl:left-24" isOn={checkedState[2]} />
                            <Mushrooms className="mx-auto left-0 right-0 xl:left-24" isOn={checkedState[3]} />
                            <Sausages className="mx-auto left-0 right-0 xl:left-24" isOn={checkedState[4]} />
                            <Olives className="mx-auto left-0 right-0 xl:left-24" isOn={checkedState[5]} />

                        </div>
                        <div className="flex flex-col gap-y-2 xl:gap-y-4 absolute bottom-20 md:bottom-48 mx-auto left-0 right-0 w-fit xl:top-0 xl:bottom-0 xl:my-auto xl:h-fit xl:left-[1000px]">
                            {toppings.map((name: string, i: number) => {
                                return (
                                    <div key={i} className="flex flex-row items-center gap-x-4">
                                        <input className="h-6 w-6 accent-cOrange" type="checkbox" id={`checkbox-${i}`} name={name} value={name} checked={checkedState[i]} onChange={() => handleOnChange(i)} />
                                        <label className="font-bold text-sm md:text-2xl" htmlFor={`checkbox-${i}`}>{name.toUpperCase()}</label>
                                    </div>
                                )
                            })}
                            <div className="flex flex-row gap-x-4 gap-y-4 md:mt-12 xl:flex-col">
                                <div className="flex flex-row gap-x-4 text-sm md:text-xl">
                                    <div className="font-bold">QTY:</div>
                                    <div className="flex flex-row items-center font-bold">
                                        <button className="flex flex-row items-center place-content-center cursor-pointer select-none bg-dOrange text-white h-4 w-4 md:h-6 md:w-6 rounded-sm" onClick={() => decreaseQuantity()} disabled={quantity <= 1}>-</button>
                                        <input type="number" className="w-8 text-center" value={quantity} onChange={e => handleQuantityChange(e)}></input>
                                        <button className="flex flex-row items-center place-content-center cursor-pointer select-none bg-dOrange text-white h-4 w-4 md:h-6 md:w-6 rounded-sm" onClick={() => increaseQuantity()} disabled={quantity >= 99}>+</button>
                                    </div>
                                </div>
                                <div>
                                    <button className="bg-cOrange rounded-md font-bold w-fit text-sm p-2" onClick={() => handleAddToCart()}>ADD TO CART</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
import Layout from "@/components/layout";
import OutsideAlerter from "@/hooks/useOutsideAlerter";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import mongoose from "mongoose";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import styled from "styled-components";
import axios from 'axios';
import { useRouter } from "next/router";

interface OverlayProps {
    readonly isOpen: boolean;
}

const Overlay = styled.div<OverlayProps>`
${({ isOpen }) => (isOpen ? `background-color: rgba(0,0,0,0.5); filter: brightness(50%)` : ``)};
`;

interface Props {
    readonly open: boolean;
}

const Modal = styled.div<Props>`
    ${({ open }) => (open ? `visibility: visible;` : `visibility: hidden`)};
`

interface FormValues {
    name: string
    description: string
    image: string
    price: { size: string, price: number }[]
    points: number
}

export default function EditPizza({ pizza }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const priceArray = pizza.price.map((price) => price.price.toString());

    const [isOpen, setIsOpen] = useState(false);
    const [confirmIsOpen, setConfirmIsOpen] = useState(false);
    const [priceArr, setPriceArr] = useState(priceArray);
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            name: pizza.name,
            description: pizza.description,
            image: pizza.image,
            price: [{ size: pizza.price.size, price: pizza.price.price }],
            points: pizza.points
        }
    })

    let updatedPrice = pizza.price;

    const handlePriceChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
        let data = [...priceArr];
        data[i] = e.target.value;
        setPriceArr(data);
    }


    useEffect(() => {
        for (let i = 0; i < updatedPrice.length; i++) {
            updatedPrice[i].price = Number(priceArr[i]);
        }

    }, [priceArr, updatedPrice])




    const submitChanges: SubmitHandler<FormValues> = async (data) => {

        const updatedPizza = {
            name: data.name,
            description: data.description,
            image: data.image,
            price: updatedPrice,
            points: data.points
        }

        console.log(updatedPizza);

        await axios.put(`/api/admin/products/edit/${pizza._id}`, updatedPizza)

        setIsOpen(false);
        setConfirmIsOpen(true);
    }

    return (
        <div>
            <OutsideAlerter setFunction={setIsOpen}>
                <Modal open={isOpen} className="absolute z-20 flex flex-col items-center justify-between py-12 bg-white mx-auto my-auto left-0 right-0 bottom-0 top-0 w-[300px] h-[200px] rounded-md">
                    <div>
                        Save changes?
                    </div>
                    <div className="flex flex-row gap-x-12">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleSubmit(submitChanges)}>Yes</button>
                        <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={() => setIsOpen(false)}>Cancel</button>
                    </div>
                </Modal>
            </OutsideAlerter>
            <OutsideAlerter setFunction={setConfirmIsOpen}>
                <Modal open={confirmIsOpen} className="absolute z-20 flex flex-col items-center justify-between py-12 bg-white mx-auto my-auto left-0 right-0 bottom-0 top-0 w-[300px] h-[200px] rounded-md">
                    <div>
                        Product updated.
                    </div>
                    <div className="flex flex-row gap-x-12">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => setConfirmIsOpen(false)}>Ok</button>
                    </div>
                </Modal>
            </OutsideAlerter>
            <Overlay isOpen={isOpen || confirmIsOpen}>
                <Layout>
                    <div>
                        <div className="absolute flex flex-col gap-y-4 top-[200px] left-8 xl:text-2xl uppercase">
                            <button onClick={() => router.back()}>GO BACK</button>
                        </div>
                        <div className="flex flex-col items-center gap-y-4">
                            <h1 className="font-bold text-4xl font-thunder py-6 lg:py-12">EDIT PIZZA</h1>
                            <form className="w-[800px]">
                                <div className="relative flex flex-col">
                                    <div>
                                        <label className="font-bold text-sm" htmlFor="name">Name</label>
                                    </div>
                                    <input className="bg-white text-black rounded-md p-2 border-cOrange border-2 focus:outline-cBrown w-full" placeholder="Name" {...register("name", { required: true })} />
                                    {errors.name &&
                                        <div className="text-xs font-bold uppercase">Can&apos;t be empty</div>
                                    }
                                </div>
                                <div className="relative flex flex-col">
                                    <div>
                                        <label className="font-bold text-sm" htmlFor="description">Description</label>
                                    </div>
                                    <textarea className="bg-white text-black rounded-md p-2 border-cOrange border-2 focus:outline-cBrown w-full" placeholder="Description" {...register("description", { required: true })} />
                                    {errors.description &&
                                        <div className="text-xs font-bold uppercase">Can&apos;t be empty</div>
                                    }
                                </div>
                                <div className="relative flex flex-col">
                                    <div>
                                        <label className="font-bold text-sm" htmlFor="image">Image</label>
                                    </div>
                                    <input className="bg-white text-black rounded-md p-2 border-cOrange border-2 focus:outline-cBrown w-full" placeholder="Image" {...register("image", { required: true })} />
                                    {errors.image &&
                                        <div className="text-xs font-bold uppercase">Can&apos;t be empty</div>
                                    }
                                </div>
                                <div className="flex flex-col">
                                    {pizza.price.map((el, i) => (
                                        <div className="flex flex-row gap-x-8 items-center" key={i}>
                                            <div>
                                                <label className="font-bold text-sm" htmlFor="size">Size</label>
                                                <div className="uppercase">{el.size}</div>
                                            </div>
                                            <div className="relative flex flex-col">
                                                <div>
                                                    <label className="font-bold text-sm" htmlFor="price">Price</label>
                                                </div>
                                                <input className="bg-white text-black rounded-md p-2 border-cOrange border-2 focus:outline-cBrown w-full" placeholder="Price" value={priceArr[i]} onChange={(e) => handlePriceChange(i, e)} type="number" step="0.01" required={true} />
                                            </div>
                                        </div>

                                    ))}
                                </div>
                                <div className="relative flex flex-col">
                                    <div>
                                        <label className="font-bold text-sm" htmlFor="points">Points</label>
                                    </div>
                                    <input className="bg-white text-black rounded-md p-2 border-cOrange border-2 focus:outline-cBrown w-full" placeholder="Description" {...register("points", { required: true })} />
                                    {errors.points &&
                                        <div className="text-xs font-bold uppercase">Can&apos;t be empty</div>
                                    }
                                </div>
                            </form>
                            <button className="bg-cOrange px-4 py-2 rounded-md font-bold" onClick={() => setIsOpen(true)}>SAVE CHANGES</button>
                        </div>
                    </div>
                </Layout>
            </Overlay>
        </div >
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    let id = context.query;
    //@ts-ignore
    id = new mongoose.Types.ObjectId(id);

    await dbConnect()

    //@ts-ignore
    const result = await Product.findOne({ _id: id })

    return { props: { pizza: JSON.parse(JSON.stringify(result)) } }
}

EditPizza.auth = { adminOnly: true };
import Layout from "@/components/layout";
import OutsideAlerter from "@/hooks/useOutsideAlerter";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import mongoose from "mongoose";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useState } from "react";
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
    price: number
    points: number
}

export default function EditAppetizer({ appetizer }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [isOpen, setIsOpen] = useState(false);
    const [confirmIsOpen, setConfirmIsOpen] = useState(false);

    const [dressings, setDressings] = useState(appetizer.dressing.map(el => el));
    const [flavors, setFlavors] = useState(appetizer.flavor.map(el => el));

    const handleFlavorChange = (i, e) => {
        let data = [...flavors];
        data[i] = e.target.value;
        setFlavors(data);
    }

    const handleDressingChange = (i, e) => {
        let data = [...dressings];
        data[i] = e.target.value;
        setDressings(data);
    }

    const addFlavor = (e) => {
        e.preventDefault();
        let newField = ''
        setFlavors([...flavors, newField])
    }

    const removeFlavor = (i, e) => {
        e.preventDefault();
        let data = [...flavors];
        data.splice(i, 1)
        setFlavors(data);
    }

    const addDressing = (e) => {
        e.preventDefault();
        let newField = ''
        setDressings([...dressings, newField])
    }

    const removeDressing = (i, e) => {
        e.preventDefault();
        let data = [...dressings];
        data.splice(i, 1)
        setDressings(data);
    }

    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            name: appetizer.name,
            description: appetizer.description,
            image: appetizer.image,
            price: appetizer.price,
            points: appetizer.points
        }
    })

    const submitChanges: SubmitHandler<FormValues> = async (data) => {
        console.log(data);

        const updatedAppetizer = {
            name: data.name,
            description: data.description,
            image: data.image,
            price: data.price,
            points: data.points,
            dressing: dressings,
            flavor: flavors
        }

        await axios.put(`/api/admin/products/edit/${appetizer._id}`, updatedAppetizer)

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
                            <h1 className="font-bold text-4xl font-thunder py-6 lg:py-12">EDIT APPETIZER</h1>
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
                                {appetizer.flavor &&
                                    <div className="relative flex flex-col">
                                        <div>
                                            <label className="font-bold text-sm" htmlFor="flavor">Flavor</label>
                                        </div>
                                        <div className="flex flex-col gap-y-2">
                                            {flavors.map((el, i) =>
                                                <div className="flex flex-row items-center gap-x-4" key={i}>
                                                    <input className="bg-white text-black rounded-md p-2 border-cOrange border-2 focus:outline-cBrown w-[200px]" placeholder="Flavor" name="flavor" value={el} onChange={(e) => handleFlavorChange(i, e)} />
                                                    <button onClick={(e) => removeFlavor(i, e)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                            <button className="bg-cOrange py-2 px-4 rounded-md font-bold text-sm self-start" onClick={e => addFlavor(e)}>ADD FLAVOR</button>
                                        </div>
                                    </div>
                                }
                                {appetizer.dressing &&
                                    <div className="relative flex flex-col">
                                        <div>
                                            <label className="font-bold text-sm" htmlFor="flavor">Dressing</label>
                                        </div>
                                        <div className="flex flex-col gap-y-2">
                                            {dressings.map((el, i) =>
                                                <div className="flex flex-row items-center gap-x-4" key={i}>
                                                    <input className="bg-white text-black rounded-md p-2 border-cOrange border-2 focus:outline-cBrown w-[200px]" placeholder="Dressing" name="dressing" value={el} onChange={(e) => handleDressingChange(i, e)} />
                                                    <button onClick={(e) => removeDressing(i, e)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                            <button className="bg-cOrange py-2 px-4 rounded-md font-bold text-sm self-start" onClick={e => addDressing(e)}>ADD DRESSING</button>
                                        </div>
                                    </div>
                                }
                                <div className="relative flex flex-col">
                                    <div>
                                        <label className="font-bold text-sm" htmlFor="image">Image</label>
                                    </div>
                                    <input className="bg-white text-black rounded-md p-2 border-cOrange border-2 focus:outline-cBrown w-full" placeholder="Image" {...register("image", { required: true })} />
                                    {errors.image &&
                                        <div className="text-xs font-bold uppercase">Can&apos;t be empty</div>
                                    }
                                </div>
                                <div className="relative flex flex-col">
                                    <div>
                                        <label className="font-bold text-sm" htmlFor="price">Price</label>
                                    </div>
                                    <input className="bg-white text-black rounded-md p-2 border-cOrange border-2 focus:outline-cBrown w-full" placeholder="Price" {...register("price", { required: true })} />
                                    {errors.price &&
                                        <div className="text-xs font-bold uppercase">Can&apos;t be empty</div>
                                    }
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

    return { props: { appetizer: JSON.parse(JSON.stringify(result)) } }
}

EditAppetizer.auth = { adminOnly: true };
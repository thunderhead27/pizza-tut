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

export default function EditSalad({ salad }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [isOpen, setIsOpen] = useState(false);
    const [confirmIsOpen, setConfirmIsOpen] = useState(false);
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            name: salad.name,
            description: salad.description,
            image: salad.image,
            price: salad.price,
        }
    })

    const submitChanges: SubmitHandler<FormValues> = async (data) => {
        console.log(data);

        const updatedSalad = {
            name: data.name,
            description: data.description,
            image: data.image,
            price: data.price,
        }

        await axios.put(`/api/admin/products/edit/${salad._id}`, updatedSalad)

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
                            <h1 className="font-bold text-4xl font-thunder py-6 lg:py-12">EDIT SALAD</h1>
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
                                <div className="relative flex flex-col">
                                    <div>
                                        <label className="font-bold text-sm" htmlFor="price">Price</label>
                                    </div>
                                    <input className="bg-white text-black rounded-md p-2 border-cOrange border-2 focus:outline-cBrown w-full" placeholder="Price" {...register("price", { required: true })} />
                                    {errors.price &&
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

    return { props: { salad: JSON.parse(JSON.stringify(result)) } }
}

EditSalad.auth = { adminOnly: true };
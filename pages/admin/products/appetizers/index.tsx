import Layout from "@/components/layout";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import styled from "styled-components";
import axios from 'axios';
import OutsideAlerter from "@/hooks/useOutsideAlerter";

interface OverlayProps {
    readonly isOpen: boolean;
}

const Overlay = styled.div<OverlayProps>`
${({ isOpen }) => (isOpen ? `background-color: rgba(0,0,0,0.5); filter: brightness(50%)` : ``)};
`;

interface ModalProps {
    readonly open: boolean;
}

const Modal = styled.div<ModalProps>`
    ${({ open }) => (open ? `visibility: visible;` : `visibility: hidden`)};
`

interface Props {
    visible: boolean;
}

const Edit = styled.div<Props>`
    display: block;
    transition: 350ms;

    ${({ visible }) => (visible ? `display: block` : `display: none`)};
`
const Create = styled.div<Props>`
    display: none;
    transition: 350ms;

    ${({ visible }) => (visible ? `display: block` : `display: none`)};
`

interface FormValues {
    name: string
    description: string
    image: string
    price: number
    points: number
    imageFile: File[]
}


export default function AdminAppetizers({ appetizers }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [confirmIsOpen, setConfirmIsOpen] = useState(false);
    const [deleteIsOpen, setDeleteIsOpen] = useState(false);
    const [deleteId, setDeleteId] = useState();

    const [active, setActive] = useState('edit');
    const [imageSrc, setImageSrc] = useState();
    const [uploadData, setUploadData] = useState();
    const [dressings, setDressings] = useState([]);
    const [flavors, setFlavors] = useState([]);
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

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

    const uploadHandler = (e) => {
        const reader = new FileReader();

        reader.onload = function (onLoadEvent) {
            //@ts-ignore
            setImageSrc(onLoadEvent.target.result);
            setUploadData(undefined);
        }

        reader.readAsDataURL(e.target.files[0]);
    }

    const submitHandler: SubmitHandler<FormValues> = async (data) => {
        const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;

        const {
            data: { signature, timestamp },
        } = await axios('/api/admin/cloudinary-sign');

        console.log(data);
        const file = data.imageFile[0];
        console.log(file);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('signature', signature);
        formData.append('timestamp', timestamp);
        formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);

        const resData = await axios.post(url, formData);

        const imageUrl = resData.data.url;

        const newAppetizer = {
            name: data.name,
            description: data.description,
            category: "appetizer",
            dressing: dressings,
            flavor: flavors,
            image: imageUrl,
            price: data.price,
            points: 1,
        }

        axios.post('/api/admin/products/create', newAppetizer);

        setConfirmIsOpen(true);
    }

    const handleDelete = async () => {
        await axios.delete(`/api/admin/products/delete/${deleteId}`);
        router.reload();
    }

    return (
        <div>
            <OutsideAlerter setFunction={setConfirmIsOpen}>
                <Modal open={confirmIsOpen} className="absolute z-20 flex flex-col items-center justify-between py-12 bg-white mx-auto my-auto left-0 right-0 bottom-0 top-0 w-[300px] h-[200px] rounded-md">
                    <div>
                        Product created.
                    </div>
                    <div className="flex flex-row gap-x-12">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => router.reload()}>Ok</button>
                    </div>
                </Modal>
            </OutsideAlerter>
            <OutsideAlerter setFunction={setDeleteIsOpen}>
                <Modal open={deleteIsOpen} className="absolute z-20 flex flex-col items-center justify-between py-12 bg-white mx-auto my-auto left-0 right-0 bottom-0 top-0 w-[300px] h-[200px] rounded-md">
                    <div>
                        Do you wish to delete this product?
                    </div>
                    <div className="flex flex-row gap-x-12">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleDelete}>Yes</button>
                        <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={() => { setDeleteIsOpen(false) }}>No</button>
                    </div>
                </Modal>
            </OutsideAlerter>
            <Overlay isOpen={confirmIsOpen || deleteIsOpen}>
                <Layout>
                    <div>
                        <Head>
                            <title>Pizza Tut - Appetizers</title>
                        </Head>
                        <div className="absolute flex flex-col gap-y-4 top-[200px] left-8 xl:text-2xl uppercase">
                            <button onClick={() => router.back()}>GO BACK</button>
                            <button onClick={() => setActive('edit')}>EDIT/DELETE</button>
                            <button onClick={() => setActive('create')}>CREATE</button>
                        </div>
                        <div className="flex flex-col items-center gap-y-4">
                            <h1 className="font-bold text-4xl font-thunder py-6 lg:py-12">APPETIZERS</h1>

                            <Edit visible={active === 'edit'}>
                                <table className="w-[350px] xl:w-[1200px] table-auto">
                                    <thead>
                                        <tr>
                                            <th className="px-4">Image</th>
                                            <th className="px-4">Name</th>
                                            <th className="px-4">Description</th>
                                            <th className="px-4">Price</th>
                                            <th className="px-4">Points</th>
                                            <th className="px-4">Dressing</th>
                                            <th className="px-4">Flavor</th>
                                            <th className="px-4">Edit</th>
                                            <th className="px-4">Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appetizers.map(el => (
                                            <tr key={el._id}>
                                                <td className="w-[50px]"><img src={el.image} alt={el.name} /></td>
                                                <td>{el.name}</td>
                                                <td>{el.description}</td>
                                                <td>${el.price}</td>
                                                <td>{el.points}</td>
                                                <td>{el.dressing.map((el, i) => <div key={i}>{el}</div>)}</td>
                                                <td>{el.flavor.map((el, i) => <div key={i}>{el}</div>)}</td>
                                                <td><button className="bg-cOrange py-2 px-4 rounded-md" onClick={() => router.push(`/admin/products/appetizers/${el._id}`)}>Edit</button></td>
                                                <td className="align-middle px-6"><button onClick={() => { setDeleteIsOpen(true); setDeleteId(el._id) }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>
                                                </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Edit>
                            <Create visible={active === 'create'}>
                                <h2 className="text-xl font-bold">CREATE NEW APPETIZER</h2>
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
                                    <div className="relative flex flex-col">
                                        <div>
                                            <label className="font-bold text-sm" htmlFor="imageFile">Image Upload</label>
                                        </div>
                                        <input className="bg-white text-black rounded-md p-2 border-cOrange border-2 focus:outline-cBrown w-full" type="file"  {...register("imageFile", { required: true })} onChange={uploadHandler} />
                                        {errors.imageFile &&
                                            <div className="text-xs font-bold uppercase">Please upload an image</div>
                                        }
                                    </div>
                                    {
                                        imageSrc &&
                                        <div>
                                            <img className="w-[200px]" src={imageSrc} alt="uploadedImage" />
                                        </div>
                                    }
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
                                    <button className="bg-cOrange py-2 px-4 rounded-md mt-8" onClick={handleSubmit(submitHandler)}>Submit</button>
                                </form>
                            </Create>
                        </div>
                    </div>
                </Layout>
            </Overlay>
        </div>
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

AdminAppetizers.auth = { adminOnly: true };
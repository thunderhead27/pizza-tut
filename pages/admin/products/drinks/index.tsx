import Layout from "@/components/layout";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
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
    imageFile: File[]
    price: number
}


export default function AdminDrinks({ drinks }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [confirmIsOpen, setConfirmIsOpen] = useState(false);
    const [deleteIsOpen, setDeleteIsOpen] = useState(false);
    const [deleteId, setDeleteId] = useState();

    const [active, setActive] = useState('edit')
    const [imageSrc, setImageSrc] = useState();
    const [uploadData, setUploadData] = useState();

    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    let price = [{ size: "Can", price: 0 }, { size: "20 Ounce", price: 0 }, { size: "2 Liter", price: 0 }]

    const priceArray = price.map((el) => el.price.toString());
    const [priceArr, setPriceArr] = useState(priceArray);

    const handlePriceChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
        let data = [...priceArr];
        data[i] = e.target.value;
        setPriceArr(data);
    }

    useEffect(() => {
        for (let i = 0; i < price.length; i++) {
            price[i].price = Number(priceArr[i]);
        }


    }, [priceArr, price])

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

        const newDrink = {
            name: data.name,
            category: "drink",
            image: imageUrl,
            price: price,
        }


        axios.post('/api/admin/products/create', newDrink);

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
                            <title>Pizza Tut - Drinks</title>
                        </Head>
                        <div className="absolute flex flex-col gap-y-4 top-[200px] left-8 xl:text-2xl uppercase">
                            <button onClick={() => router.back()}>GO BACK</button>
                            <button onClick={() => setActive('edit')}>EDIT/DELETE</button>
                            <button onClick={() => setActive('create')}>CREATE</button>
                        </div>
                        <div className="flex flex-col items-center gap-y-4">
                            <h1 className="font-bold text-4xl font-thunder py-6 lg:py-12">DRINKS</h1>

                            <Edit visible={active === 'edit'}>
                                <table className="w-[350px] xl:w-[1200px] table-auto">
                                    <thead>
                                        <tr>
                                            <th className="px-4">Image</th>
                                            <th className="px-4">Name</th>
                                            <th className="px-4">Price</th>
                                            <th className="px-4">Edit</th>
                                            <th className="px-4">Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {drinks.map(el => (
                                            <tr key={el._id}>
                                                <td className="w-[50px]"><img src={el.image} alt={el.name} /></td>
                                                <td className="text-center">{el.name}</td>
                                                <td className="text-center">{el.price.map((el2, i) => <div className="uppercase" key={i}>{el2.size}: ${el2.price}</div>)}</td>
                                                <td className="text-center"><button className="bg-cOrange py-2 px-4 rounded-md" onClick={() => router.push(`/admin/products/drinks/${el._id}`)}>Edit</button></td>
                                                <td className="pl-48">
                                                    <button onClick={() => { setDeleteIsOpen(true); setDeleteId(el._id) }}>
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
                                        {price.map((el, i) => (
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

    const drinks = products.filter(product => product.category === "drink")

    return { props: { drinks: JSON.parse(JSON.stringify(drinks)) } }
}

AdminDrinks.auth = { adminOnly: true };
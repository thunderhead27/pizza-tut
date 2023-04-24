import Map from "@/components/googleMap";
import Layout from "@/components/layout";
import OutsideAlerter from "@/hooks/useOutsideAlerter";
import dbConnect from "@/lib/dbConnect";
import Store from "@/models/Store";
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useState, useContext } from "react";
import styled from "styled-components";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Geocode from 'react-geocode'
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { CartContext } from "@/context/CartContext";


Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API!);
Geocode.setLanguage("en");



interface OverlayProps {
    readonly isOpen: boolean;
}

const Overlay = styled.div<OverlayProps>`
${({ isOpen }) => (isOpen ? `background-color: rgba(0,0,0,0.5); filter: brightness(50%)` : ``)};
`;

interface Props {
    readonly open: boolean;
}

const Address = styled.div<Props>`
display: flex;
flex-direction: column;
position: absolute;
color: black;
width: 500px;
height: 500px;
visibility: hidden;
transition: 350ms;
z-index: 10;

@media (max-width: 768px) and (min-width: 320px) {
    width: 300px;
}

${({ open }) => (open ? `visibility: visible` : `visibility: hidden`)};
`

interface FormValues {
    streetAddress: string
    city: string
    state: string
    zipCode: number
}

const metersToMiles = (distance: number) => {
    return (distance * 0.000621371).toFixed(2);
}

export default function Locations({ stores }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [addressOpen, setAddressOpen] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
    const router = useRouter();

    const { data: session } = useSession();

    const { state, dispatch } = useContext(CartContext)


    const getLatLng = (i: number) => {
        return {
            lat: stores[i].location.coordinates[1],
            lng: stores[i].location.coordinates[0],
        }
    }


    const onSubmit: SubmitHandler<FormValues> = (data) => {
        const query = data.streetAddress + ' ' + data.city + ' ' + data.state + ' ' + data.zipCode

        router.push(`/locations?query=${query}`);
        setAddressOpen(false)
    }

    const setStoreHandler = async (name: string, streetAddress: string, city: string, state: string, zipCode: string) => {
        const myStore = {
            name,
            streetAddress,
            city,
            state,
            zipCode
        }

        dispatch({ type: 'SET_MY_STORE', payload: myStore });


        try {
            await axios.put('/api/profile/myStore', {
                myStore
            })
        } catch (err) {
            console.log(err);
        }

        router.push('/shoppingCart')
    }


    return (
        <Layout>
            <div>
                <OutsideAlerter setFunction={setAddressOpen}>
                    <Address className="bg-cOrange hidden rounded-md mx-auto my-auto left-0 right-0 top-0 bottom-0 items-center pt-12 text-lg" open={addressOpen}>
                        <button className="absolute right-2 top-2" onClick={() => setAddressOpen(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h1 className="mb-4 font-bold text-xl">PLEASE ENTER ADDRESS</h1>

                        <form className="flex flex-col gap-y-2">
                            <div tw="relative flex flex-col">
                                <div>
                                    <label className="font-bold text-sm" htmlFor="streetAddress">STREET ADDRESS</label>
                                </div>
                                <input className="bg-white text-black rounded-sm p-2 focus:outline-none w-full" placeholder="Street Address" {...register("streetAddress", { required: true })} />
                                {errors.streetAddress &&
                                    <div className="text-xs absolute">Can&apos;t be empty</div>
                                }
                            </div>

                            <div tw="relative flex flex-col">
                                <div>
                                    <label className="font-bold text-sm" htmlFor="city">CITY</label>
                                </div>
                                <input className="bg-white text-black rounded-sm p-2 focus:outline-none w-full" placeholder="City" {...register("city", { required: true })} />
                                {errors.city && <div className="text-xs absolute">Can&apos;t be empty</div>
                                }
                            </div>

                            <div tw="relative flex flex-col">
                                <div>
                                    <label className="font-bold text-sm" htmlFor="state">STATE</label>
                                </div>
                                <input className="bg-white text-black rounded-sm p-2 focus:outline-none w-full" placeholder="State" {...register("state", { required: true })} />
                                {errors.state && <div className="text-xs absolute">Can&apos;t be empty</div>
                                }
                            </div>

                            <div tw="relative">
                                <div>
                                    <label className="font-bold text-sm" htmlFor="zipCode">ZIP CODE</label>
                                </div>
                                <input className="bg-white text-black rounded-sm p-2 focus:outline-none w-full" placeholder="Zip Code" {...register("zipCode", { required: true })} />
                                {errors.zipCode && <div className="text-xs absolute">Can&apos;t be empty</div>
                                }
                            </div>

                            <button className="bg-cBrown text-white font-bold py-2 rounded-md mt-4" onClick={handleSubmit(onSubmit)}>
                                SUBMIT
                            </button>

                        </form>
                    </Address>
                </OutsideAlerter>
                <Overlay className="w-screen" isOpen={addressOpen}>
                    <Head>
                        <title>Pizza Tut - Locations</title>
                    </Head>
                    <div className="flex flex-col items-center gap-y-4">
                        <h1 className="font-bold text-4xl font-thunder py-6 xl:py-12">LOCATIONS</h1>
                        <button className="mb-6 xl:mb-12 bg-cBrown text-white py-2 px-4 rounded-md font-bold" onClick={() => setAddressOpen(prev => !prev)}>FIND NEAREST STORE</button>
                        {stores.map((store: any, i: number) => (
                            <div className="flex flex-col gap-y-4 xl:flex-row xl:gap-x-12 xl:h-[300px] mb-12" key={store._id}>
                                <div className="flex flex-row gap-x-6">
                                    <div className="flex flex-col w-[200px] xl:w-[500px] font-bold uppercase">
                                        <h1 className="xl:text-2xl text-lg font-black">{store.name}</h1>
                                        <p className="xl:text-lg text-sm">{store.address.street}</p>
                                        <p className="xl:text-lg text-sm">{store.address.city}, {store.address.state} {store.address.zip}</p>
                                        {session?.user ? <button className="font-bold bg-cOrange rounded-md w-24 xl:h-16 text-sm mt-6" onClick={() => setStoreHandler(store.name, store.address.street, store.address.city, store.address.state, store.address.zip)}>SET AS MY STORE</button> : null}
                                    </div>
                                    {store.calcDistance ?
                                        <div className="font-bold uppercase">
                                            Distance: <span className="font-black">{metersToMiles(store.calcDistance)}</span> miles
                                        </div> : null}
                                </div>

                                <div className="h-[300px] w-[300px] xl:w-[600px]">
                                    <Map center={getLatLng(i)} />
                                </div>
                            </div>
                        ))}

                    </div>
                </Overlay>
            </div>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const { query } = ctx;

    await dbConnect()

    if (!query.query) {
        //@ts-ignore
        const result = await Store.find({})

        const stores = result.map((doc) => {
            const store = doc.toObject()
            store._id = store._id.toString()
            return store
        })


        return { props: { stores: JSON.parse(JSON.stringify(stores)) } }

    } else {
        let coordinates: [number, number] = [0, 0];

        //@ts-ignore
        await Geocode.fromAddress(query.query).then(
            (response) => {
                const { lat, lng } = response.results[0].geometry.location;

                coordinates = [lng, lat]
            },
            (error) => {
                console.error(error);
            }
        );


        const stores = await Store.aggregate([
            {
                $geoNear: {
                    near: { type: "Point", coordinates: coordinates },
                    spherical: true,
                    distanceField: "calcDistance"
                }
            }
        ])

        return { props: { stores: JSON.parse(JSON.stringify(stores)) } }

    }

}

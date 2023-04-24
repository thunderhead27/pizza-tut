import Layout from "@/components/layout";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useState } from 'react';
import axios from 'axios';
import styled from "styled-components";
import OutsideAlerter from "@/hooks/useOutsideAlerter";
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

export default function AdminUsers({ users }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [confirmIsOpen, setConfirmIsOpen] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const router = useRouter();

    const deleteUserHandler = (id: string) => {
        axios.delete(`/api/admin/userDelete/${id}`)
        router.reload();
    }

    return (
        <div>
            <OutsideAlerter setFunction={setConfirmIsOpen}>
                <Modal open={confirmIsOpen} className="absolute z-20 flex flex-col items-center justify-between py-12 bg-white mx-auto my-auto left-0 right-0 bottom-0 top-0 w-[300px] h-[200px] rounded-md">
                    <div>
                        Do you wish to delete this user?
                    </div>
                    <div className="flex flex-row gap-x-12">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => deleteUserHandler(deleteId)}>Yes</button>
                        <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={() => setConfirmIsOpen(false)}>No</button>
                    </div>
                </Modal>
            </OutsideAlerter>
            <Overlay isOpen={confirmIsOpen}>
                <Layout>
                    <div>
                        <Head>
                            <title>Pizza Tut - Users</title>
                        </Head>
                        <div className="flex flex-col items-center gap-y-4">
                            <h1 className="font-bold text-4xl font-thunder py-6 lg:py-12">USERS</h1>

                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Is Admin?</th>
                                        <th>Created At</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user._id}>
                                            <td className="px-4">{user.firstName} {user.lastName}</td>
                                            <td className="px-4">{user.email}</td>
                                            <td className="px-4">{user.isAdmin ? "Yes" : "No"}</td>
                                            <td className="px-4">{user.createdAt}</td>
                                            <td className="px-4">
                                                <button onClick={() => { setDeleteId(user._id); setConfirmIsOpen(true); }}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Layout>
            </Overlay>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {
    await dbConnect();

    //@ts-ignore
    const result = await User.find({}).sort({ id: 1 })

    const users = result.map((doc) => {
        const user = doc.toObject()
        user._id = user._id.toString()
        return user
    })


    return { props: { users: JSON.parse(JSON.stringify(users)) } }
}

AdminUsers.auth = { adminOnly: true };
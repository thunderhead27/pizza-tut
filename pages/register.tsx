import Layout from "@/components/layout";
import axios from "axios";
import { signIn, useSession } from 'next-auth/react';
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface FormValues {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
}

export default function SignIn() {
    const [error, setError] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();
    const { redirect } = router.query;

    useEffect(() => {
        if (session?.user) {

            //@ts-ignore
            router.push(redirect || '/profile');
        }
    }, [router, session, redirect])


    const { handleSubmit, register, getValues, formState: { errors }, } = useForm<FormValues>();

    const submitHandler = async ({ firstName, lastName, email, password }) => {
        try {
            await axios.post('/api/auth/signup', {
                firstName,
                lastName,
                email,
                password,
            })

            const result = await signIn('credentials', {
                redirect: false,
                firstName,
                lastName,
                email,
                password
            });
            if (result.error) {
                // console.log(result.error);
                setError(true);
                console.log(result.error);
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <Layout>
            <div className="flex flex-col items-center py-12">
                <h1 className="font-thunder text-4xl mb-12">SIGN UP</h1>
                <form className="flex flex-col gap-y-4 bg-cOrange w-[300px] xl:w-[600px] rounded-md py-8 px-6">
                    {error && <div className="text-lg font-bold">USER ALREADY EXISTS.</div>}
                    <div className="xl:text-2xl flex flex-row gap-x-6">
                        <div>
                            <label className="font-bold text-xl" htmlFor="firstName">FIRST NAME</label>
                            <input type="text" {...register('firstName', {
                                required: true
                            })} className="w-full focus:outline-none rounded-sm" id="firstName" autoFocus></input>
                            {errors.firstName &&
                                <div className="text-xs absolute font-bold">Can&apos;t be empty</div>
                            }
                        </div>
                        <div>
                            <label className="font-bold text-xl" htmlFor="lastName">LAST NAME</label>
                            <input type="text" {...register('lastName', {
                                required: true
                            })} className="w-full focus:outline-none rounded-sm" id="lastName" autoFocus></input>
                            {errors.lastName &&
                                <div className="text-xs absolute font-bold">Can&apos;t be empty</div>
                            }
                        </div>
                    </div>
                    <div className="xl:text-2xl">
                        <label className="font-bold text-xl" htmlFor="email">EMAIL</label>
                        <input type="email" {...register('email', {
                            required: true, pattern: {
                                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                                message: 'Please enter valid email',
                            }
                        })} className="w-full focus:outline-none rounded-sm" id="email" autoFocus></input>
                        {errors.email &&
                            <div className="text-xs absolute font-bold">Can&apos;t be empty</div>
                        }
                    </div>
                    <div className="xl:text-2xl">
                        <label className="font-bold text-xl" htmlFor="password">PASSWORD</label>
                        <input type="password" {...register('password', {
                            required: 'Please enter password',
                            minLength: { value: 6, message: 'Password is more than 5 characters' }
                        })} className="w-full focus:outline-none rounded-sm" id="password" autoFocus></input>
                        {errors.password &&
                            <div className="text-xs absolute font-bold">{errors.password.message}</div>
                        }
                    </div>
                    <div className="xl:text-2xl">
                        <label className="font-bold text-xl" htmlFor="confirmPassword">CONFIRM PASSWORD</label>
                        <input type="password" {...register('confirmPassword', {
                            required: 'Please enter password',
                            validate: (value) => value === getValues('password'),
                            minLength: { value: 6, message: 'Password is more than 5 characters' }
                        })} className="w-full focus:outline-none rounded-sm" id="confirmPassword" autoFocus></input>
                        {errors.confirmPassword &&
                            <div className="text-xs absolute font-bold">{errors.confirmPassword.message}</div>
                        }
                        {errors.confirmPassword && errors.confirmPassword.type === 'validate' &&
                            <div className="text-xs absolute font-bold">PASSWORDS DO NOT MATCH</div>
                        }
                    </div>
                    <div>
                        <button className="bg-cBrown text-white font-bold p-2 rounded-md" onClick={handleSubmit(submitHandler)}>REGISTER</button>
                    </div>
                </form>
            </div>
        </Layout>
    )
}
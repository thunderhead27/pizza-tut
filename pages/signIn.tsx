import Layout from "@/components/layout";
import { signIn, useSession } from 'next-auth/react';
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface FormValues {
    email: string
    password: string
}


export default function SignIn() {
    const [error, setError] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();
    const { redirect } = router.query;

    const { handleSubmit, register, formState: { errors }, } = useForm<FormValues>();

    const submitHandler = async ({ email, password }) => {
        try {

            const result = await signIn('credentials', {
                redirect: false,
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
            throw new Error('Invalid email or password');
        }
    }


    useEffect(() => {
        if (session?.user) {
            //@ts-ignore
            router.push(redirect || '/profile');
        }
    }, [router, session, redirect])

    return (
        <Layout>
            <div className="flex flex-col items-center py-12">
                <h1 className="font-thunder text-4xl mb-12">SIGN IN</h1>
                <form className="flex flex-col gap-y-4 bg-cOrange w-[300px] xl:w-[600px] rounded-md py-8 px-6">
                    {error && <div className="text-lg font-bold">INVALID EMAIL OR PASSWORD.  PLEASE TRY AGAIN.</div>}
                    <div className="xl:text-2xl">
                        <label className="font-bold text-xl" htmlFor="email">EMAIL</label>
                        <input type="email" {...register('email', {
                            required: "PLEASE ENTER EMAIL", pattern: {
                                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                                message: 'Please enter valid email',
                            }
                        })} className="w-full focus:outline-none rounded-sm" id="email" autoFocus></input>
                        {errors.email &&
                            <div className="text-xs absolute font-bold">{errors.email.message}</div>
                        }
                    </div>
                    <div className="xl:text-2xl">
                        <label className="font-bold text-xl" htmlFor="password">PASSWORD</label>
                        <input type="password" {...register('password', {
                            required: 'PLEASE ENTER PASSWORD',
                            minLength: { value: 6, message: 'Password is more than 5 characters' }
                        })} className="w-full focus:outline-none rounded-sm" id="password" autoFocus></input>
                        {errors.password &&
                            <div className="text-xs absolute font-bold">{errors.password.message}</div>
                        }
                    </div>
                    <div>
                        <button className="bg-cBrown text-white font-bold p-2 rounded-md" onClick={handleSubmit(submitHandler)}>LOGIN</button>
                    </div>
                    <div className="flex flex-row uppercase">
                        <p className="">Don&apos;t have an account? &nbsp;</p>
                        <Link className="underline font-bold" href="/register">Register</Link>
                    </div>
                </form>
            </div>
        </Layout>
    )
}
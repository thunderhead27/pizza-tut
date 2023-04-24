import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import bcryptjs from 'bcryptjs'


export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user?._id) token._id = user._id;
            if (user?.isAdmin !== undefined) token.isAdmin = user.isAdmin;
            if (user?.firstName) token.firstName = user.firstName;

            return Promise.resolve(token);
        },
        async session({ session, token }) {
            if (token?._id) session.user._id = token._id;
            if (token?.isAdmin !== undefined) session.user.isAdmin = token.isAdmin;
            if (token?.firstName) session.user.firstName = token.firstName;

            return Promise.resolve(session);
        }
    },
    secret: process.env.AUTH_SECRET,

    providers: [
        CredentialsProvider({
            credentials: {
                email: { label: "email", type: "text" },
                password: { label: "password", type: "password" },
            },

            async authorize(credentials: Record<string, string> | undefined) {
                if (credentials == undefined) {
                    throw new Error('Credentials not defined.');
                }

                await dbConnect();

                //@ts-ignore
                const user = await User.findOne({
                    email: credentials.email
                });

                console.log(user);

                if (user && bcryptjs.compareSync(credentials.password, user.password)) {
                    const returnedUser = {
                        _id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        isAdmin: user.isAdmin
                    } as any

                    return Promise.resolve(returnedUser)
                }
                throw new Error('Invalid email or password');
            }
        })
    ]
}

export default NextAuth(authOptions);
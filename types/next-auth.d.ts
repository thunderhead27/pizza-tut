import { Session } from "next-auth"
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */

    interface Session {
        user: {
            _id: string;
            firstName: string;
            lastName: string;
            email: string;
            isAdmin: boolean;
        }
    }

    interface User {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        isAdmin: boolean;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        isAdmin: boolean;
    }
}
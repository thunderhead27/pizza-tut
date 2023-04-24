import Layout from "@/components/layout";
import { useRouter } from "next/router";


export default function Unauthorized() {
    const router = useRouter();
    const { message } = router.query;

    return (
        <Layout>
            <div className="uppercase">
                <h1 className="text-xl">Access Denied</h1>
                {message && <div className="text-red-500">{message}</div>}
            </div>
        </Layout>
    )
}
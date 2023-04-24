import Layout from "@/components/layout"
import Head from "next/head";
import Link from "next/link";

export default function AdminProducts() {

    return (
        <Layout>
            <div>
                <Head>
                    <title>Pizza Tut - Menu</title>
                </Head>
                <div className="flex flex-col items-center gap-y-4">
                    <h1 className="font-bold text-4xl font-thunder py-6 xl:py-12">MENU</h1>
                </div>
                <div className="flex flex-col items-center font-thunder">
                    <div className="flex flex-col md:flex-row gap-x-4 gap-y-4 pt-8">
                        <Link href="/admin/products/pizzas">
                            <div className="bg-[url('/images/pizzas/cheesePizza.png')] w-[200px] h-[130px] lg:w-[393px] lg:h-[247px] bg-cover drop-shadow-md relative top-16 left-12 lg:top-32 md:left-[-4px] lg:left-[-14px]"></div>
                            <div className="flex flex-col items-center text-2xl font-bold bg-gradient-to-b from-dOrange to-cOrange w-[300px] h-[200px] md:w-[200px] lg:w-[357px] lg:h-[250px] rounded-md pt-24 lg:pt-36">PIZZAS</div>
                        </Link>
                        <Link href="/admin/products/appetizers">
                            <div className="bg-[url('/images/appetizers/12-wing.png')] w-[200px] h-[130px] lg:w-[393px] lg:h-[247px] bg-cover drop-shadow-md relative top-16 left-12 lg:top-32 md:left-[-4px] lg:left-[-14px]"></div>
                            <div className="flex flex-col items-center text-2xl font-bold bg-gradient-to-b from-dOrange to-cOrange w-[300px] h-[200px] md:w-[200px] lg:w-[357px] lg:h-[250px] rounded-md pt-24 lg:pt-36">APPETIZERS</div>
                        </Link>
                        <Link href="/admin/products/salads">
                            <div className="bg-[url('/images/salads/caesar.png')] w-[200px] h-[130px] lg:w-[393px] lg:h-[247px] bg-cover drop-shadow-md relative top-16 left-12 lg:top-32 md:left-[-4px] lg:left-[-14px]"></div>
                            <div className="flex flex-col items-center text-2xl font-bold bg-gradient-to-b from-dOrange to-cOrange w-[300px] h-[200px] md:w-[200px] lg:w-[357px] lg:h-[250px] rounded-md pt-24 lg:pt-36">SALADS</div>
                        </Link>
                    </div>
                    <div className="pt-8 lg:relative left-[-18px]">
                        <Link href="/admin/products/drinks">
                            <div className="bg-[url('/images/drinks/pepsiCan.png')] w-[200px] h-[130px] lg:w-[230px] lg:h-[150px] bg-cover drop-shadow-md relative top-16 left-12 lg:top-24 md:left-[-4px] lg:left-14"></div>
                            <div className="flex flex-col items-center text-2xl font-bold bg-gradient-to-b from-dOrange to-cOrange w-[300px] h-[200px] md:w-[200px] lg:w-[357px] lg:h-[250px] rounded-md pt-24 lg:pt-36">DRINKS</div>
                        </Link>
                    </div>
                </div>
            </div >
        </Layout>
    )
}

AdminProducts.auth = { adminOnly: true };
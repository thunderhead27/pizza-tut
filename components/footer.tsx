import Image from "next/image"
import React from 'react'


const Footer = () => {
    return (
        <footer className="mx-auto left-0 right-0 py-4 border-t border-gray-200 mt-12">
            <div className="flex flex-row justify-center gap-x-8">
                <Image src="/images/creativeCommons.svg" width={84} height={20} alt="cc" />
                <p className="text-xs md:text-sm">Pizza Tut 2023</p>
                <p className="text-xs md:text-sm">Designed by <span className="font-bold">Golden Ratio</span></p>
            </div>
        </footer>
    )
}

export default Footer
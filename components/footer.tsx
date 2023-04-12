import Image from "next/image"
import React from 'react'


const Footer = () => {
    return (
        <div className="items-center mx-auto left-0 right-0 py-4 md:absolute md:bottom-2">
            <div className="flex flex-row justify-center gap-x-8">
                <Image src="/images/creativeCommons.svg" width={84} height={20} alt="cc" />
                <span className="text-sm">Pizza Tut 2023</span>
            </div>
        </div>
    )
}

export default Footer
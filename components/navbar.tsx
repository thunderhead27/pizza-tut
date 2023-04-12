import OutsideAlerter from "@/hooks/useOutsideAlerter"
import Image from "next/image"
import Link from "next/link"
import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import Hamburger from 'hamburger-react'
import { OpenContext } from "@/pages/_app"


interface SlideMenuProps {
    readonly menuOpen: boolean;
}


const SlideMenu = styled.div<SlideMenuProps>`
display: flex;
flex-direction: column;
background-color: #F27C38;
color: black;
width: 150px;
height: 100%;
padding-left: 12px;
padding-top: 12px;
left: -150px;
gap: 20px;
position: absolute;
transition: 350ms;
z-index: 10;

    
${({ menuOpen }) => (menuOpen ? `left: 0` : `left: -150px`)};
`

const Navbar = () => {
    const { isOpen, setOpen } = useContext(OpenContext)

    return (
        <>
            {/* Mobile Navbar  */}
            <nav className="flex flex-row justify-center md:hidden h-[120px] w-full text-black bg-cOrange">
                <div className="flex flex-row justify-between font-bold text-sm w-[375px] items-center">
                    <Hamburger toggled={isOpen} toggle={setOpen} />
                    <div className="flex flex-col items-center">
                        <Image src="/images/logo.svg" width={55} height={75} alt="logo" />
                        <h1 className="font-thunder text-sm">PIZZA TUT</h1>
                    </div>
                    <Link href="/shoppingCart">
                        <div className="flex flex-row">
                            <Image src="/images/cart.svg" width={32} height={32} alt="cart" />
                            <div className="relative right-3 bottom-2 h-5 w-5 rounded-full border-cBlack border-2 bg-cBrown"></div>
                        </div>
                    </Link>
                </div>
            </nav>

            <OutsideAlerter setFunction={setOpen}>
                <SlideMenu className="hidden" menuOpen={isOpen}>
                    <Link href="/menu">MENU</Link>
                    <Link href="/locations">LOCATIONS</Link>
                    <Link href="/signIn">
                        <div className="flex flex-col">
                            <div className="flex flex-row items-center">
                                <div>SIGN IN</div>
                                <Image src="/images/signIn.svg" alt="cart" width={40} height={40} />
                            </div>
                            <div className="relative bottom-2 text-xs">FOR REWARDS</div>
                        </div>
                    </Link>
                </SlideMenu>
            </OutsideAlerter>
            {/* End of mobile navbar */}

            <nav className="md:flex flex-row justify-center hidden h-[120px] w-full text-black bg-cOrange">
                <div className="flex flex-row justify-between font-bold md:text-xl lg:w-[1024px] md:w-[700px] items-center">
                    <Link href="/menu">MENU</Link>
                    <Link href="/locations">LOCATIONS</Link>
                    <div className="flex flex-col items-center">
                        <Image src="/images/logo.svg" width={55} height={75} alt="logo" />
                        <h1 className="font-thunder text-2xl">PIZZA TUT</h1>
                    </div>
                    <Link href="/signIn">
                        <div className="flex flex-col">
                            <div className="relative top-2 flex flex-row items-center">
                                <div>SIGN IN</div>
                                <Image src="/images/signIn.svg" alt="cart" width={40} height={40} />
                            </div>
                            <div className="text-sm">FOR REWARDS</div>
                        </div>
                    </Link>
                    <Link href="/shoppingCart">
                        <div className="flex flex-row">
                            <Image src="/images/cart.svg" width={32} height={32} alt="cart" />
                            <div className="relative right-3 bottom-2 h-5 w-5 rounded-full border-cBlack border-2 bg-cBrown"></div>
                        </div>
                    </Link>
                </div>
            </nav>
        </>

    )
}

export default Navbar
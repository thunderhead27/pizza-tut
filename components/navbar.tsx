import OutsideAlerter from "@/hooks/useOutsideAlerter"
import Image from "next/image"
import Link from "next/link"
import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import Hamburger from 'hamburger-react'
import { OpenContext } from "@/pages/_app"
import { CartContext } from "@/context/CartContext"
import { useSession } from 'next-auth/react'


interface SlideMenuProps {
    readonly menuOpen: boolean;
}


const SlideMenu = styled.div<SlideMenuProps>`
display: flex;
flex-direction: column;
background-color: #F27C38;
color: black;
font-weight: 700;
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
    const { state, dispatch } = useContext(CartContext)
    const { status, data: session } = useSession();


    return (
        <div>
            {/* Mobile Navbar  */}
            <nav className="flex flex-row justify-center md:hidden h-[120px] w-full text-black bg-gradient-to-b from-dOrange to-cOrange">
                <div className="flex flex-row justify-between font-bold text-sm w-[375px] items-center">
                    <Hamburger toggled={isOpen} toggle={setOpen} />
                    <div className="flex flex-col items-center">
                        <Image src="/images/logo.svg" width={55} height={75} alt="logo" />
                        <h1 className="font-thunder text-sm">PIZZA TUT</h1>
                    </div>
                    <Link href="/shoppingCart">
                        <div className="flex flex-row">
                            <Image src="/images/cart.svg" width={32} height={32} alt="cart" />
                            <div className="relative right-3 bottom-2 h-5 w-5 rounded-full border-cBlack border-2 bg-cBrown text-white text-center">
                                {state?.cart?.cartItems?.length ? state.cart.cartItems.length : null}
                            </div>
                        </div>
                    </Link>
                </div>
            </nav>

            <OutsideAlerter setFunction={setOpen}>
                <SlideMenu className="hidden" menuOpen={isOpen}>
                    <Link href="/menu" onClick={() => setOpen(prev => !prev)}>MENU</Link>
                    <Link href="/locations" onClick={() => setOpen(prev => !prev)}>LOCATIONS</Link>
                    {session?.user ?

                        <Link href="/profile" onClick={() => setOpen(prev => !prev)}>
                            <div className="flex flex-col">
                                <div className="relative top-2 flex flex-row items-center">
                                    <div>HELLO</div>
                                </div>
                                <div className="font-black uppercase">{session.user.firstName}</div>
                            </div>
                        </Link>
                        :
                        <Link href="/signIn" onClick={() => setOpen(prev => !prev)}>
                            <div className="flex flex-col">
                                <div className="flex flex-row items-center">
                                    <div>SIGN IN</div>
                                    <Image src="/images/signIn.svg" alt="cart" width={40} height={40} />
                                </div>
                                <div className="relative bottom-2 text-xs">FOR REWARDS</div>
                            </div>
                        </Link>

                    }
                </SlideMenu>
            </OutsideAlerter>
            {/* End of mobile navbar */}

            <nav className="md:flex flex-row justify-center hidden h-[120px] w-full text-black bg-gradient-to-b from-dOrange to-cOrange">
                <div className="flex flex-row justify-between font-bold md:text-xl lg:w-[1024px] md:w-[700px] items-center ">
                    <Link className="hover:border-b-cBlack hover:border-b-4" href="/menu">MENU</Link>
                    <Link className="hover:border-b-cBlack hover:border-b-4" href="/locations">LOCATIONS</Link>
                    <Link href="/">
                        <div className="flex flex-col items-center">
                            <Image src="/images/logo.svg" width={55} height={75} alt="logo" />
                            <h1 className="font-thunder text-2xl">PIZZA TUT</h1>
                        </div>
                    </Link>
                    {session?.user ?
                        <Link className="hover:border-b-cBlack hover:border-b-4" href="/profile">
                            <div className="flex flex-col">
                                <div className="relative top-2 flex flex-row items-center">
                                    <div>HELLO</div>
                                </div>
                                <div className="font-black uppercase">{session.user.firstName}</div>
                            </div>
                        </Link> :
                        <Link className="hover:border-b-cBlack hover:border-b-4" href="/signIn">
                            <div className="flex flex-col">
                                <div className="relative top-2 flex flex-row items-center">
                                    <div>SIGN IN</div>
                                    <Image src="/images/signIn.svg" alt="cart" width={40} height={40} />
                                </div>
                                <div className="text-sm">FOR REWARDS</div>
                            </div>
                        </Link>
                    }

                    <Link href="/shoppingCart">
                        <div className="flex flex-row">
                            <Image src="/images/cart.svg" width={32} height={32} alt="cart" />
                            <div className="flex flex-col items-center place-content-center relative right-3 bottom-2 h-6 w-6 rounded-full border-cBlack border-2 bg-cBrown text-white text-xs font-black">
                                {state?.cart?.cartItems?.length ? state.cart.cartItems.length : null}
                            </div>
                        </div>
                    </Link>
                </div>
            </nav>
        </div>

    )
}

export default Navbar
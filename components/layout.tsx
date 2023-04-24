import React, { useContext } from 'react'
import Navbar from "./navbar"
import Footer from "./footer";
import { OpenContext } from "@/pages/_app";
import styled from "styled-components";
import dynamic from 'next/dynamic';

const Nav = dynamic(() => import("../components/navbar"), { ssr: false });

interface OverlayProps {
    readonly isOpen: boolean;
}

const Overlay = styled.div<OverlayProps>`
${({ isOpen }) => (isOpen ? `background-color: rgba(0,0,0,0.5); filter: brightness(50%)` : ``)};
`;

interface Props {
    children: JSX.Element,
}

const Layout = ({ children }: Props) => {
    const { isOpen, setOpen } = useContext(OpenContext)

    return (
        <div className="flex flex-col h-screen justify-between overflow-x-hidden">
            <Nav />
            <Overlay isOpen={isOpen} className="mb-auto">
                <div className="flex flex-col items-center px-12 xl:px-[165px]">{children}</div>
            </Overlay>
            <Footer />
        </div>
    )
}

export default Layout
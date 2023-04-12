import React from 'react'
import Navbar from "./navbar"
import Footer from "./footer";

interface Props {
    children: JSX.Element,
}

const Layout = ({ children }: Props) => {
    return (
        <div className="flex flex-col">
            <Navbar />
            {children}
            <Footer />
        </div>
    )
}

export default Layout
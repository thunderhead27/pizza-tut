import Layout from "@/components/layout"
import Image from 'next/image'
import Link from "next/link";
import { useContext } from "react";
import styled from "styled-components";
import { OpenContext } from "./_app";

interface OverlayProps {
  overlayOn: boolean;
}

const OverlayContainer = styled.div<OverlayProps>`
position: relative;
width: 100%;
${({ overlayOn }) => (overlayOn ? `background-color: rgba(0,0,0,0.5); filter: brightness(50%)` : ``)};
`;


export default function Home() {
  const { isOpen } = useContext(OpenContext)

  return (
    <Layout>
      <OverlayContainer overlayOn={isOpen}>
        <div className="flex flex-col items-center">
          <div className="flex flex-row items-center justify-center bg-cBrown text-white h-16 w-[320px] md:hidden rounded-md font-bold mt-4">ORDER ONLINE</div>

          {/* Top Mobile Hero */}
          <div className="xl:hidden flex flex-col-reverse md:flex-row pt-8 gap-4">
            <div className="flex flex-col items-center justify-center w-[357px] h-[380px] bg-gradient-to-b from-dOrange to-cOrange rounded-md">
              <p className="w-[310px] h-[180px] font-bold text-2xl text-center">BUILD YOUR OWN EXTRA-LARGE
                PIZZA WITH <span className="font-black text-3xl">UNLIMITED</span> TOPPINGS FOR ONLY <span className="font-black text-3xl">$22.99!</span>
              </p>
              <button className="w-[188px] h-18 py-4 rounded-md bg-cBrown text-white drop-shadow-xl">
                <Link href="/pizzaBuilder">
                  <p className="font-black text-xl">CLICK HERE</p>
                  <p className="font-medium text-xs">FOR THE PIZZA BUILDER</p>
                </Link>
              </button>
            </div>
            <div className="w-[351px] h-[217px] md:w-[350px] lg:w-[608px] md:h-[380px] bg-[url('/images/supremePizza.png')] bg-cover rounded-md"></div>
          </div>

          {/* Top Desktop Hero */}
          <div className="hidden xl:block mt-16 h-[500px] w-[980px] bg-[url('/images/supremePizza.png')] bg-cover bg-center rounded-md">
            <div className="flex flex-col gap-y-8 px-16 text-xl items-center place-content-center text-center w-[356px] h-full bg-cBlack bg-opacity-80 rounded-l-md text-white">
              <p className="font-bold">
                BUILD YOUR OWN EXTRA-LARGE
                PIZZA WITH <span className="font-black text-3xl">UNLIMITED</span> TOPPINGS FOR ONLY <span className="font-black text-3xl">$22.99!</span>
              </p>
              <button className="w-[188px] h-18 py-4 rounded-md bg-dOrange text-cBlack drop-shadow-xl">
                <Link href="/pizzaBuilder">
                  <p className="font-black text-xl">CLICK HERE</p>
                  <p className="font-bold text-xs">FOR THE PIZZA BUILDER</p>
                </Link>
              </button>
            </div>
          </div>

          {/* Bottom Hero */}
          <div className="flex flex-col md:flex-row pt-8 gap-4">
            <div className="h-[300px] md:w-[350px] lg:w-[608px] lg:h-[500px] bg-[url('/images/secondPizza.png')] bg-cover rounded-md"></div>
            <div className="flex flex-col items-center justify-center w-[356px] h-[300px] lg:h-[500px] bg-gradient-to-b from-dOrange to-cOrange rounded-md">
              <div className="text-center font-bold pb-4">
                <h1 className="text-4xl">ORDER ONLINE</h1>
                <h2 className="text-2xl">DELIVERY OR CARRYOUT</h2>
              </div>
              <button className="w-[188px] h-18 py-4 rounded-md bg-cBrown text-white drop-shadow-xl">
                <Link href="/menu">
                  <p className="font-black text-xl">SEE MENU</p>
                </Link>
              </button>
            </div>

          </div>
        </div>


      </OverlayContainer>
    </Layout >
  )
}

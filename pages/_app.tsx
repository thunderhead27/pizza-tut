import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import localFont from 'next/font/local'
import { useState, createContext, useMemo } from 'react';


const metropolis = localFont({
  src: [
    {
      path: '../public/fonts/Metropolis-Black.otf',
      weight: '800',
      style: 'normal'
    },
    {
      path: '../public/fonts/Metropolis-Bold.otf',
      weight: '700',
      style: 'normal'
    },
    {
      path: '../public/fonts/Metropolis-Medium.otf',
      weight: '500',
      style: 'normal'
    },
    {
      path: '../public/fonts/Metropolis-Regular.otf',
      weight: '400',
      style: 'normal'
    },
  ],
  variable: '--font-metropolis'
})

const thunder = localFont({
  src: [
    {
      path: '../public/fonts/A Love of Thunder.ttf',
      weight: '700',
      style: 'normal'
    },
  ],
  variable: '--font-thunder'
})

interface OpenContextType {
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const iOpenContextState = {
  isOpen: false,
  setOpen: () => { }
}

export const OpenContext = createContext<OpenContextType>(iOpenContextState);

export default function App({ Component, pageProps }: AppProps) {

  const [isOpen, setOpen] = useState(false);

  return <OpenContext.Provider value={{ isOpen, setOpen }}>
    <main className={`${metropolis.variable} ${thunder.variable} font-sans`}>
      <Component {...pageProps} />
    </main>
  </OpenContext.Provider>
}

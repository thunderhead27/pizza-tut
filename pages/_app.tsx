import { CartProvider } from "@/context/CartContext";
import { SessionProvider, useSession } from 'next-auth/react';
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import localFont from 'next/font/local'
import { useState, createContext, useMemo } from 'react';
import { useRouter } from "next/router";
import type { NextComponentType } from 'next'

type CustomAppProps = AppProps & {
  Component: NextComponentType & { auth?: boolean } // add auth type
}


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

export default function App({ Component, pageProps: { session, ...pageProps } }: CustomAppProps) {

  const [isOpen, setOpen] = useState(false);

  return (
    <SessionProvider session={session}>
      <CartProvider>
        <OpenContext.Provider value={{ isOpen, setOpen }}>
          <main className={`${metropolis.variable} ${thunder.variable} font-sans`}>
            {Component.auth ? (
              // @ts-ignore
              <Auth adminOnly={Component.auth.adminOnly}>
                <Component {...pageProps} />
              </Auth>
            ) : (
              <Component {...pageProps} />
            )}
          </main>
        </OpenContext.Provider>
      </CartProvider>
    </SessionProvider>
  )
}

function Auth({ children, adminOnly }) {
  const router = useRouter();
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/unauthorized?message=login required');
    },
  });
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (adminOnly && !session.user.isAdmin) {
    router.push('/unauthorized?message=Admin login required');
  }

  return children;
}
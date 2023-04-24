import React, { createContext, useReducer, useEffect } from 'react';
import cartReducer, { ACTIONTYPE } from "./CartReducer";
import { Cart } from "@/types/Cart";
import { getFromStorage } from "@/util/localstorage";


export interface AppState {
    cart: Cart,
}



const initialState: AppState = {
    cart: getFromStorage("cart") ? JSON.parse(getFromStorage("cart")) : {
        cartItems: getFromStorage("cartItems") ? JSON.parse(getFromStorage("cartItems")) : [],
        deliveryAddress: {
            streetAddress: "",
            city: "",
            state: "",
            zipCode: ""
        },
        method: "delivery",
        paymentMethod: "credit",
        itemsPrice: 0,
        deliveryPrice: 0,
        taxPrice: 0,
        totalPrice: 0,
        myStore: {
            name: "",
            streetAddress: "",
            city: "",
            state: "",
            zipCode: ""
        }
    }
}

const defaultDispatch: React.Dispatch<ACTIONTYPE> = () => initialState

const iCartContextState = {
    state: initialState,
    dispatch: defaultDispatch
}

export const CartContext = createContext(iCartContextState);

interface Props {
    children: JSX.Element
}

export function CartProvider({ children }: Props) {
    const [state, dispatch] = useReducer<React.Reducer<AppState, ACTIONTYPE>>(cartReducer, initialState);

    return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>
}
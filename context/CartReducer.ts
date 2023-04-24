import { CartItem } from "@/types/Cart";
import { AppState } from "./CartContext";
import { clearStorage, saveToStorage } from "@/util/localstorage";

export type ACTIONTYPE =
    | { type: 'CART_ADD_ITEM'; payload: CartItem }
    | {
        type: 'CART_CHANGE_QUANTITY'; payload: {
            totalQuantity: number,
            cartId: string,
        }
    }
    | {
        type: 'SET_MY_STORE'; payload: {
            name: string,
            streetAddress: string,
            city: string,
            state: string,
            zipCode: string
        }
    }
    | { type: 'DELETE_FROM_CART'; payload: string }
    | {
        type: 'SET_METHOD'; payload: {
            method: string,
            deliveryPrice: number
        }
    }
    | { type: 'SET_PAYMENT_METHOD'; payload: string }
    | {
        type: 'SET_DELIVERY_ADDRESS'; payload: {
            streetAddress: string,
            city: string,
            state: string,
            zipCode: string
        }
    }
    | {
        type: 'SET_PRICE'; payload: {
            itemsPrice: number,
            taxPrice: number,
            totalPrice: number
        }
    }
    | { type: 'CART_RESET'; payload: object }

export default function cartReducer(state: AppState, action: ACTIONTYPE): AppState {
    switch (action.type) {
        case 'CART_ADD_ITEM': {
            const item = action.payload;
            const cartItems = [...state.cart.cartItems, item];

            return { ...state, cart: { ...state.cart, cartItems } };
        }

        case 'CART_CHANGE_QUANTITY': {
            const { cartId } = action.payload;

            state.cart.cartItems.find(item => item.cartId === cartId).totalQuantity = action.payload.totalQuantity

            saveToStorage("cartItems", JSON.stringify(state.cart.cartItems))

            return { ...state }

        }

        case 'DELETE_FROM_CART': {
            console.log(action.payload);
            const cartItems = state.cart.cartItems.filter(item => item.cartId !== action.payload);
            saveToStorage("cartItems", JSON.stringify(cartItems))

            return { ...state, cart: { ...state.cart, cartItems } };
        }

        case 'SET_METHOD': {
            state.cart.method = action.payload.method;
            state.cart.deliveryPrice = action.payload.deliveryPrice;
            saveToStorage("cart", JSON.stringify(state.cart))

            return { ...state }
        }

        case 'SET_PAYMENT_METHOD': {
            state.cart.paymentMethod = action.payload;
            saveToStorage("cart", JSON.stringify(state.cart))

            return { ...state }

        }

        case 'SET_MY_STORE': {
            state.cart.myStore = action.payload;
            saveToStorage("cart", JSON.stringify(state.cart))

            return { ...state }
        }

        case 'SET_DELIVERY_ADDRESS': {
            console.log(state.cart.deliveryAddress)
            state.cart.deliveryAddress = action.payload;
            state.cart.deliveryPrice = 4.50;
            saveToStorage("cart", JSON.stringify(state.cart))

            return { ...state }
        }

        case 'SET_PRICE': {
            state.cart.itemsPrice = action.payload.itemsPrice;
            state.cart.taxPrice = action.payload.taxPrice;
            state.cart.totalPrice = action.payload.totalPrice;

            console.log(state.cart)
            saveToStorage("cart", JSON.stringify(state.cart))
            return { ...state }
        }

        case 'CART_RESET': {
            clearStorage();
            return {
                ...state, cart: {
                    cartItems: [],
                    deliveryAddress: {
                        streetAddress: "",
                        city: "",
                        state: "",
                        zipCode: "",
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
        }
    }
}
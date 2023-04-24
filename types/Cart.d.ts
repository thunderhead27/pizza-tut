export interface CartItem {
    cartId: string
    image: string | undefined
    totalQuantity: number
    priceEach: number
    id: number
    name: string
    points?: number
    flavor?: string
    dressing?: string
    pizzaSize?: string
    toppings?: string[]
}

export interface Address {
    streetAddress: string
    city: string
    state: string
    zipCode: string
}

export interface Cart {
    cartItems: CartItem[]
    method: string
    deliveryAddress: Address
    myStore: {
        name: string
        streetAddress: string
        city: string
        state: string
        zipCode: string
    }
    paymentMethod: string
    itemsPrice: number
    deliveryPrice?: number
    taxPrice: number
    totalPrice: number
}


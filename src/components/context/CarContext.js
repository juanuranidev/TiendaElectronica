import { createContext } from 'react'
import { useState, useContext, useEffect } from 'react'

const CartContext = createContext([])

export function useCartContext() {
    return useContext(CartContext)
}

export const CartContextProvider = ({children}) => {
    const [cartList, setCartList] = useState([])

    function addToCart(item) {
        const isInCart = cartList.find((product => product.id === item.id))
        if(isInCart){
            // Reconocer el array del cart en busca del item para aumentarle la cantidad
            const oldCart = cartList.map(element => {
                // Si el id del elemento del array es igual al id del elemento que quiero agregar al carro
                if (element.id === item.id) {
                    return { ...item, quantity: item.quantity + element.quantity }
                }
                // Re armar el array del carro
                return element
            })
            setCartList(oldCart)
        } else {
            // Si no estaba se agrega al array del carrito
            setCartList([...cartList, item])
        }
    }

    function removeItem(e) {
        const product = cartList.find((product => product.id === e.target.id))

        product.quantity === 1
        ? setCartList(cartList.filter((x) => x.id !== product.id))
        : setCartList(cartList.map((x) => x.id === product.id ? { ...product, quantity: product.quantity - 1 }: x))
    }

    function emptyCart() {
        setCartList([])
    }

    useEffect(() => {
        let cartList = localStorage.getItem("cartList")
        if (cartList) {
            setCartList(JSON.parse(cartList))
          }
    }, [])

    useEffect(() => {
        localStorage.setItem('cartList', JSON.stringify(cartList))
    }, [cartList])

    return(
        <CartContext.Provider value={{
            cartList,
            addToCart,
            removeItem,
            emptyCart
        }} >
            {children}
        </CartContext.Provider>
    )
}
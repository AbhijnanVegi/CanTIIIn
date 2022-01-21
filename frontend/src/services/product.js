import axios from 'axios'
import { setToken } from "./auth"

const getProductList = async () => {
    setToken()
    const res = await axios.get('/products')
    return res.data
}

const placeOrder = async (e) => {
    setToken()
    const res = await axios.post("/orders/new", e)
    return res.data
}

export { getProductList, placeOrder }
import axios from 'axios'

const getProductList = async () => {
    const res = await axios.get('/products')
    return res.data
}

export { getProductList }
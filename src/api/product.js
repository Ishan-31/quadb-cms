import API_INSTANCE from "."

export const getAllProducts = async () => {
    const res = await API_INSTANCE.get('/product/all')
    return res
}

export const createProduct = async (body) => {
    const res = await API_INSTANCE.post('/product/', body)
    return res
}

export const getProductById = async (id) => {
    const res = await API_INSTANCE.get(`/product/${id}`)
    return res
}

export const updateProduct = async (id, body) => {
    const res = await API_INSTANCE.patch(`/product/${id}`, body)
    return res
}

export const deleteProduct = async (id) => {
    const res = await API_INSTANCE.delete(`/product/${id}`)
    return res
}

export const updateProductInventory = async (id, body) => {
    const res = await API_INSTANCE.patch(`/product/${id}/inventory`, body)
    return res
}

export const updateProductStatus = async (id) => {
    const res = await API_INSTANCE.patch(`/product/${id}/status`)
    return res
}
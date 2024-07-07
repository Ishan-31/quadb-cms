import React from 'react'
import BaseLayout from '../../layout/BaseLayout'
import PrivateRoute from '../../components/PrivateRoute'
import ProductsTable from '../../components/pages/products/ProductsTable'

function index() {
    return (
        <PrivateRoute>
            <BaseLayout>
                <h1>Products</h1>
                <ProductsTable />
            </BaseLayout>
        </PrivateRoute>
    )
}

export default index
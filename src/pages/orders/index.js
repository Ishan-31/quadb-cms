import React from 'react'
import BaseLayout from '../../layout/BaseLayout'
import PrivateRoute from '../../components/PrivateRoute'
import OrdersTable from '../../components/pages/orders/OrdersTable'

function index() {
    return (
        <PrivateRoute>
            <BaseLayout>
                <h1>Orders</h1>
                <OrdersTable />
            </BaseLayout>
        </PrivateRoute>
    )
}

export default index
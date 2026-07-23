import { Button, Descriptions, Input, Modal, Select, Table } from 'antd'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { ConfirmButton, PageHeader, QueryState, StatusTag, responseItems } from '../components/common'
import { ORDER_STATUSES, PAYMENT_STATUSES } from '../constants/app.jsx'
import {
  useDeleteOrderMutation,
  useGetAllOrdersQuery,
  useGetOrderDetailsQuery,
  useUpdateDeliveryStatusMutation,
  useUpdatePaymentStatusMutation,
} from '../services/ordersApi'
import { formatCurrency, formatDateTime } from '../utils/format'

function OrderDetails({ orderId, open, onClose }) {
  const { data, isLoading, error } = useGetOrderDetailsQuery(orderId, { skip: !orderId })
  const order = data?.data
  const itemColumns = [
    { title: 'Product', render: (_, row) => row.product?.name || row.name || 'N/A' },
    { title: 'Variants', render: (_, row) => Object.entries(row.variants || {}).map(([k, v]) => `${k}: ${v}`).join(', ') || '-' },
    { title: 'Qty', dataIndex: 'quantity' },
    { title: 'Price', render: (_, row) => formatCurrency(row.price) },
    { title: 'Total', render: (_, row) => formatCurrency((row.price || 0) * (row.quantity || 0)) },
  ]
  return <Modal title="Order Details" open={open} onCancel={onClose} width={900} footer={<Button onClick={onClose}>Close</Button>}>
    <QueryState loading={isLoading} error={error} empty={!order} emptyText="No order details available.">
      {order && <>
        <Descriptions bordered column={2} items={[
          { key: 'user', label: 'User', children: `${order.user?.name || 'N/A'} (${order.user?.email || 'N/A'})` },
          { key: 'total', label: 'Total Amount', children: formatCurrency(order.total_amount) },
          { key: 'final', label: 'Final Amount', children: formatCurrency(order.final_amount) },
          { key: 'payment', label: 'Payment Status', children: <StatusTag value={order.payment_status} /> },
          { key: 'delivery', label: 'Delivery Status', children: <StatusTag value={order.delivery_status} /> },
          { key: 'method', label: 'Payment Method', children: order.payment_method || 'N/A' },
          { key: 'date', label: 'Order Date', children: formatDateTime(order.createdAt) },
          { key: 'estimated', label: 'Estimated Delivery Date', children: formatDateTime(order.estimated_delivery_date) },
          { key: 'address', label: 'Delivery Address', span: 2, children: order.delivery_address || order.address || 'N/A' },
          { key: 'notes', label: 'Notes', span: 2, children: order.notes || 'N/A' },
          { key: 'rider', label: 'Assigned Rider', span: 2, children: order.rider?.name || 'N/A' },
        ]} />
        <h3>Items</h3><Table rowKey={(row) => row._id || row.product?._id} dataSource={order.items || []} columns={itemColumns} pagination={false} scroll={{ x: 600 }} />
      </>}
    </QueryState>
  </Modal>
}

export default function OrdersPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [delivery, setDelivery] = useState('all')
  const [payment, setPayment] = useState('all')
  const [selected, setSelected] = useState(null)
  const params = { page, limit: 10, search, delivery_status: delivery === 'all' ? undefined : delivery, payment_status: payment === 'all' ? undefined : payment }
  const { data, isLoading, error } = useGetAllOrdersQuery(params)
  const [updateDelivery] = useUpdateDeliveryStatusMutation()
  const [updatePayment] = useUpdatePaymentStatusMutation()
  const [remove] = useDeleteOrderMutation()
  const rows = responseItems(data)
  const update = async (operation, payload, message) => {
    try { await operation(payload).unwrap(); toast.success(message) } catch (e) { toast.error(e?.data?.message || 'Update failed') }
  }
  const columns = [
    { title: 'Order', render: (_, row) => row.order_id || row._id?.slice(-8) },
    { title: 'Customer', render: (_, row) => row.user?.name || 'N/A' },
    { title: 'Amount', render: (_, row) => formatCurrency(row.final_amount ?? row.total_amount) },
    { title: 'Payment', render: (_, row) => <Select value={row.payment_status} style={{ width: 120 }}
      onChange={(status) => update(updatePayment, { id: row._id, status }, 'Payment status updated')}
      options={PAYMENT_STATUSES.map((value) => ({ value, label: value }))} /> },
    { title: 'Delivery', render: (_, row) => <Select value={row.delivery_status} style={{ width: 130 }}
      onChange={(status) => update(updateDelivery, { id: row._id, status }, 'Delivery status updated')}
      options={ORDER_STATUSES.map((value) => ({ value, label: value }))} /> },
    { title: 'Date', render: (_, row) => formatDateTime(row.createdAt) },
    { title: 'Action', render: (_, row) => <div className="toolbar">
      <Button onClick={() => setSelected(row._id)}>View Details</Button>
      <ConfirmButton danger title="Delete this order?" onConfirm={() => update(remove, row._id, 'Order deleted')}>Delete</ConfirmButton>
    </div> },
  ]
  return <>
    <PageHeader title="Orders" />
    <section className="panel">
      <h3>Order List</h3><p className="muted">Use filters to quickly find orders.</p>
      <div className="toolbar">
        <Input.Search className="grow" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders" />
        <Select value={delivery} onChange={setDelivery} options={[{ value: 'all', label: 'All Statuses' }, ...ORDER_STATUSES.map((value) => ({ value, label: value }))]} />
        <Select value={payment} onChange={setPayment} options={[{ value: 'all', label: 'All Payments' }, ...PAYMENT_STATUSES.map((value) => ({ value, label: value }))]} />
        <Button onClick={() => { setSearch(''); setDelivery('all'); setPayment('all'); setPage(1) }}>Reset Filters</Button>
      </div>
      <QueryState loading={isLoading} error={error} empty={!rows.length}>
        <Table rowKey="_id" columns={columns} dataSource={rows} pagination={{ current: page, pageSize: 10, total: data?.meta?.total, onChange: setPage }} scroll={{ x: 1000 }} />
      </QueryState>
    </section>
    <OrderDetails orderId={selected} open={!!selected} onClose={() => setSelected(null)} />
  </>
}

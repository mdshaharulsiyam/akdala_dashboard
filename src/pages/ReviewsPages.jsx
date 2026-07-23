import { DeleteOutlined, StarFilled } from '@ant-design/icons'
import { Button, Descriptions, Modal, Rate, Table } from 'antd'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { ConfirmButton, PageHeader, QueryState, StatCard, StatusTag, responseItems } from '../components/common'
import { useDeleteReviewMutation, useGetAllReviewsQuery, useGetVendorReviewsQuery, useToggleBlockReviewMutation } from '../services/reviewsApi'
import { assetUrl, formatDate } from '../utils/format'

function ReviewsTable({ vendor }) {
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(null)
  const adminQuery = useGetAllReviewsQuery({ page, limit: 10, review_for: 'PRODUCT' }, { skip: vendor })
  const vendorQuery = useGetVendorReviewsQuery({ page, limit: 10 }, { skip: !vendor })
  const query = vendor ? vendorQuery : adminQuery
  const [toggleBlock] = useToggleBlockReviewMutation()
  const [remove] = useDeleteReviewMutation()
  const rows = responseItems(query.data)
  const act = async (operation, id, text) => {
    try { await operation(id).unwrap(); toast.success(text) } catch (e) { toast.error(e?.data?.message || 'Something went wrong') }
  }
  const columns = [
    { title: 'User', render: (_, row) => row.user?.name || 'N/A' },
    { title: 'Product', render: (_, row) => row.product?.name || 'N/A' },
    { title: 'Rating', dataIndex: 'rating', render: (value) => <Rate disabled value={value} /> },
    { title: 'Review', dataIndex: 'review', ellipsis: true },
    { title: 'Date', render: (_, row) => formatDate(row.createdAt) },
    { title: 'Status', render: (_, row) => <StatusTag value={row.isBlocked ? 'blocked' : 'active'} /> },
    { title: 'Action', render: (_, row) => <div className="toolbar">
      <Button onClick={() => setSelected(row)}>View</Button>
      {!vendor && <Button onClick={() => act(toggleBlock, row._id, 'Review status updated')}>{row.isBlocked ? 'Unblock' : 'Block'}</Button>}
      {!vendor && <ConfirmButton danger icon={<DeleteOutlined />} title="Delete this review?" onConfirm={() => act(remove, row._id, 'Review deleted')}>Delete</ConfirmButton>}
    </div> },
  ]
  return <>
    {vendor && <div className="stat-grid">
      <StatCard title="Total Reviews" value={query.data?.data?.total ?? rows.length} icon={<StarFilled />} />
      <StatCard title="Average Rating" value={query.data?.data?.average_rating ?? 0} />
      <StatCard title="5 Star Reviews" value={query.data?.data?.five_star_reviews ?? 0} />
    </div>}
    <section className="panel"><QueryState loading={query.isLoading} error={query.error} empty={!rows.length}>
      <Table rowKey="_id" columns={columns} dataSource={rows} pagination={{ current: page, pageSize: 10, total: query.data?.meta?.total, onChange: setPage }} scroll={{ x: 900 }} />
    </QueryState></section>
    <Modal title="Review Details" open={!!selected} onCancel={() => setSelected(null)} footer={<Button onClick={() => setSelected(null)}>Close</Button>}>
      {selected && <Descriptions column={1} bordered items={[
        { key: 'user', label: 'User', children: <div><img src={assetUrl(selected.user?.img)} width={50} alt="" />{selected.user?.name}</div> },
        { key: 'product', label: 'Product', children: selected.product?.name || 'N/A' },
        { key: 'status', label: 'Product Status', children: <StatusTag value={selected.product?.isBlocked ? 'blocked' : 'active'} /> },
        { key: 'review', label: 'Review', children: selected.review },
        { key: 'date', label: 'Date', children: formatDate(selected.createdAt) },
      ]} />}
    </Modal>
  </>
}

export const ProductReviewsPage = () => <><PageHeader title="Product Reviews" /><ReviewsTable /></>
export const VendorReviewsPage = () => <><PageHeader title="Vendor Reviews" /><ReviewsTable vendor /></>

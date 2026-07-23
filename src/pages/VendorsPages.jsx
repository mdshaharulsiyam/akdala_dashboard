import { PlusOutlined } from '@ant-design/icons'
import { Button, Descriptions, Form, Input, Modal, Select, Table, Upload } from 'antd'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { ConfirmButton, PageHeader, QueryState, StatusTag, responseItems } from '../components/common'
import { useGetAllUsersQuery } from '../services/authApi'
import {
  useApproveShopMutation,
  useBlockShopMutation,
  useCreateShopRequestMutation,
  useDeleteShopMutation,
  useGetAllShopsQuery,
  useRejectShopMutation,
} from '../services/vendorsApi'
import { assetUrl, toFormData } from '../utils/format'

export function VendorsPage() {
  const [search, setSearch] = useState('')
  const [approval, setApproval] = useState('all')
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()
  const { data, isLoading, error } = useGetAllShopsQuery()
  const [approve] = useApproveShopMutation()
  const [reject] = useRejectShopMutation()
  const [block] = useBlockShopMutation()
  const [remove] = useDeleteShopMutation()
  const shops = responseItems(data)
  const rows = useMemo(() => shops.filter((shop) => {
    const matchSearch = String(shop.name || '').toLowerCase().includes(search.toLowerCase())
    const approved = shop.isApproved ?? shop.is_approved
    return matchSearch && (approval === 'all' || (approval === 'approved' ? approved : !approved))
  }), [shops, search, approval])
  const mutate = async (operation, id, message) => {
    try { const result = await operation(id).unwrap(); toast.success(result?.message || message) }
    catch (e) { toast.error(e?.data?.message || 'Something went wrong') }
  }
  const columns = [
    { title: 'Vendor', render: (_, row) => <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
      <img src={assetUrl(row.logo)} alt="" width={42} height={42} style={{ objectFit: 'cover', borderRadius: 6 }} />
      <div><strong>{row.name || 'N/A'}</strong><div className="muted">{row.user?.email}</div></div>
    </div> },
    { title: 'Address', dataIndex: 'address', ellipsis: true },
    { title: 'Products', render: (_, row) => row.total_products ?? row.products_count ?? 0 },
    { title: 'Approval', render: (_, row) => <StatusTag value={(row.isApproved ?? row.is_approved) ? 'approved' : 'pending'} /> },
    { title: 'Status', render: (_, row) => <StatusTag value={(row.isBlocked ?? row.is_blocked) ? 'blocked' : 'active'} /> },
    { title: 'Action', fixed: 'right', render: (_, row) => <div className="toolbar">
      <Button onClick={() => setSelected(row)}>Details</Button>
      {!(row.isApproved ?? row.is_approved) && <Button type="primary" onClick={() => mutate(approve, row._id, 'Vendor approved')}>Approve</Button>}
      {!(row.isApproved ?? row.is_approved) && <Button danger onClick={() => mutate(reject, row._id, 'Vendor rejected')}>Reject</Button>}
      <Button onClick={() => mutate(block, row._id, 'Vendor status updated')}>{(row.isBlocked ?? row.is_blocked) ? 'Unblock' : 'Block'}</Button>
      <ConfirmButton danger title="Delete this vendor?" onConfirm={() => mutate(remove, row._id, 'Vendor deleted')}>Delete</ConfirmButton>
    </div> },
  ]
  return <>
    <PageHeader title="Vendor Management" subtitle="Manage vendors, approval status, and access."
      action={<Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/vendors/new')}>Add Vendor</Button>} />
    <section className="panel">
      <div className="toolbar">
        <Input.Search className="grow" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search vendors by name" />
        <Select value={approval} onChange={setApproval} options={[
          { value: 'all', label: 'All' }, { value: 'approved', label: 'Approved' }, { value: 'pending', label: 'Not Approved' },
        ]} />
      </div>
      <QueryState loading={isLoading} error={error} empty={!rows.length} emptyText="No vendors found.">
        <Table rowKey="_id" columns={columns} dataSource={rows} scroll={{ x: 1100 }} />
      </QueryState>
    </section>
    <Modal title="Vendor Details" open={!!selected} onCancel={() => setSelected(null)} footer={<Button onClick={() => setSelected(null)}>Close</Button>}>
      {selected && <Descriptions column={1} bordered items={[
        { key: 'name', label: 'Name', children: selected.name },
        { key: 'email', label: 'Email', children: selected.user?.email || 'N/A' },
        { key: 'address', label: 'Address', children: selected.address || 'N/A' },
        { key: 'products', label: 'Total Products', children: selected.total_products ?? 0 },
        { key: 'approval', label: 'Approval Status', children: <StatusTag value={selected.isApproved ? 'approved' : 'pending'} /> },
        { key: 'block', label: 'Block Status', children: <StatusTag value={selected.isBlocked ? 'blocked' : 'active'} /> },
      ]} />}
    </Modal>
  </>
}

export function NewVendorPage() {
  const navigate = useNavigate()
  const [create, { isLoading }] = useCreateShopRequestMutation()
  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery({ page: 1, limit: 100, role: 'USER', search: '' })
  const users = responseItems(usersData)
  const submit = async (values) => {
    try {
      const body = toFormData(values, ['logo', 'banner', 'documents'])
      const result = await create(body).unwrap()
      toast.success(result?.message || 'Vendor created successfully')
      navigate('/vendors')
    } catch (e) { toast.error(e?.data?.message || 'Failed to create vendor') }
  }
  const uploadProps = { beforeUpload: () => false }
  return <>
    <PageHeader title="Create Vendor" subtitle="Vendor Registration" action={<Button onClick={() => navigate('/vendors')}>Back to vendors</Button>} />
    <section className="panel">
      <Form layout="vertical" onFinish={submit}>
        <div className="grid-2-source">
          <Form.Item label="Business Name" name="name" rules={[{ required: true }]}><Input placeholder="e.g. MultiMart, FlexMart" /></Form.Item>
          <Form.Item label="Assign Existing User" name="user" rules={[{ required: true }]}>
            <Select showSearch loading={usersLoading} placeholder="Search by user name or email"
              options={users.map((user) => ({ value: user._id, label: `${user.name} (${user.email})` }))} />
          </Form.Item>
        </div>
        <Form.Item label="Business Address" name="address" rules={[{ required: true }]}><Input placeholder="Full business address" /></Form.Item>
        <div className="grid-3-source">
          <Form.Item label="Business Logo" name="logo" valuePropName="fileList" getValueFromEvent={(e) => e.fileList}>
            <Upload {...uploadProps} maxCount={1}><Button icon={<PlusOutlined />}>Upload Logo</Button></Upload>
          </Form.Item>
          <Form.Item label="Business Banner" name="banner" valuePropName="fileList" getValueFromEvent={(e) => e.fileList}>
            <Upload {...uploadProps} maxCount={1}><Button icon={<PlusOutlined />}>Upload Banner</Button></Upload>
          </Form.Item>
          <Form.Item label="Business Documents" name="documents" valuePropName="fileList" getValueFromEvent={(e) => e.fileList}>
            <Upload {...uploadProps} multiple><Button icon={<PlusOutlined />}>Upload Documents</Button></Upload>
          </Form.Item>
        </div>
        <Form.Item label="Description" name="description"><Input.TextArea rows={5} placeholder="Short description (optional)" /></Form.Item>
        <div className="toolbar" style={{ justifyContent: 'center' }}>
          <Button onClick={() => navigate('/vendors')}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>Submit Registration</Button>
        </div>
      </Form>
    </section>
  </>
}

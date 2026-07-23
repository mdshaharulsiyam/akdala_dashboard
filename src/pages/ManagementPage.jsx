import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, InputNumber, Modal, Select, Table, Tabs, Upload } from 'antd'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { ConfirmButton, PageHeader, QueryState, responseItems } from '../components/common'
import { MANAGEMENT_TABS } from '../constants/app.jsx'
import {
  useAddAttributeMutation,
  useAddBannerMutation,
  useAddCategoryMutation,
  useAddSubcategoryMutation,
  useCreateCouponMutation,
  useDeleteAttributeMutation,
  useDeleteBannerMutation,
  useDeleteCategoryMutation,
  useDeleteCouponMutation,
  useDeleteSubcategoryMutation,
  useGetAttributesQuery,
  useGetBannersQuery,
  useGetCategoriesQuery,
  useGetCouponsQuery,
  useGetSubcategoriesQuery,
  useUpdateAttributeMutation,
  useUpdateBannerMutation,
  useUpdateCategoryMutation,
  useUpdateCouponMutation,
  useUpdateSubcategoryMutation,
} from '../services/managementApi'
import { assetUrl, toFormData } from '../utils/format'

export default function ManagementPage() {
  const [tab, setTab] = useState('category')
  const [modal, setModal] = useState(null)
  const [form] = Form.useForm()
  const categories = useGetCategoriesQuery()
  const subcategories = useGetSubcategoriesQuery()
  const attributes = useGetAttributesQuery()
  const banners = useGetBannersQuery({ page: 1 })
  const coupons = useGetCouponsQuery()
  const [addCategory] = useAddCategoryMutation(); const [updateCategory] = useUpdateCategoryMutation(); const [deleteCategory] = useDeleteCategoryMutation()
  const [addSubcategory] = useAddSubcategoryMutation(); const [updateSubcategory] = useUpdateSubcategoryMutation(); const [deleteSubcategory] = useDeleteSubcategoryMutation()
  const [addAttribute] = useAddAttributeMutation(); const [updateAttribute] = useUpdateAttributeMutation(); const [deleteAttribute] = useDeleteAttributeMutation()
  const [addBanner] = useAddBannerMutation(); const [updateBanner] = useUpdateBannerMutation(); const [deleteBanner] = useDeleteBannerMutation()
  const [addCoupon] = useCreateCouponMutation(); const [updateCoupon] = useUpdateCouponMutation(); const [deleteCoupon] = useDeleteCouponMutation()
  const queries = { category: categories, subcategory: subcategories, attributes, banner: banners, coupon: coupons }
  const mutations = {
    category: [addCategory, updateCategory, deleteCategory],
    subcategory: [addSubcategory, updateSubcategory, deleteSubcategory],
    attributes: [addAttribute, updateAttribute, deleteAttribute],
    banner: [addBanner, updateBanner, deleteBanner],
    coupon: [addCoupon, updateCoupon, deleteCoupon],
  }
  const rows = responseItems(queries[tab].data)
  const categoryOptions = responseItems(categories.data).map((item) => ({ value: item._id, label: item.name }))
  const openForm = (record = null) => {
    setModal(record || {})
    form.setFieldsValue(record ? { ...record, values: Array.isArray(record.values) ? record.values.join(', ') : record.values } : {})
  }
  const submit = async (values) => {
    const [create, update] = mutations[tab]
    const payload = { ...values }
    if (tab === 'attributes' && typeof payload.values === 'string') payload.values = payload.values.split(',').map((v) => v.trim()).filter(Boolean)
    let data = payload
    if (['category', 'banner'].includes(tab) && payload.img) data = toFormData(payload, ['img'])
    try {
      const result = modal?._id
        ? await update({ id: modal._id, data }).unwrap()
        : await create(data).unwrap()
      toast.success(result?.message || `${tab} saved successfully`)
      setModal(null); form.resetFields()
    } catch (e) { toast.error(e?.data?.message || `Failed to save ${tab}`) }
  }
  const remove = async (record) => {
    try { await mutations[tab][2](record._id).unwrap(); toast.success(`${tab} deleted successfully`) }
    catch (e) { toast.error(e?.data?.message || 'Delete failed') }
  }
  const columns = (() => {
    const base = [{ title: 'Name', dataIndex: tab === 'coupon' ? 'code' : 'name', render: (value, row) => value || row.title || 'N/A' }]
    if (tab === 'subcategory') base.push({ title: 'Category', render: (_, row) => row.parent?.name || row.category?.name || 'N/A' })
    if (tab === 'attributes') base.push({ title: 'Values', render: (_, row) => (row.values || []).join?.(', ') || String(row.values || '') })
    if (tab === 'banner') base.push(
      { title: 'Image', render: (_, row) => <img src={assetUrl(row.img)} alt="" width={90} height={50} style={{ objectFit: 'cover' }} /> },
      { title: 'Order', dataIndex: 'order' },
    )
    if (tab === 'coupon') base.push({ title: 'Discount', render: (_, row) => `${row.discount || row.value || 0}${row.type === 'percentage' ? '%' : ''}` })
    base.push({ title: 'Action', render: (_, row) => <div className="toolbar">
      <Button icon={<EditOutlined />} onClick={() => openForm(row)}>Edit</Button>
      <ConfirmButton danger icon={<DeleteOutlined />} title={`Delete this ${tab}?`} onConfirm={() => remove(row)}>Delete</ConfirmButton>
    </div> })
    return base
  })()
  return <>
    <PageHeader title="Management" action={<Button type="primary" icon={<PlusOutlined />} onClick={() => openForm()}>Add {tab}</Button>} />
    <section className="panel">
      <Tabs activeKey={tab} onChange={setTab} items={MANAGEMENT_TABS} />
      <QueryState loading={queries[tab].isLoading} error={queries[tab].error} empty={!rows.length}>
        <Table rowKey="_id" columns={columns} dataSource={rows} scroll={{ x: 700 }} />
      </QueryState>
    </section>
    <Modal title={`${modal?._id ? 'Edit' : 'Add New'} ${tab}`} open={!!modal} onCancel={() => setModal(null)}
      onOk={() => form.submit()} destroyOnClose>
      <Form form={form} layout="vertical" onFinish={submit}>
        {tab === 'coupon' ? <>
          <Form.Item label="Coupon Code" name="code" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Discount Type" name="type" rules={[{ required: true }]}>
            <Select options={[{ value: 'percentage', label: 'Percentage' }, { value: 'fixed', label: 'Fixed' }]} />
          </Form.Item>
          <Form.Item label="Discount" name="discount" rules={[{ required: true }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
          <Form.Item label="Expiry Date" name="expiry_date"><Input type="date" /></Form.Item>
        </> : <>
          <Form.Item label={tab === 'banner' ? 'Title' : 'Name'} name="name" rules={[{ required: tab !== 'banner' }]}><Input /></Form.Item>
          {tab === 'subcategory' && <Form.Item label="Category" name="parent" rules={[{ required: true }]}><Select options={categoryOptions} /></Form.Item>}
          {tab === 'attributes' && <Form.Item label="Values" name="values" rules={[{ required: true }]}><Input placeholder="Comma-separated values" /></Form.Item>}
          {['category', 'banner'].includes(tab) && <Form.Item label="Image" name="img" valuePropName="fileList" getValueFromEvent={(e) => e.fileList}>
            <Upload beforeUpload={() => false} maxCount={1}><Button>Upload Image</Button></Upload>
          </Form.Item>}
          {tab === 'banner' && <Form.Item label="Order" name="order"><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>}
        </>}
      </Form>
    </Modal>
  </>
}

import { AppstoreOutlined, PlusOutlined, TableOutlined } from '@ant-design/icons'
import { Button, Descriptions, Form, Input, InputNumber, Modal, Segmented, Select, Switch, Table, Upload } from 'antd'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import RichTextEditor from '../components/RichTextEditor'
import { ConfirmButton, PageHeader, QueryState, StatusTag, responseItems } from '../components/common'
import { useGetAttributesQuery, useGetCategoriesQuery, useGetSubcategoriesQuery } from '../services/managementApi'
import {
  useApproveProductMutation,
  useCreateProductMutation,
  useDeleteProductMutation,
  useFeatureProductMutation,
  useGetAllProductsQuery,
  useGetProductDetailsQuery,
  useToggleBlockProductMutation,
  useUpdateProductMutation,
} from '../services/productsApi'
import { useCreateConversationMutation } from '../services/messagingApi'
import { assetUrl, formatCurrency, toFormData } from '../utils/format'

const isProductApproved = (product) =>
  Boolean(product?.is_approved ?? product?.isApproved ?? false)

const isProductFeatured = (product) =>
  Boolean(product?.is_featured ?? product?.isFeatured ?? false)

const isProductBlocked = (product) =>
  Boolean(product?.block ?? product?.isBlocked ?? false)

export function ProductsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const vendor = location.pathname.startsWith('/vendor')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [view, setView] = useState('cards')
  const [selected, setSelected] = useState(null)
  const args = {
    page, limit: 10, search,
    isFeatured: filter === 'featured' ? true : filter === 'not-featured' ? false : undefined,
    isApproved: filter === 'approved' ? true : filter === 'not-approved' ? false : undefined,
  }
  const { data, isLoading, error } = useGetAllProductsQuery(args)
  const [approve] = useApproveProductMutation(); const [feature] = useFeatureProductMutation()
  const [block] = useToggleBlockProductMutation(); const [remove] = useDeleteProductMutation()
  const rows = responseItems(data)
  const act = async (operation, id, message) => {
    try { const result = await operation(id).unwrap(); toast.success(result?.message || message) }
    catch (e) { toast.error(e?.data?.message || 'Something went wrong') }
  }
  const actions = (row) => <div className="toolbar">
    <Button onClick={() => setSelected(row)}>View Details</Button>
    <Button onClick={() => navigate(`${vendor ? '/vendor' : ''}/products/${row._id}/edit`)}>Update</Button>
    {!vendor && !isProductApproved(row) && <Button type="primary" onClick={() => act(approve, row._id, 'Product approved')}>Approve</Button>}
    {!vendor && <Button onClick={() => act(feature, row._id, 'Featured status updated')}>{isProductFeatured(row) ? 'Unfeature' : 'Feature'}</Button>}
    {!vendor && <Button danger={isProductBlocked(row)} onClick={() => act(block, row._id, 'Block status updated')}>{isProductBlocked(row) ? 'Unblock' : 'Block'}</Button>}
    <ConfirmButton danger title="Delete this product?" onConfirm={() => act(remove, row._id, 'Product deleted')}>Delete</ConfirmButton>
  </div>
  const columns = [
    { title: 'Product', render: (_, row) => <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><img src={assetUrl(row.img?.[0])} width={48} height={48} alt="" style={{ objectFit: 'cover' }} /><strong>{row.name}</strong></div> },
    { title: 'Price', render: (_, row) => formatCurrency(row.price) },
    { title: 'Stock', dataIndex: 'stock' },
    { title: 'Category', render: (_, row) => row.category?.name || 'N/A' },
    { title: 'Status', render: (_, row) => <StatusTag value={isProductApproved(row) ? 'approved' : 'pending'} /> },
    { title: 'Action', render: (_, row) => actions(row) },
  ]
  return <>
    <PageHeader title="Products" action={<Button type="primary" icon={<PlusOutlined />} onClick={() => navigate(`${vendor ? '/vendor' : ''}/products/new`)}>Add Product</Button>} />
    <section className="panel">
      <div className="toolbar">
        <Input.Search className="grow" placeholder="Search products" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
        <Select value={filter} onChange={setFilter} options={[
          { value: 'all', label: 'All' }, { value: 'featured', label: 'Featured' }, { value: 'not-featured', label: 'Not Featured' },
          { value: 'approved', label: 'Approved' }, { value: 'not-approved', label: 'Not Approved' },
        ]} />
        <Segmented value={view} onChange={setView} options={[
          { label: 'Cards', value: 'cards', icon: <AppstoreOutlined /> }, { label: 'Table', value: 'table', icon: <TableOutlined /> },
        ]} />
      </div>
      <QueryState loading={isLoading} error={error} empty={!rows.length} emptyText="No products found.">
        {view === 'table'
          ? <Table rowKey="_id" columns={columns} dataSource={rows} pagination={{ current: page, pageSize: 10, total: data?.meta?.total, onChange: setPage }} scroll={{ x: 1000 }} />
          : <div className="grid-3-source">{rows.map((row) => <article className="product-card" key={row._id}>
            <img src={assetUrl(row.img?.[0])} alt={row.name} />
            <div className="product-card-body"><h3>{row.name}</h3><p>{formatCurrency(row.price)}</p><StatusTag value={isProductApproved(row) ? 'approved' : 'pending'} />{actions(row)}</div>
          </article>)}</div>}
      </QueryState>
    </section>
    <ProductDetailsModal product={selected} open={!!selected} onClose={() => setSelected(null)} />
  </>
}

function ProductDetailsModal({ product, open, onClose }) {
  const navigate = useNavigate()
  const { data, isLoading } = useGetProductDetailsQuery(product?._id, { skip: !product?._id })
  const [createConversation, { isLoading: messaging }] = useCreateConversationMutation()
  const item = data?.data || product
  const messageVendor = async () => {
    try {
      const result = await createConversation(item?.user?._id || item?.user).unwrap()
      onClose()
      navigate('/messages', { state: { conversationId: result?.data?._id } })
    } catch (e) { toast.error(e?.data?.message || 'Failed to open conversation') }
  }
  return <Modal title="Product Details" open={open} onCancel={onClose} width={760}
    footer={<><Button onClick={messageVendor} loading={messaging}>Message Vendor</Button><Button type="primary" onClick={onClose}>Close</Button></>}>
    <QueryState loading={isLoading} empty={!item}>
      {item && <>
        <div className="toolbar">{(item.img || []).map((src) => <img key={src} src={assetUrl(src)} width={110} height={90} style={{ objectFit: 'cover' }} />)}</div>
        <Descriptions bordered column={2} items={[
          { key: 'name', label: 'Name', children: item.name },
          { key: 'price', label: 'Price', children: formatCurrency(item.price) },
          { key: 'discount', label: 'Discount', children: item.discount || '-' },
          { key: 'approved', label: 'Approved', children: <StatusTag value={isProductApproved(item) ? 'approved' : 'pending'} /> },
          { key: 'category', label: 'Category', children: item.category?.name || '-' },
          { key: 'subcategory', label: 'Subcategory', children: item.subcategory?.name || '-' },
          { key: 'attributes', label: 'Attributes', span: 2, children: (item.attributes || item.product_attributes || []).map((a) => `${a.name || a.attribute?.name}: ${(a.values || []).join(', ')}`).join(' · ') || '-' },
          { key: 'description', label: 'Description', span: 2, children: <div dangerouslySetInnerHTML={{ __html: item.description || '' }} /> },
        ]} />
      </>}
    </QueryState>
  </Modal>
}

export function ProductFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const vendor = location.pathname.startsWith('/vendor')
  const [form] = Form.useForm()
  const [description, setDescription] = useState('')
  const { data, isLoading } = useGetProductDetailsQuery(id, { skip: !id })
  const { data: categoriesData } = useGetCategoriesQuery()
  const { data: subcategoriesData } = useGetSubcategoriesQuery()
  const { data: attributesData } = useGetAttributesQuery()
  const [create, { isLoading: creating }] = useCreateProductMutation()
  const [update, { isLoading: updating }] = useUpdateProductMutation()
  const item = data?.data
  useEffect(() => {
    if (item) {
      form.setFieldsValue({
        ...item,
        category: item.category?._id || item.category,
        subcategory: item.sub_category?._id || item.sub_category || item.subcategory?._id || item.subcategory,
        isFeatured: isProductFeatured(item),
      })
      setDescription(item.description || '')
    }
  }, [item, form])
  const submit = async (values) => {
    const payload = toFormData({ ...values, description }, ['img'])
    try {
      const result = id ? await update({ id, updatedData: payload }).unwrap() : await create(payload).unwrap()
      toast.success(result?.message || `Product ${id ? 'updated' : 'created'} successfully`)
      navigate(`${vendor ? '/vendor' : ''}/products`)
    } catch (e) { toast.error(e?.data?.message || 'Failed to save product') }
  }
  const categories = responseItems(categoriesData)
  const subcategories = responseItems(subcategoriesData)
  const attributes = responseItems(attributesData)
  return <>
    <PageHeader title={id ? 'Update Product' : 'Create Product'} subtitle={id ? 'Edit product information and images.' : 'Add a new product to your catalog.'}
      action={<Button onClick={() => navigate(-1)}>Back</Button>} />
    <QueryState loading={isLoading && !!id}>
      <section className="panel">
        <Form form={form} layout="vertical" onFinish={submit}>
          <div className="grid-2-source">
            <Form.Item label="Product Name" name="name" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item label="Price" name="price" rules={[{ required: true }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
            <Form.Item label="Discount" name="discount"><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
            <Form.Item label="Stock" name="stock" rules={[{ required: true }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
            <Form.Item label="Category" name="category" rules={[{ required: true }]}>
              <Select placeholder="Select a category" options={categories.map((c) => ({ value: c._id, label: c.name }))} />
            </Form.Item>
            <Form.Item label="Subcategory" name="subcategory">
              <Select placeholder="Select a subcategory" options={subcategories.map((c) => ({ value: c._id, label: c.name }))} />
            </Form.Item>
          </div>
          <Form.Item label="Images" name="img" valuePropName="fileList" getValueFromEvent={(e) => e.fileList}>
            <Upload listType="picture-card" beforeUpload={() => false} multiple><PlusOutlined /></Upload>
          </Form.Item>
          <Form.Item label="Sort Description" name="short_description"><Input.TextArea rows={3} /></Form.Item>
          <Form.Item label="Description"><RichTextEditor value={description} onChange={setDescription} /></Form.Item>
          <Form.List name="product_attributes">
            {(fields, { add, remove }) => <>
              {fields.map(({ key, name, ...rest }) => <div className="grid-2-source" key={key}>
                <Form.Item {...rest} label="Attribute" name={[name, 'attribute']}><Select placeholder="Select attribute" options={attributes.map((a) => ({ value: a._id, label: a.name }))} /></Form.Item>
                <Form.Item {...rest} label="Values" name={[name, 'values']}><Select mode="tags" placeholder="Select values" /></Form.Item>
                <Button danger onClick={() => remove(name)}>Remove Attribute</Button>
              </div>)}
              <Button onClick={() => add()} icon={<PlusOutlined />}>Add Attribute</Button>
            </>}
          </Form.List>
          <div className="toolbar" style={{ marginTop: 24 }}>
            <Form.Item name="isFeatured" valuePropName="checked"><Switch /> Featured</Form.Item>
            <Button onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={creating || updating}>Save Product</Button>
          </div>
        </Form>
      </section>
    </QueryState>
  </>
}

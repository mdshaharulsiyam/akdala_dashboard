import { Button, Form, Input, Modal, Select, Table } from 'antd'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import RichTextEditor from '../components/RichTextEditor'
import { ConfirmButton, PageHeader, QueryState, StatusTag, responseItems } from '../components/common'
import { CONTACT_STATUSES } from '../constants/app.jsx'
import {
  useAddAboutTermsPrivacyMutation,
  useAddFaqMutation,
  useDeleteContactMutation,
  useDeleteFaqMutation,
  useGetAboutTermsPrivacyQuery,
  useGetAllContactsQuery,
  useGetAllFaqQuery,
  useUpdateContactStatusMutation,
  useUpdateFaqMutation,
} from '../services/contentApi'
import { formatDateTime } from '../utils/format'

export function LegalContentPage({ type, title }) {
  const [content, setContent] = useState('')
  const { data, isLoading, error } = useGetAboutTermsPrivacyQuery(type)
  const [save, { isLoading: saving }] = useAddAboutTermsPrivacyMutation()
  useEffect(() => { if (data?.data) setContent(data.data.desc || '') }, [data])
  const submit = async () => {
    try { const result = await save({ name: type, value: content }).unwrap(); toast.success(result?.message || `${title} saved successfully`) }
    catch (e) { toast.error(e?.data?.message || 'something went wrong') }
  }
  return <section className="panel"><PageHeader title={title} />
    <QueryState loading={isLoading} error={error}><RichTextEditor value={content} onChange={setContent} /></QueryState>
    <Button type="primary" loading={saving} onClick={submit} style={{ marginTop: 20 }}>Save Changes</Button>
  </section>
}

export function FaqPage() {
  const [editing, setEditing] = useState(null)
  const [form] = Form.useForm()
  const { data, isLoading, error } = useGetAllFaqQuery()
  const [add, { isLoading: adding }] = useAddFaqMutation()
  const [update, { isLoading: updating }] = useUpdateFaqMutation()
  const [remove] = useDeleteFaqMutation()
  const rows = responseItems(data)
  const open = (row = {}) => { setEditing(row); form.setFieldsValue(row) }
  const submit = async (values) => {
    try {
      const result = editing?._id ? await update({ id: editing._id, data: values }).unwrap() : await add(values).unwrap()
      toast.success(result?.message || 'FAQ saved successfully'); setEditing(null); form.resetFields()
    } catch (e) { toast.error(e?.data?.message || 'Something went wrong') }
  }
  const del = async (id) => { try { await remove(id).unwrap(); toast.success('Faq deleted successfully') } catch (e) { toast.error(e?.data?.message || 'something went wrong') } }
  const columns = [
    { title: 'Question', dataIndex: 'question' },
    { title: 'Answer', dataIndex: 'answer', ellipsis: true },
    { title: 'Action', render: (_, row) => <div className="toolbar"><Button onClick={() => open(row)}>Edit</Button><ConfirmButton danger title="are you sure wants to delete this faq?" onConfirm={() => del(row._id)}>Delete</ConfirmButton></div> },
  ]
  return <>
    <PageHeader title="FAQ" action={<Button type="primary" onClick={() => open()}>Add FAQ</Button>} />
    <section className="panel"><QueryState loading={isLoading} error={error} empty={!rows.length}><Table rowKey="_id" columns={columns} dataSource={rows} /></QueryState></section>
    <Modal title={editing?._id ? 'Edit FAQ' : 'Add FAQ'} open={!!editing} onCancel={() => setEditing(null)} onOk={() => form.submit()} confirmLoading={adding || updating}>
      <Form form={form} layout="vertical" onFinish={submit}>
        <Form.Item label="Question" name="question" rules={[{ required: true }]}><Input placeholder="Enter question" /></Form.Item>
        <Form.Item label="Answer" name="answer" rules={[{ required: true }]}><Input.TextArea rows={5} placeholder="Enter answer" /></Form.Item>
      </Form>
    </Modal>
  </>
}

export function ContactMessagesPage() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('all')
  const [selected, setSelected] = useState(null)
  const { data, isLoading, error } = useGetAllContactsQuery({ page, limit: 10, status })
  const [update] = useUpdateContactStatusMutation()
  const [remove] = useDeleteContactMutation()
  const rows = responseItems(data)
  const act = async (operation, payload, message) => {
    try { await operation(payload).unwrap(); toast.success(message); setSelected(null) } catch (e) { toast.error(e?.data?.message || 'Something went wrong') }
  }
  const columns = [
    { title: 'Name', dataIndex: 'name' }, { title: 'Email', dataIndex: 'email' },
    { title: 'Phone', dataIndex: 'phone' }, { title: 'Date', render: (_, row) => formatDateTime(row.createdAt) },
    { title: 'Status', render: (_, row) => <StatusTag value={row.status} /> },
    { title: 'Action', render: (_, row) => <Button onClick={() => setSelected(row)}>View</Button> },
  ]
  return <>
    <PageHeader title="Contact Messages" />
    <section className="panel">
      <div className="toolbar"><Select value={status} onChange={(value) => { setStatus(value); setPage(1) }}
        options={CONTACT_STATUSES.map((value) => ({ value, label: value === 'all' ? 'All Messages' : value }))} /></div>
      <QueryState loading={isLoading} error={error} empty={!rows.length}><Table rowKey="_id" columns={columns} dataSource={rows}
        pagination={{ current: page, pageSize: 10, total: data?.meta?.total, onChange: setPage }} /></QueryState>
    </section>
    <Modal title="Message Details" open={!!selected} onCancel={() => setSelected(null)} footer={null}>
      {selected && <div>
        <p><strong>Name:</strong> {selected.name}</p><p><strong>Email:</strong> {selected.email}</p>
        <p><strong>Phone:</strong> {selected.phone}</p><p><strong>Date:</strong> {formatDateTime(selected.createdAt)}</p>
        <p><strong>Status:</strong> <StatusTag value={selected.status} /></p><p><strong>Message:</strong></p><p>{selected.message}</p>
        <div className="toolbar">
          <Button type="primary" onClick={() => act(update, { id: selected._id, status: 'resolve' }, 'Message marked resolved')}>Mark as Resolved</Button>
          <Button danger onClick={() => act(update, { id: selected._id, status: 'reject' }, 'Message marked rejected')}>Mark as Rejected</Button>
          <ConfirmButton danger title="Delete this message?" onConfirm={() => act(remove, selected._id, 'Message deleted')}>Delete</ConfirmButton>
        </div>
      </div>}
    </Modal>
  </>
}

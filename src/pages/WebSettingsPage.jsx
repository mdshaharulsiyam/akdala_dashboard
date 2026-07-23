import { Button, ColorPicker, Form, Input, InputNumber, Select, Switch } from 'antd'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { PageHeader, QueryState } from '../components/common'
import { useGetWebSettingsQuery, useUpdateWebSettingsMutation } from '../services/contentApi'

const Field = ({ label, name, children = <Input /> }) => <Form.Item label={label} name={name}>{children}</Form.Item>
const Toggle = ({ label, name }) => <Form.Item label={label} name={name} valuePropName="checked"><Switch /></Form.Item>

export default function WebSettingsPage() {
  const [form] = Form.useForm()
  const { data, isLoading, error } = useGetWebSettingsQuery()
  const [update, { isLoading: saving }] = useUpdateWebSettingsMutation()
  useEffect(() => {
    if (data?.data) form.setFieldsValue(data.data)
  }, [data, form])
  const submit = async (values) => {
    const normalized = { ...values }
    for (const key of ['primary_color', 'secondary_color']) {
      if (values[key]?.toHexString) normalized[key] = values[key].toHexString()
    }
    if (typeof values.meta_keywords === 'string') normalized.meta_keywords = values.meta_keywords.split(',').map((v) => v.trim()).filter(Boolean)
    try { const result = await update(normalized).unwrap(); toast.success(result?.message || 'Web settings updated successfully') }
    catch (e) { toast.error(e?.data?.message || 'Something went wrong') }
  }
  return <>
    <PageHeader title="Web Settings" />
    <section className="panel"><QueryState loading={isLoading} error={error}>
      <Form form={form} layout="vertical" onFinish={submit}>
        <h3>General</h3><div className="grid-2-source">
          <Field label="Site Name" name="site_name" /><Field label="Logo URL" name="logo" />
          <Field label="Favicon URL" name="favicon" /><Field label="Contact Email" name="contact_email" />
          <Field label="Contact Phone" name="contact_phone" /><Field label="Address" name="address" />
          <Field label="Currency Symbol" name="currency_symbol" /><Field label="Currency Code" name="currency_code" />
          <Field label="Primary Color" name="primary_color"><ColorPicker showText /></Field>
          <Field label="Secondary Color" name="secondary_color"><ColorPicker showText /></Field>
          <Field label="Theme" name="theme"><Select options={[{ label: 'Light', value: 'light' }, { label: 'Dark', value: 'dark' }]} /></Field>
        </div>
        <h3>SEO</h3><div className="grid-2-source">
          <Field label="Meta Title" name="meta_title" />
          <Field label="Meta Keywords (comma separated)" name="meta_keywords" />
        </div>
        <Field label="Meta Description" name="meta_description"><Input.TextArea rows={3} /></Field>
        <h3>Commerce</h3><div className="grid-2-source">
          <Field label="Free Shipping Threshold" name="free_shipping_threshold"><InputNumber min={0} style={{ width: '100%' }} /></Field>
          <Field label="Standard Rate" name="standard_rate"><InputNumber min={0} style={{ width: '100%' }} /></Field>
          <Toggle label="Tax Enabled" name="tax_enabled" />
          <Field label="Tax Rate (%)" name="tax_rate"><InputNumber min={0} max={100} style={{ width: '100%' }} /></Field>
        </div>
        <h3>Controls</h3><div className="grid-3-source">
          <Toggle label="Maintenance Mode" name="maintenance_mode" />
          <Toggle label="Auto Approve Vendor" name="auto_approve_vendor" />
          <Toggle label="Auto Approve Product" name="auto_approve_product" />
          <Toggle label="Vendor Request Allowed" name="vendor_request_allowed" />
          <Toggle label="Allow Admin Creation" name="allow_admin_creation" />
        </div>
        <h3>Delivery & Returns</h3>
        <Field label="Confirm Order Text" name="confirm_order_text"><Input.TextArea rows={3} /></Field>
        <Button type="primary" htmlType="submit" loading={saving}>Save Changes</Button>
      </Form>
    </QueryState></section>
  </>
}

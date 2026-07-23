import { Button, Form, Input, Tabs, Upload } from 'antd'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { PageHeader } from '../components/common'
import { useProfile } from '../hooks/useProfile'
import { useChangePasswordMutation, useUpdateUserMutation } from '../services/authApi'
import { toFormData } from '../utils/format'

export default function ProfilePage() {
  const { profile } = useProfile()
  const [profileForm] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [update, { isLoading }] = useUpdateUserMutation()
  const [changePassword, { isLoading: changing }] = useChangePasswordMutation()
  useEffect(() => { if (profile) profileForm.setFieldsValue(profile) }, [profile, profileForm])
  const updateProfile = async (values) => {
    try { const result = await update(toFormData(values, ['img'])).unwrap(); toast.success(result?.message || 'Profile updated successfully') }
    catch (e) { toast.error(e?.data?.message || 'Update failed') }
  }
  const updatePassword = async (values) => {
    try { const result = await changePassword(values).unwrap(); toast.success(result?.message || 'Password changed successfully'); passwordForm.resetFields() }
    catch (e) { toast.error(e?.data?.message || 'Password change failed') }
  }
  const items = [
    { key: 'profile', label: 'Update Profile', children: <Form form={profileForm} layout="vertical" onFinish={updateProfile}>
      <div className="grid-2-source">
        <Form.Item label="Full Name" name="name" rules={[{ required: true }]}><Input placeholder="shaharul siyam" /></Form.Item>
        <Form.Item label="Email address" name="email" rules={[{ type: 'email' }]}><Input placeholder="shaharulsiyam0273@gmail.com" /></Form.Item>
        <Form.Item label="Phone Number" name="phone"><Input placeholder="8801566026301" /></Form.Item>
        <Form.Item label="Profile Image" name="img" valuePropName="fileList" getValueFromEvent={(e) => e.fileList}>
          <Upload beforeUpload={() => false} maxCount={1}><Button>Upload Image</Button></Upload>
        </Form.Item>
      </div><Button type="primary" htmlType="submit" loading={isLoading}>Update Profile</Button>
    </Form> },
    { key: 'password', label: 'Change Password', children: <Form form={passwordForm} layout="vertical" onFinish={updatePassword}>
      <Form.Item label="Current Password" name="current_password" rules={[{ required: true }]}><Input.Password placeholder="insert your password" /></Form.Item>
      <Form.Item label="New Password" name="new_password" rules={[{ required: true }]}><Input.Password placeholder="insert your password" /></Form.Item>
      <Form.Item label="Confirm New Password" name="confirm_password" dependencies={['new_password']} rules={[{ required: true }, ({ getFieldValue }) => ({
        validator(_, value) { return value === getFieldValue('new_password') ? Promise.resolve() : Promise.reject(new Error('Passwords do not match')) },
      })]}><Input.Password placeholder="insert your Confirm password" /></Form.Item>
      <Button type="primary" htmlType="submit" loading={changing}>Change Password</Button>
    </Form> },
  ]
  return <><PageHeader title="Profile" subtitle="Update your personal information and password." /><section className="panel"><Tabs items={items} /></section></>
}

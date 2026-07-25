import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input } from 'antd'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { STORAGE_KEYS } from '../../constants/app.jsx'
import {
  useForgetPasswordMutation,
  useLazyGetProfileQuery,
  useLoginUserMutation,
  useResetPasswordMutation,
  useVerifyCodeMutation,
} from '../../services/authApi'
import { authorizedDestination, isDashboardRole } from '../../utils/auth'
import { clearAuthStorage, readStored, writeStored } from '../../utils/storage'

const PasswordInput = (props) => {
  const [visible, setVisible] = useState(false)
  return <Input {...props} type={visible ? 'text' : 'password'} suffix={visible
    ? <EyeOutlined onClick={() => setVisible(false)} />
    : <EyeInvisibleOutlined onClick={() => setVisible(true)} />} />
}

function AuthFrame({ title, subtitle, children }) {
  return <div className="auth-page"><div className="auth-card"><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}{children}</div></div>
}

export function LoginPage() {
  const location = useLocation()
  const [login, { isLoading }] = useLoginUserMutation()
  const [getProfile, { isFetching: profileLoading }] = useLazyGetProfileQuery()
  const destination = location.state?.from
  const submit = async (values) => {
    try {
      const result = await login(values).unwrap()
      if (!result?.token) throw new Error('Login did not return an access token')

      writeStored(STORAGE_KEYS.token, result.token)
      const profileResult = await getProfile().unwrap()
      const profile = profileResult?.data

      if (!isDashboardRole(profile?.role)) {
        clearAuthStorage()
        return toast.error('Only administrators and vendors can access this dashboard.')
      }

      toast.success(result?.message || 'Logged in successfully')
      window.location.replace(authorizedDestination(profile.role, destination))
    } catch (error) {
      clearAuthStorage()
      toast.error(error?.data?.message || 'something went wrong')
    }
  }
  return (
    <AuthFrame title="Login to Account" subtitle="Please enter your email and password to continue">
      <Form layout="vertical" onFinish={submit}>
        <Form.Item label="Email Address" name="email" rules={[{ required: true, message: 'please input your Email Address' }, { type: 'email' }]}>
          <Input placeholder="Enter your email" />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, message: 'please input your password' }]}>
          <PasswordInput placeholder="Enter your password" />
        </Form.Item>
        <div className="auth-links"><Checkbox>Remember Password</Checkbox><Link to="/forget-password">Forget Password?</Link></div>
        <Button type="primary" htmlType="submit" loading={isLoading || profileLoading} block size="large">Sign in</Button>
      </Form>
    </AuthFrame>
  )
}

export function ForgetPasswordPage() {
  const [send, { isLoading }] = useForgetPasswordMutation()
  const navigate = useNavigate()
  const submit = async (values) => {
    try {
      const result = await send(values).unwrap()
      if (!result?.success) throw new Error()
      writeStored(STORAGE_KEYS.email, values.email)
      toast.success(result.message || 'a verification code has been sent to Phone Number')
      navigate('/otp')
    } catch (error) { toast.error(error?.data?.message || 'something went wrong') }
  }
  return (
    <AuthFrame title="Forget Password">
      <Form layout="vertical" onFinish={submit}>
        <Form.Item label="Enter Your Email" name="email" rules={[{ required: true }, { type: 'email' }]}>
          <Input placeholder="shaharulsiyam0273@gmail.com" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading} block size="large">Send a Code</Button>
      </Form>
    </AuthFrame>
  )
}

export function OtpPage() {
  const [verify, { isLoading }] = useVerifyCodeMutation()
  const navigate = useNavigate()
  const email = readStored(STORAGE_KEYS.email)
  useEffect(() => { if (!email) navigate('/forget-password', { replace: true }) }, [email, navigate])
  const submit = async ({ code }) => {
    try {
      const result = await verify({ code, email }).unwrap()
      const resetToken = result?.data?.resetToken
      if (!resetToken) return toast.error(result?.message || 'Something went wrong')
      writeStored(STORAGE_KEYS.resetToken, resetToken)
      toast.success(result?.message || 'Verification successful, please set a new password')
      navigate('/reset-password')
    } catch (error) { toast.error(error?.data?.message || 'something went wrong') }
  }
  return (
    <AuthFrame title="Verify Your Email" subtitle="We sent a reset link to your email. Enter the 6 digit code.">
      <Form layout="vertical" onFinish={submit}>
        <Form.Item name="code" rules={[{ required: true, message: 'please input your otp' }]}>
          <Input.OTP length={6} />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading} block size="large">Verify Code</Button>
      </Form>
    </AuthFrame>
  )
}

export function ResetPasswordPage() {
  const [reset, { isLoading }] = useResetPasswordMutation()
  const navigate = useNavigate()
  const resetToken = readStored(STORAGE_KEYS.resetToken)
  useEffect(() => { if (!resetToken) navigate('/forget-password', { replace: true }) }, [resetToken, navigate])
  const submit = async (values) => {
    try {
      const result = await reset(values).unwrap()
      localStorage.removeItem(STORAGE_KEYS.resetToken)
      localStorage.removeItem(STORAGE_KEYS.email)
      toast.success(result?.message || 'Password reset successfully, please login')
      navigate('/login')
    } catch (error) { toast.error(error?.data?.message || 'something went wrong') }
  }
  return (
    <AuthFrame title="reset Password" subtitle="Please enter your new password">
      <Form layout="vertical" onFinish={submit}>
        <Form.Item label="Password" name="password" rules={[{ required: true, message: 'please input your password' }]}>
          <PasswordInput placeholder="insert your password" />
        </Form.Item>
        <Form.Item label="Confirm Password" name="confirm_password" dependencies={['password']}
          rules={[{ required: true, message: 'please input your Confirm password' }, ({ getFieldValue }) => ({
            validator(_, value) { return !value || getFieldValue('password') === value ? Promise.resolve() : Promise.reject(new Error('Passwords do not match')) },
          })]}>
          <PasswordInput placeholder="insert your Confirm password" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading} block size="large">Reset Password</Button>
      </Form>
    </AuthFrame>
  )
}

import { ConfigProvider } from 'antd'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { router } from './routes/router'

export default function App() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#050505', borderRadius: 6, fontFamily: 'Poppins, sans-serif' } }}>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </ConfigProvider>
  )
}

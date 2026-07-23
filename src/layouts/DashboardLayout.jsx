import { BellOutlined, MenuOutlined } from '@ant-design/icons'
import { Avatar, Badge, Button, Drawer, Dropdown } from 'antd'
import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import avatar from '../assets/avatar.jpg'
import Sidebar from '../components/Sidebar'
import { useProfile } from '../hooks/useProfile'
import { useGetNotificationsQuery, useGetUnreadConversationCountQuery } from '../services/messagingApi'
import { clearAuthStorage } from '../utils/storage'

export default function DashboardLayout() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { profile } = useProfile()
  const vendor = profile?.role === 'VENDOR' || location.pathname.startsWith('/vendor')
  const { data: notificationData } = useGetNotificationsQuery({ page: 1, limit: 50 })
  const { data: unreadData } = useGetUnreadConversationCountQuery()
  const unread = notificationData?.data?.unread_count || notificationData?.unread_count || 0
  const messages = unreadData?.data?.count || unreadData?.data || 0
  const logout = () => { clearAuthStorage(); navigate('/login', { replace: true }) }
  const menu = { items: [
    { key: 'profile', label: 'Profile', onClick: () => navigate(vendor ? '/vendor/shop-profile' : '/profile') },
    { key: 'logout', label: 'Log Out', danger: true, onClick: logout },
  ] }

  return (
    <div className="dashboard-shell">
      <aside className="desktop-sidebar"><Sidebar vendor={vendor} onLogout={logout} /></aside>
      <Drawer width={280} placement="left" open={open} onClose={() => setOpen(false)} styles={{ body: { padding: 0 } }}>
        <Sidebar vendor={vendor} onNavigate={() => setOpen(false)} onLogout={logout} />
      </Drawer>
      <section className="dashboard-main">
        <header className="topbar">
          <div className="topbar-title">
            <Button className="mobile-menu" icon={<MenuOutlined />} onClick={() => setOpen(true)} />
            <div><strong>{vendor ? 'Vendor Panel' : 'Shop Dashboard'}</strong><small>Dashboard</small></div>
          </div>
          <div className="topbar-actions">
            <Badge count={messages} size="small"><Button shape="circle" onClick={() => navigate(vendor ? '/vendor/messages' : '/messages')}>💬</Button></Badge>
            <Badge count={unread} size="small"><Button shape="circle" icon={<BellOutlined />} onClick={() => navigate('/notification')} /></Badge>
            <Dropdown menu={menu} trigger={['click']}>
              <button className="profile-trigger">
                <Avatar src={profile?.img || avatar} />
                <span><strong>{profile?.name || 'Administrator'}</strong><small>{profile?.role || ''}</small></span>
              </button>
            </Dropdown>
          </div>
        </header>
        <main className="content"><Outlet /></main>
      </section>
    </div>
  )
}

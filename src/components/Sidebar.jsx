import { LogoutOutlined, SettingOutlined } from '@ant-design/icons'
import { NavLink } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import logo from '../assets/logo.png'
import { adminNavigation, adminSettingsNavigation, vendorNavigation } from '../constants/app.jsx'

export default function Sidebar({ vendor, onNavigate, onLogout }) {
  const location = useLocation()
  const links = vendor ? vendorNavigation : adminNavigation
  return (
    <div className="sidebar-inner">
      <img className="brand-logo" src={logo} alt="logo" />
      <nav className="sidebar-nav">
        {links.map((item) => (
          <NavLink key={item.path} to={item.path} end={item.path === '/'} onClick={onNavigate}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            {item.icon}<span>{item.label}</span>
          </NavLink>
        ))}
        {!vendor && (
          <details className="settings-menu" open={adminSettingsNavigation.some((item) => location.pathname === item.path)}>
            <summary><SettingOutlined /><span>Settings</span></summary>
            <div>
              {adminSettingsNavigation.map((item) => (
                <NavLink key={item.path} to={item.path} onClick={onNavigate}
                  className={({ isActive }) => `sub-nav-link ${isActive ? 'active' : ''}`}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </details>
        )}
      </nav>
      <button className="logout-link" onClick={onLogout}><LogoutOutlined /> <span>Log Out</span></button>
    </div>
  )
}

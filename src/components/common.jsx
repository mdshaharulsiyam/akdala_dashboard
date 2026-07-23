import { Alert, Button, Empty, Modal, Spin, Tag } from 'antd'
import { statusColor, titleCase } from '../utils/format'

export function Loader({ fullScreen = false }) {
  return (
    <div className={fullScreen ? 'page-loader full-screen' : 'page-loader'}>
      <span className="loader" aria-label="Loading" />
    </div>
  )
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <header className="page-header">
      <div>
        <h1 className="page-heading">{title}</h1>
        {subtitle && <p className="muted">{subtitle}</p>}
      </div>
      {action}
    </header>
  )
}

export function StatCard({ title, value, icon, hint }) {
  return (
    <article className="stat-card">
      <div><p className="muted">{title}</p><strong>{value ?? 0}</strong>{hint && <small>{hint}</small>}</div>
      {icon && <span className="stat-icon">{icon}</span>}
    </article>
  )
}

export function StatusTag({ value }) {
  return <Tag color={statusColor(value)}>{titleCase(value || 'N/A')}</Tag>
}

export function QueryState({ loading, error, empty, emptyText = 'No data found.', children }) {
  if (loading) return <div className="center-pad"><Spin size="large" /></div>
  if (error) return <Alert type="error" showIcon message="Unable to load data" description={error?.data?.message || 'Something went wrong'} />
  if (empty) return <Empty description={emptyText} />
  return children
}

export function ConfirmButton({ title = 'Are you sure?', danger, onConfirm, children, ...props }) {
  const confirm = () => Modal.confirm({
    title,
    okButtonProps: { danger },
    onOk: onConfirm,
  })
  return <Button danger={danger} onClick={confirm} {...props}>{children}</Button>
}

export const responseItems = (response) =>
  response?.data?.data || response?.data || []

export const responseMeta = (response) =>
  response?.meta || response?.data?.meta || {}

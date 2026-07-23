import { CheckCircleOutlined, CloseCircleOutlined, ShopOutlined, ShoppingCartOutlined, TeamOutlined } from '@ant-design/icons'
import { Button, Table } from 'antd'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { PageHeader, QueryState, StatCard, StatusTag, responseItems } from '../components/common'
import {
  useGetPendingBusinessRequestsQuery,
  useGetShopDashboardStatsQuery,
  useGetVendorDashboardStatsQuery,
} from '../services/dashboardApi'
import { useApproveShopMutation, useRejectShopMutation } from '../services/vendorsApi'

export function AdminDashboardPage() {
  const { data: statsData, isLoading: statsLoading } = useGetShopDashboardStatsQuery()
  const { data: pendingData, isLoading, error } = useGetPendingBusinessRequestsQuery({ page: 1, limit: 10 })
  const [approve] = useApproveShopMutation()
  const [reject] = useRejectShopMutation()
  const stats = statsData?.data || {}
  const act = async (mutation, id, success) => {
    try { const result = await mutation(id).unwrap(); toast.success(result?.message || success) }
    catch (e) { toast.error(e?.data?.message || 'Something went wrong') }
  }
  const rows = responseItems(pendingData)
  const columns = [
    { title: 'Business', dataIndex: 'name', render: (_, row) => row.name || row.business_name || 'N/A' },
    { title: 'Owner', dataIndex: ['user', 'name'], render: (_, row) => row.user?.name || row.owner?.name || 'N/A' },
    { title: 'Phone', dataIndex: 'phone', render: (value, row) => value || row.user?.phone || 'N/A' },
    { title: 'Address', dataIndex: 'address', ellipsis: true },
    { title: 'Status', render: () => <StatusTag value="pending" /> },
    { title: 'Action', render: (_, row) => <div className="toolbar">
      <Button type="primary" onClick={() => act(approve, row._id, 'Business approved successfully')}>Approve</Button>
      <Button danger onClick={() => act(reject, row._id, 'Business rejected successfully')}>Reject</Button>
    </div> },
  ]
  return <>
    <PageHeader title="Dashboard Overview" subtitle="Quick stats and pending vendor requests." />
    <div className="stat-grid">
      <StatCard title="Total Vendors" value={stats.total_vendors ?? stats.totalVendors} icon={<ShopOutlined />} />
      <StatCard title="Total Users" value={stats.total_users ?? stats.totalUsers} icon={<TeamOutlined />} />
      <StatCard title="Total Products" value={stats.total_products ?? stats.totalProducts} icon={<ShoppingCartOutlined />} />
      <StatCard title="Total Orders" value={stats.total_orders ?? stats.totalOrders} icon={<CheckCircleOutlined />} />
    </div>
    <section className="panel">
      <PageHeader title="Pending Business Requests" action={<Link to="/vendors">View all vendors</Link>} />
      <QueryState loading={isLoading || statsLoading} error={error} empty={!rows.length} emptyText="No pending requests to show.">
        <Table rowKey="_id" columns={columns} dataSource={rows} pagination={false} scroll={{ x: 800 }} />
      </QueryState>
    </section>
  </>
}

export function VendorDashboardPage() {
  const { data, isLoading, error } = useGetVendorDashboardStatsQuery()
  const stats = data?.data || {}
  return <>
    <PageHeader title="Vendor Dashboard" />
    <QueryState loading={isLoading} error={error}>
      <div className="stat-grid">
        <StatCard title="Total Orders" value={stats.total_orders ?? 0} hint="All time orders" icon={<ShoppingCartOutlined />} />
        <StatCard title="Delivered Orders" value={stats.delivered_orders ?? 0} hint="Successfully delivered" icon={<CheckCircleOutlined />} />
        <StatCard title="Cancelled Orders" value={stats.cancelled_orders ?? 0} hint="Orders cancelled" icon={<CloseCircleOutlined />} />
        <StatCard title="Total Products" value={stats.total_products ?? 0} icon={<ShopOutlined />} />
      </div>
    </QueryState>
  </>
}

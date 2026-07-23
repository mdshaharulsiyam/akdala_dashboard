import { Button, Input, Select, Table, Tag } from 'antd'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { PageHeader, QueryState, StatusTag, responseItems } from '../components/common'
import { USER_ROLES } from '../constants/app.jsx'
import { useProfile } from '../hooks/useProfile'
import { useBlockUserMutation, useGetAllUsersQuery, useToggleUserRoleMutation } from '../services/authApi'
import { useDebouncedValue } from '../hooks/useDebouncedValue'

export default function UsersPage() {
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('USER')
  const [page, setPage] = useState(1)
  const deferred = useDebouncedValue(search)
  const { profile } = useProfile()
  const { data, isLoading, error } = useGetAllUsersQuery({ page, limit: 20, role, search: deferred })
  const [block] = useBlockUserMutation()
  const [toggleRole] = useToggleUserRoleMutation()
  const rows = responseItems(data)
  const act = async (operation, id, message) => {
    try { await operation(id).unwrap(); toast.success(message) } catch (e) { toast.error(e?.data?.message || 'Something went wrong') }
  }
  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Phone', dataIndex: 'phone', render: (value) => value || 'N/A' },
    { title: 'Role', dataIndex: 'role', render: (value) => <Tag color={value === 'SUPER_ADMIN' ? 'purple' : 'blue'}>{value}</Tag> },
    { title: 'Status', render: (_, row) => <StatusTag value={row.isBlocked ? 'blocked' : 'active'} /> },
    { title: 'Action', render: (_, row) => <div className="toolbar">
      <Button danger={row.isBlocked} onClick={() => act(block, row._id, 'User block status updated successfully')}>{row.isBlocked ? 'Unblock' : 'Block'}</Button>
      {profile?.role === 'SUPER_ADMIN' && ['USER', 'ADMIN'].includes(row.role) &&
        <Button onClick={() => act(toggleRole, row._id, `User role updated successfully`)}>Toggle</Button>}
    </div> },
  ]
  return <>
    <PageHeader title="User Management" />
    <section className="panel">
      <div className="toolbar">
        <Input.Search className="grow" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Search by name, email, or phone" />
        <Select value={role} onChange={(value) => { setRole(value); setPage(1) }} placeholder="Filter by role"
          options={USER_ROLES.map((value) => ({ value, label: value }))} />
      </div>
      <QueryState loading={isLoading} error={error} empty={!rows.length} emptyText="No users found.">
        <Table rowKey="_id" columns={columns} dataSource={rows} pagination={{ current: page, pageSize: 20, total: data?.meta?.total, onChange: setPage }} scroll={{ x: 800 }} />
      </QueryState>
    </section>
  </>
}

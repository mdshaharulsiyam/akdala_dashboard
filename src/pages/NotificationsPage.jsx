import { Button, List } from 'antd'
import toast from 'react-hot-toast'
import { PageHeader, QueryState, responseItems } from '../components/common'
import { useGetNotificationsQuery, useReadAllNotificationsMutation, useReadSingleNotificationMutation } from '../services/messagingApi'
import { formatDateTime } from '../utils/format'

export default function NotificationsPage() {
  const { data, isLoading, error } = useGetNotificationsQuery({ page: 1, limit: 50 })
  const [readOne] = useReadSingleNotificationMutation()
  const [readAll, { isLoading: reading }] = useReadAllNotificationsMutation()
  const items = responseItems(data)
  const all = async () => { try { await readAll().unwrap(); toast.success('All notifications marked as read') } catch (e) { toast.error(e?.data?.message || 'Something went wrong') } }
  return <>
    <PageHeader title="Notifications" action={<Button loading={reading} onClick={all}>Mark all as read</Button>} />
    <section className="panel"><QueryState loading={isLoading} error={error} empty={!items.length}>
      <List dataSource={items} renderItem={(item) => <List.Item onClick={() => !item.is_read && readOne({ data: { notification_id: item._id } })}>
        <List.Item.Meta title={item.title || 'Notification'} description={<><div>{item.message}</div><small>{formatDateTime(item.createdAt)}</small></>} />
        {!item.is_read && <span className="status-dot">New</span>}
      </List.Item>} />
    </QueryState></section>
  </>
}

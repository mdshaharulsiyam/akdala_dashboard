import { baseApi } from './baseApi'

export const messagingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: ({ page = 1, limit = 50 } = {}) => ({
        url: `notification/get-notifications?page=${page}&limit=${limit}`, method: 'GET',
      }),
      providesTags: ['notification'],
    }),
    readSingleNotification: builder.mutation({
      query: ({ data }) => ({ url: 'notification/update-notification', method: 'PATCH', body: data }),
      invalidatesTags: ['notification'],
    }),
    readAllNotifications: builder.mutation({
      query: () => ({ url: 'notification/read-all', method: 'PATCH', body: {} }),
      invalidatesTags: ['notification'],
    }),
    getAllConversations: builder.query({
      query: ({ page = 1, limit = 50 } = {}) => ({
        url: 'conversation/get-all',
        method: 'GET',
        params: { page, limit, sort: 'last_message_at', order: 'desc' },
      }),
      providesTags: ['Conversation'],
    }),
    getUnreadConversationCount: builder.query({
      query: () => ({ url: 'conversation/unread-count', method: 'GET' }),
      providesTags: ['Conversation'],
    }),
    createConversation: builder.mutation({
      query: (user) => ({ url: 'conversation/create', method: 'POST', body: { user } }),
      invalidatesTags: ['Conversation'],
    }),
    getConversationMessages: builder.query({
      query: ({ conversationId, page = 1, limit = 50 }) => ({
        url: 'message/get-all', method: 'GET', params: { conversation_id: conversationId, page, limit },
      }),
      providesTags: ['Message'],
    }),
    sendMessage: builder.mutation({
      query: (body) => ({ url: 'message/create', method: 'POST', body }),
      invalidatesTags: ['Message', 'Conversation'],
    }),
    markConversationRead: builder.mutation({
      query: (id) => ({ url: `conversation/read/${id}`, method: 'PATCH' }),
      invalidatesTags: ['Conversation'],
    }),
    deleteConversation: builder.mutation({
      query: (id) => ({ url: `conversation/delete/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Conversation'],
    }),
    deleteMessage: builder.mutation({
      query: (id) => ({ url: `message/delete/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Message'],
    }),
  }),
})

export const {
  useGetNotificationsQuery,
  useReadSingleNotificationMutation,
  useReadAllNotificationsMutation,
  useGetAllConversationsQuery,
  useGetUnreadConversationCountQuery,
  useCreateConversationMutation,
  useGetConversationMessagesQuery,
  useSendMessageMutation,
  useMarkConversationReadMutation,
} = messagingApi

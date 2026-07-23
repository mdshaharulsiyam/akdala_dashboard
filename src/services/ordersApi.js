import { baseApi } from './baseApi'

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: (params) => ({ url: 'order/get-all', params }),
      providesTags: ['Orders'],
    }),
    getOrderDetails: builder.query({
      query: (id) => ({ url: `order/details/${id}`, method: 'GET' }),
      providesTags: ['Orders'],
    }),
    createOrder: builder.mutation({
      query: (body) => ({ url: 'order/create', method: 'POST', body }),
      invalidatesTags: ['Orders'],
    }),
    updateOrder: builder.mutation({
      query: ({ id, updatedData }) => ({ url: `order/update/${id}`, method: 'PATCH', body: updatedData }),
      invalidatesTags: ['Orders'],
    }),
    deleteOrder: builder.mutation({
      query: (id) => ({ url: `order/delete/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Orders'],
    }),
    updateDeliveryStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `order/update-delivery-status/${id}`, method: 'PATCH', body: { delivery_status: status },
      }),
      invalidatesTags: ['Orders'],
    }),
    updatePaymentStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `order/update-payment-status/${id}`, method: 'PATCH', body: { payment_status: status },
      }),
      invalidatesTags: ['Orders'],
    }),
  }),
})

export const {
  useGetAllOrdersQuery, useGetOrderDetailsQuery, useDeleteOrderMutation,
  useUpdateDeliveryStatusMutation, useUpdatePaymentStatusMutation,
} = ordersApi

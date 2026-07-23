import { baseApi } from './baseApi'

export const vendorsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createShopRequest: builder.mutation({
      query: (body) => ({ url: 'business/create/admin', method: 'POST', body }),
      invalidatesTags: ['shop'],
    }),
    getAllShops: builder.query({
      query: () => 'business/get-all',
      providesTags: ['shop'],
    }),
    updateShop: builder.mutation({
      query: ({ id, updatedShopData }) => ({ url: `business/update/${id}`, method: 'PATCH', body: updatedShopData }),
      invalidatesTags: ['shop'],
    }),
    deleteShop: builder.mutation({
      query: (id) => ({ url: `business/delete/${id}`, method: 'DELETE' }),
      invalidatesTags: ['shop'],
    }),
    blockShop: builder.mutation({
      query: (id) => ({ url: `business/block/${id}`, method: 'PATCH' }),
      invalidatesTags: ['shop'],
    }),
    approveShop: builder.mutation({
      query: (id) => ({ url: `business/approve/${id}`, method: 'PATCH' }),
      invalidatesTags: ['shop', 'dashboard'],
    }),
    rejectShop: builder.mutation({
      query: (id) => ({ url: `business/reject/${id}`, method: 'PATCH' }),
      invalidatesTags: ['shop', 'dashboard'],
    }),
  }),
})

export const {
  useCreateShopRequestMutation,
  useGetAllShopsQuery,
  useUpdateShopMutation,
  useDeleteShopMutation,
  useBlockShopMutation,
  useApproveShopMutation,
  useRejectShopMutation,
} = vendorsApi

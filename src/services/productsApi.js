import { baseApi } from './baseApi'

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: ({ page = 1, limit = 10, search = '', isFeatured, isApproved } = {}) => ({
        url: 'product/get-all',
        method: 'GET',
        params: {
          page,
          limit,
          search,
          is_featured: isFeatured,
          is_approved: isApproved,
          admin: true,
        },
      }),
      providesTags: ['Product'],
    }),
    getProductDetails: builder.query({
      query: (id) => ({ url: `product/get-details/${id}`, method: 'GET' }),
      providesTags: ['Product'],
    }),
    createProduct: builder.mutation({
      query: (body) => ({ url: 'product/create', method: 'POST', body }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, updatedData }) => ({ url: `product/update/${id}`, method: 'PATCH', body: updatedData }),
      invalidatesTags: ['Product'],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({ url: `product/delete/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Product'],
    }),
    approveProduct: builder.mutation({
      query: (id) => ({ url: `product/approve/${id}`, method: 'PATCH' }),
      invalidatesTags: ['Product'],
    }),
    featureProduct: builder.mutation({
      query: (id) => ({ url: `product/feature/${id}`, method: 'PATCH' }),
      invalidatesTags: ['Product'],
    }),
    toggleBlockProduct: builder.mutation({
      query: (id) => ({ url: `product/toggle-block/${id}`, method: 'PATCH' }),
      invalidatesTags: ['Product', 'review'],
    }),
    createProductAttribute: builder.mutation({
      query: (body) => ({ url: 'product_attributes/create', method: 'POST', body }),
      invalidatesTags: ['Product'],
    }),
    deleteProductAttribute: builder.mutation({
      query: (id) => ({ url: `product_attributes/delete/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Product'],
    }),
  }),
})

export const {
  useGetAllProductsQuery, useGetProductDetailsQuery, useCreateProductMutation,
  useUpdateProductMutation, useDeleteProductMutation, useApproveProductMutation,
  useFeatureProductMutation, useToggleBlockProductMutation, useCreateProductAttributeMutation,
  useDeleteProductAttributeMutation,
} = productsApi

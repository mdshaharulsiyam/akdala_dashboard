import { baseApi } from './baseApi'

export const managementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => ({ url: 'category/get-all', method: 'GET' }),
      providesTags: ['category'],
    }),
    getCategoriesByParent: builder.query({
      query: (parent) => ({ url: `category/get-by-parent/${parent}`, method: 'GET' }),
      providesTags: ['category'],
    }),
    addCategory: builder.mutation({
      query: (body) => ({ url: 'category/create', method: 'POST', body }),
      invalidatesTags: ['category'],
    }),
    updateCategory: builder.mutation({
      query: ({ id, data }) => ({ url: `category/update/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: ['category'],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({ url: `category/delete/${id}`, method: 'DELETE' }),
      invalidatesTags: ['category'],
    }),
    getSubcategories: builder.query({
      query: () => ({ url: 'category-sub/get-all', method: 'GET' }),
      providesTags: ['Subcategory'],
    }),
    addSubcategory: builder.mutation({
      query: (body) => ({ url: 'category-sub/create', method: 'POST', body }),
      invalidatesTags: ['Subcategory'],
    }),
    updateSubcategory: builder.mutation({
      query: ({ id, data }) => ({ url: `category/update/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: ['Subcategory'],
    }),
    deleteSubcategory: builder.mutation({
      query: (id) => ({ url: `category-sub/delete/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Subcategory'],
    }),
    getAttributes: builder.query({
      query: () => ({ url: 'attributes/get-all', method: 'GET' }),
      providesTags: ['attributes'],
    }),
    addAttribute: builder.mutation({
      query: (body) => ({ url: 'attributes/create', method: 'POST', body }),
      invalidatesTags: ['attributes'],
    }),
    updateAttribute: builder.mutation({
      query: ({ id, data }) => ({ url: `attributes/update/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: ['attributes'],
    }),
    assignAttribute: builder.mutation({
      query: ({ id, data }) => ({ url: `attributes/assign/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: ['attributes'],
    }),
    syncAssignedAttributes: builder.mutation({
      query: (body) => ({ url: 'attributes/assign', method: 'PATCH', body }),
      invalidatesTags: ['attributes'],
    }),
    deleteAttribute: builder.mutation({
      query: (id) => ({ url: `attributes/delete/${id}`, method: 'DELETE' }),
      invalidatesTags: ['attributes'],
    }),
    getBanners: builder.query({
      query: ({ page = 1 } = {}) => ({ url: `banner/get-all?page=${page}&order=asc&sort=order`, method: 'GET' }),
      providesTags: ['banner'],
    }),
    addBanner: builder.mutation({
      query: (body) => ({ url: 'banner/create', method: 'POST', body }),
      invalidatesTags: ['banner'],
    }),
    updateBanner: builder.mutation({
      query: ({ id, data }) => ({ url: `banner/update/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: ['banner'],
    }),
    deleteBanner: builder.mutation({
      query: (id) => ({ url: `banner/delete/${id}`, method: 'DELETE' }),
      invalidatesTags: ['banner'],
    }),
    updateBannerOrder: builder.mutation({
      query: (body) => ({ url: 'banner/update-banner-order', method: 'PATCH', body }),
      invalidatesTags: ['banner'],
    }),
    getCoupons: builder.query({
      query: () => ({ url: 'coupon/get-all', method: 'GET' }),
      providesTags: ['Coupon'],
    }),
    createCoupon: builder.mutation({
      query: (body) => ({ url: 'coupon/create', method: 'POST', body }),
      invalidatesTags: ['Coupon'],
    }),
    updateCoupon: builder.mutation({
      query: ({ id, data }) => ({ url: `coupon/update/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: ['Coupon'],
    }),
    deleteCoupon: builder.mutation({
      query: (id) => ({ url: `coupon/delete/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Coupon'],
    }),
  }),
})

export const {
  useGetCategoriesQuery, useAddCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation,
  useGetSubcategoriesQuery, useAddSubcategoryMutation, useUpdateSubcategoryMutation, useDeleteSubcategoryMutation,
  useGetAttributesQuery, useAddAttributeMutation, useUpdateAttributeMutation, useDeleteAttributeMutation,
  useGetBannersQuery, useAddBannerMutation, useUpdateBannerMutation, useDeleteBannerMutation,
  useGetCouponsQuery, useCreateCouponMutation, useUpdateCouponMutation, useDeleteCouponMutation,
} = managementApi

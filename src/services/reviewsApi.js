import { baseApi } from './baseApi'

export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllReviews: builder.query({
      query: ({ page = 1, limit = 10, review_for = 'PRODUCT' } = {}) => ({
        url: 'review/get-all', method: 'GET', params: { page, limit, review_for },
      }),
      providesTags: ['review'],
    }),
    getVendorReviews: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: 'review/vendor/my-reviews', method: 'GET', params: { page, limit },
      }),
      providesTags: ['review'],
    }),
    toggleBlockReview: builder.mutation({
      query: (id) => ({ url: `review/toggle-block/${id}`, method: 'PATCH' }),
      invalidatesTags: ['review'],
    }),
    deleteReview: builder.mutation({
      query: (id) => ({ url: `review/delete/${id}`, method: 'DELETE' }),
      invalidatesTags: ['review'],
    }),
  }),
})

export const {
  useGetAllReviewsQuery, useGetVendorReviewsQuery,
  useToggleBlockReviewMutation, useDeleteReviewMutation,
} = reviewsApi

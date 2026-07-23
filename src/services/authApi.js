import { baseApi } from './baseApi'
import { STORAGE_KEYS } from '../constants/app.jsx'
import { readStored } from '../utils/storage'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (body) => ({ url: 'auth/sign-in', method: 'POST', body }),
      invalidatesTags: ['auth', 'category'],
    }),
    forgetPassword: builder.mutation({
      query: (body) => ({ url: 'verification/create', method: 'POST', body }),
      invalidatesTags: ['auth'],
    }),
    verifyCode: builder.mutation({
      query: (body) => ({ url: 'verification/verify', method: 'POST', body }),
      invalidatesTags: ['auth'],
    }),
    resetPassword: builder.mutation({
      query: (body) => ({
        url: 'auth/reset-password',
        method: 'POST',
        body,
        headers: { Authorization: `Bearer ${readStored(STORAGE_KEYS.resetToken)}` },
      }),
      invalidatesTags: ['auth'],
    }),
    changePassword: builder.mutation({
      query: (body) => ({ url: 'auth/change-password', method: 'PATCH', body }),
      invalidatesTags: ['auth'],
    }),
    updateUser: builder.mutation({
      query: (body) => ({ url: 'auth/update-profile', method: 'PATCH', body }),
      invalidatesTags: ['auth'],
    }),
    updateDoctor: builder.mutation({
      query: ({ id, data }) => ({ url: `auth/update-doctor/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: ['auth'],
    }),
    getProfile: builder.query({
      query: () => ({ url: 'auth/profile', method: 'GET' }),
      providesTags: ['auth'],
    }),
    getAllUsers: builder.query({
      query: ({ page = 1, limit = 20, role = 'USER', search = '' }) => ({
        url: 'auth/users', method: 'GET', params: { page, limit, role, search },
      }),
      providesTags: ['user'],
    }),
    blockUser: builder.mutation({
      query: (id) => ({ url: `auth/block/${id}`, method: 'PATCH' }),
      invalidatesTags: ['user'],
    }),
    toggleUserRole: builder.mutation({
      query: (id) => ({ url: `auth/toggle-role/${id}`, method: 'PATCH' }),
      invalidatesTags: ['user'],
    }),
  }),
})

export const {
  useLoginUserMutation,
  useForgetPasswordMutation,
  useVerifyCodeMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useUpdateUserMutation,
  useGetProfileQuery,
  useGetAllUsersQuery,
  useBlockUserMutation,
  useToggleUserRoleMutation,
} = authApi

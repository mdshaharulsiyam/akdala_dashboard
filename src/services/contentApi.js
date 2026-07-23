import { baseApi } from './baseApi'

export const contentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addAboutTermsPrivacy: builder.mutation({
      query: ({ name, value }) => ({ url: 'setting/create', method: 'PATCH', body: { name, desc: value } }),
      invalidatesTags: ['settings'],
    }),
    getAboutTermsPrivacy: builder.query({
      query: (name) => ({ url: `setting/${name}`, method: 'GET' }),
      providesTags: ['settings'],
    }),
    getWebSettings: builder.query({
      query: () => ({ url: 'web-setting/get', method: 'GET' }),
      providesTags: ['web-settings'],
    }),
    updateWebSettings: builder.mutation({
      query: (body) => ({ url: 'web-setting/create', method: 'PATCH', body }),
      invalidatesTags: ['web-settings'],
    }),
    getAllContacts: builder.query({
      query: ({ page = 1, limit = 10, status = 'all' }) => ({
        url: 'contact/get-all', method: 'GET', params: { page, limit, status },
      }),
      providesTags: ['contact'],
    }),
    updateContactStatus: builder.mutation({
      query: ({ id, status }) => ({ url: `contact/update-status/${id}`, method: 'PATCH', body: { status } }),
      invalidatesTags: ['contact'],
    }),
    deleteContact: builder.mutation({
      query: (id) => ({ url: `contact/delete/${id}`, method: 'DELETE' }),
      invalidatesTags: ['contact'],
    }),
    getAllFaq: builder.query({
      query: () => ({ url: 'faq/get-all', method: 'GET' }),
      providesTags: ['faq'],
    }),
    addFaq: builder.mutation({
      query: (body) => ({ url: 'faq/create', method: 'POST', body }),
      invalidatesTags: ['faq'],
    }),
    updateFaq: builder.mutation({
      query: ({ id, data }) => ({ url: `faq/update/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: ['faq'],
    }),
    deleteFaq: builder.mutation({
      query: (id) => ({ url: `faq/delete/${id}`, method: 'DELETE' }),
      invalidatesTags: ['faq'],
    }),
  }),
})

export const {
  useAddAboutTermsPrivacyMutation,
  useGetAboutTermsPrivacyQuery,
  useGetWebSettingsQuery,
  useUpdateWebSettingsMutation,
  useGetAllContactsQuery,
  useUpdateContactStatusMutation,
  useDeleteContactMutation,
  useGetAllFaqQuery,
  useAddFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} = contentApi

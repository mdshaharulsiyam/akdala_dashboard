import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_BASE_URL, API_TAGS, STORAGE_KEYS } from '../constants/app.jsx'
import { readStored } from '../utils/storage'

export const baseApi = createApi({
  reducerPath: 'shopApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders(headers) {
      const token = readStored(STORAGE_KEYS.token)
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: API_TAGS,
  endpoints: () => ({}),
})

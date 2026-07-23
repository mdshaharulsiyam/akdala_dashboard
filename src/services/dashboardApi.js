import { baseApi } from './baseApi'

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: () => ({ url: 'dashboard/overview', method: 'GET' }),
      providesTags: ['dashboard'],
    }),
    getIncomeOverview: builder.query({
      query: (year) => ({ url: `overview/income-overview?year=${year}`, method: 'GET' }),
      providesTags: ['dashboard'],
    }),
    getAppointmentOverview: builder.query({
      query: (year) => ({ url: `/overview/appointment-overview?year=${year}`, method: 'GET' }),
      providesTags: ['dashboard'],
    }),
    getShopDashboardStats: builder.query({
      query: () => ({ url: 'dashboard/shop-stats', method: 'GET' }),
      providesTags: ['dashboard', 'shop'],
    }),
    getPendingBusinessRequests: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: 'dashboard/pending-business-requests', method: 'GET', params: { page, limit },
      }),
      providesTags: ['dashboard', 'shop'],
    }),
    getVendorDashboardStats: builder.query({
      query: () => ({ url: 'dashboard/vendor-stats', method: 'GET' }),
      providesTags: ['dashboard'],
    }),
  }),
})

export const {
  useGetShopDashboardStatsQuery,
  useGetPendingBusinessRequestsQuery,
  useGetVendorDashboardStatsQuery,
} = dashboardApi

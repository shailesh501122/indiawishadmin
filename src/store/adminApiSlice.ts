import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from './index';

// Base API slice for Admin Panel
export const adminApi = createApi({
    reducerPath: 'adminApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL || 'https://localhost:5001/api',
        prepareHeaders: (headers, { getState }) => {
            // Admin should ideally use standard auth flow, assuming token is mirrored
            const token = (getState() as RootState).auth?.token || localStorage.getItem('adminAccessToken');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['AdminDashboard', 'Users', 'Listings', 'Properties', 'Categories', 'Settings'],
    endpoints: (builder) => ({
        getServiceCategories: builder.query<any[], void>({
            query: () => '/admin/service-categories',
            providesTags: ['Categories'],
        }),
        createServiceCategory: builder.mutation<any, FormData>({
            query: (data) => ({
                url: '/admin/service-categories',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Categories'],
        }),
        updateServiceCategory: builder.mutation<any, { id: string; data: FormData }>({
            query: ({ id, data }) => ({
                url: `/admin/service-categories/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Categories'],
        }),
        deleteServiceCategory: builder.mutation<any, string>({
            query: (id) => ({
                url: `/admin/service-categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Categories'],
        }),
    }),
});

export const {
    useGetServiceCategoriesQuery,
    useCreateServiceCategoryMutation,
    useUpdateServiceCategoryMutation,
    useDeleteServiceCategoryMutation,
} = adminApi;

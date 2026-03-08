import { adminApi } from './adminApiSlice';

export const configApiSlice = adminApi.injectEndpoints({
    endpoints: (builder) => ({
        // Categories
        getCategories: builder.query<any[], void>({
            query: () => '/listings/categories',
            providesTags: ['Categories' as any],
        }),
        createCategory: builder.mutation<any, any>({
            query: (category) => ({
                url: '/admin/categories',
                method: 'POST',
                body: category,
            }),
            invalidatesTags: ['Categories' as any],
        }),
        updateCategory: builder.mutation<any, { id: string; data: any }>({
            query: ({ id, data }) => ({
                url: `/admin/categories/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Categories' as any],
        }),
        deleteCategory: builder.mutation<any, string>({
            query: (id) => ({
                url: `/admin/categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Categories' as any],
        }),

        // System Config
        getConfigs: builder.query<any[], void>({
            query: () => '/config',
            providesTags: ['Settings' as any],
        }),
        updateConfig: builder.mutation<any, { key: string; value: string; description?: string }>({
            query: ({ key, ...data }) => ({
                url: `/api/config/${key}`, // Backend has /api/config prefix in router but admin.py might differ. 
                // Wait, main.py says include_router(config.router, prefix="/api/config")
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Settings' as any],
        }),
        createConfig: builder.mutation<any, any>({
            query: (config) => ({
                url: '/api/config',
                method: 'POST',
                body: config,
            }),
            invalidatesTags: ['Settings' as any],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useGetConfigsQuery,
    useUpdateConfigMutation,
    useCreateConfigMutation,
} = configApiSlice;

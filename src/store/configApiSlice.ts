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

        // Subcategories
        getSubcategories: builder.query<any[], void>({
            query: () => '/admin/subcategories',
            providesTags: ['Categories' as any],
        }),
        createSubcategory: builder.mutation<any, any>({
            query: (subcategory) => ({
                url: '/admin/subcategories',
                method: 'POST',
                body: subcategory,
            }),
            invalidatesTags: ['Categories' as any],
        }),
        updateSubcategory: builder.mutation<any, { id: string; data: any }>({
            query: ({ id, data }) => ({
                url: `/admin/subcategories/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Categories' as any],
        }),
        deleteSubcategory: builder.mutation<any, string>({
            query: (id) => ({
                url: `/admin/subcategories/${id}`,
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
                url: `/config/${key}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Settings' as any],
        }),
        createConfig: builder.mutation<any, any>({
            query: (config) => ({
                url: '/config',
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
    useGetSubcategoriesQuery,
    useCreateSubcategoryMutation,
    useUpdateSubcategoryMutation,
    useDeleteSubcategoryMutation,
    useGetConfigsQuery,
    useUpdateConfigMutation,
    useCreateConfigMutation,
} = configApiSlice;

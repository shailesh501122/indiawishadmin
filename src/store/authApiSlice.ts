import { adminApi } from './adminApiSlice';

export const authApiSlice = adminApi.injectEndpoints({
    endpoints: (builder) => ({
        adminLogin: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: { ...credentials },
            }),
        }),
    }),
});

export const {
    useAdminLoginMutation,
} = authApiSlice;

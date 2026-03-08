import { adminApi } from './adminApiSlice';

export interface Property {
    id: string;
    title: string;
    description: string;
    price: number;
    type: string;
    status: string;
    address?: string;
    city?: string;
    area?: number;
    bedrooms?: number;
    bathrooms?: number;
    images?: string[];
}

export const dashboardApiSlice = adminApi.injectEndpoints({
    endpoints: (builder) => ({
        getStats: builder.query({
            query: () => '/admin/stats',
            providesTags: ['AdminDashboard'],
        }),
        getAdminUsers: builder.query({
            query: () => '/admin/users',
            providesTags: ['Users'],
        }),
        getAdminListings: builder.query({
            query: () => '/admin/listings',
            providesTags: ['Listings'],
        }),
        getAdminProperties: builder.query<Property[], void>({
            query: () => '/admin/properties',
            providesTags: ['Properties'],
        }),
        // Listing CRUD
        createListing: builder.mutation<any, FormData>({
            query: (data) => ({
                url: '/admin/listings',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Listings'],
        }),
        updateListing: builder.mutation<any, { id: string; data: FormData }>({
            query: ({ id, data }) => ({
                url: `/admin/listings/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Listings'],
        }),
        deleteListing: builder.mutation<any, string>({
            query: (id) => ({
                url: `/admin/listings/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Listings'],
        }),
        // Property CRUD
        createProperty: builder.mutation<any, FormData>({
            query: (data) => ({
                url: '/admin/properties',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Properties'],
        }),
        updateProperty: builder.mutation<any, { id: string; data: FormData }>({
            query: ({ id, data }) => ({
                url: `/admin/properties/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Properties'],
        }),
        deleteProperty: builder.mutation<any, string>({
            query: (id) => ({
                url: `/admin/properties/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Properties'],
        }),
    }),
});

export const {
    useGetStatsQuery,
    useGetAdminUsersQuery,
    useGetAdminListingsQuery,
    useGetAdminPropertiesQuery,
    useCreateListingMutation,
    useUpdateListingMutation,
    useDeleteListingMutation,
    useCreatePropertyMutation,
    useUpdatePropertyMutation,
    useDeletePropertyMutation,
} = dashboardApiSlice;

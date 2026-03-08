import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdminUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
}

interface AuthState {
    user: AdminUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('adminAccessToken'),
    isAuthenticated: !!localStorage.getItem('adminAccessToken'),
    isAdmin: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAdminCredentials: (
            state,
            action: PayloadAction<{ user: AdminUser; token: string }>
        ) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.isAdmin = action.payload.user.roles.includes('Admin');
            localStorage.setItem('adminAccessToken', action.payload.token);
        },
        adminLogout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.isAdmin = false;
            localStorage.removeItem('adminAccessToken');
        },
    },
});

export const { setAdminCredentials, adminLogout } = authSlice.actions;
export default authSlice.reducer;

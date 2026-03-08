import React from 'react';
import { Search, Filter, MoreVertical, Edit, Trash2, UserX } from 'lucide-react';

const MOCK_USERS = [
    { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', role: 'User', status: 'Active', joined: 'Oct 12, 2025' },
    { id: 2, name: 'Priya Patel', email: 'priya@example.com', role: 'Builder', status: 'Active', joined: 'Nov 05, 2025' },
    { id: 3, name: 'Amit Singh', email: 'amit@example.com', role: 'Agent', status: 'Pending', joined: 'Jan 15, 2026' },
    { id: 4, name: 'Neha Gupta', email: 'neha@example.com', role: 'User', status: 'Active', joined: 'Feb 02, 2026' },
    { id: 5, name: 'Vikram Mehta', email: 'vikram@example.com', role: 'User', status: 'Suspended', joined: 'Dec 20, 2025' },
];

import { useGetAdminUsersQuery } from '../store/dashboardApiSlice';

export const Users = () => {
    const { data: users, isLoading, error } = useGetAdminUsersQuery(undefined);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-bold">Fetching user database...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage user accounts, roles, and platform access.</p>
                </div>
                <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all">
                    Add New User
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative w-full sm:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                            placeholder="Search by name, email..."
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                        </button>
                    </div>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Joined
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {(users || []).map((user: any) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black">
                                                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-bold text-gray-900">{user.firstName} {user.lastName}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.roles.map((role: string) => (
                                            <span key={role} className={`px-2.5 py-1 inline-flex text-[10px] leading-4 font-black rounded-lg uppercase tracking-wider mr-1
                                                ${role === 'Admin' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                                                    role === 'Builder' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                                        role === 'Agent' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                                            'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>
                                                {role}
                                            </span>
                                        ))}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 inline-flex text-xs leading-4 font-bold rounded-lg
                                            ${user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                            {user.isActive ? 'Active' : 'Disabled'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium font-outfit">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2">
                                            <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Edit">
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Suspend">
                                                <UserX className="h-4 w-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all" title="More">
                                                <MoreVertical className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {(!users || users.length === 0) && (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 bg-gray-50 flex items-center justify-center rounded-2xl mx-auto mb-4">
                            <UserX className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No users found</h3>
                        <p className="text-gray-500">The user database is currently empty or no results match your query.</p>
                    </div>
                )}

                {/* Pagination */}
                <div className="bg-gray-50/50 px-4 py-4 border-t border-gray-200 flex items-center justify-between sm:px-8">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">
                                System showing <span className="font-bold text-gray-900">{users?.length || 0}</span> records
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-xl shadow-sm space-x-1" aria-label="Pagination">
                                <button className="relative inline-flex items-center px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all">
                                    Previous
                                </button>
                                <button aria-current="page" className="z-10 bg-indigo-600 text-white relative inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold">
                                    1
                                </button>
                                <button className="relative inline-flex items-center px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all">
                                    Next
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


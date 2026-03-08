import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    Home as HomeIcon, Settings, LogOut, Bell, Search, Menu, ChevronRight, Tag, Briefcase
} from 'lucide-react';

import { useSelector, useDispatch } from 'react-redux';
import { adminLogout } from '../../store/authSlice';
import { RootState } from '../../store';

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);

    const handleLogout = () => {
        dispatch(adminLogout());
        navigate('/login');
    };

    const getInitials = (firstName?: string, lastName?: string) => {
        return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || 'AD';
    };

    return (
        <div className="flex h-screen bg-[#f8fafc] font-sans selection:bg-indigo-100">
            {/* Premium Sidebar */}
            <aside className="w-72 bg-[#0f172a] text-white flex flex-col h-full flex-shrink-0 shadow-2xl relative z-20">
                <div className="h-24 flex items-center px-8 border-b border-white/5">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <span className="text-white font-black text-xl italic">W</span>
                        </div>
                        <span className="text-xl font-black tracking-tight font-outfit uppercase">
                            India<span className="text-indigo-400">Wish</span>
                        </span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-8">
                    <div className="px-4 mb-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-4 mb-4">Main Menu</p>
                        <nav className="space-y-1">
                            {[
                                { name: 'Dashboard', path: '/', icon: LayoutDashboard },
                                { name: 'Users', path: '/users', icon: Users },
                                { name: 'Listings', path: '/listings', icon: ShoppingBag },
                                { name: 'Properties', path: '/properties', icon: HomeIcon },
                                { name: 'Categories', path: '/categories', icon: Tag },
                                { name: 'Service Categories', path: '/service-categories', icon: Briefcase },
                                { name: 'Analytics', path: '/analytics', icon: BarChart3 },
                            ].map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all duration-300 group ${isActive
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`
                                    }
                                >
                                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                                    <span className="flex-grow">{item.name}</span>
                                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </NavLink>
                            ))}
                        </nav>
                    </div>

                    <div className="px-4 mt-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-4 mb-4">System</p>
                        <nav className="space-y-1">
                            <NavLink
                                to="/settings"
                                className={({ isActive }) =>
                                    `flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${isActive
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`
                                }
                            >
                                <Settings className="mr-3 h-5 w-5 flex-shrink-0" />
                                Settings
                            </NavLink>
                        </nav>
                    </div>
                </div>

                <div className="p-6 border-t border-white/5">
                    <button
                        className="flex items-center w-full px-4 py-3 text-sm font-bold text-gray-400 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all duration-300"
                        onClick={handleLogout}
                    >
                        <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
                        Logout Session
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Glass Navbar */}
                <header className="h-20 glass border-b border-gray-200/50 flex items-center justify-between px-8 z-10 sticky top-0">
                    <div className="flex items-center flex-grow">
                        <button className="md:hidden text-gray-500 hover:text-gray-700 mr-4">
                            <Menu className="h-6 w-6" />
                        </button>
                        <div className="relative w-full max-w-md hidden md:block group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                className="bg-gray-100/50 border-0 focus:ring-2 focus:ring-indigo-500/20 block w-full pl-12 pr-4 py-2.5 text-sm font-medium rounded-2xl transition-all outline-none"
                                placeholder="Search everything..."
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <button className="text-gray-400 hover:text-indigo-600 relative p-2 rounded-xl hover:bg-indigo-50 transition-all">
                            <Bell className="h-6 w-6" />
                            <div className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
                        </button>

                        <div className="h-8 w-px bg-gray-200"></div>

                        <div className="flex items-center space-x-3 cursor-pointer group">
                            <div className="text-right hidden lg:block">
                                <p className="text-sm font-black text-gray-900 font-outfit">{user?.firstName} {user?.lastName}</p>
                                <p className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider font-outfit">
                                    {user?.roles?.includes('Admin') ? 'Super Administrator' : 'Staff Member'}
                                </p>
                            </div>
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 p-[2px] shadow-lg shadow-indigo-500/20 group-hover:rotate-3 transition-transform">
                                <div className="h-full w-full bg-white rounded-[10px] flex items-center justify-center font-black text-indigo-600 text-sm">
                                    {getInitials(user?.firstName, user?.lastName)}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-10">
                    {children}
                </main>
            </div>
        </div>
    );
};


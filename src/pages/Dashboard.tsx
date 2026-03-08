import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Users, ShoppingBag, Home as HomeIcon, DollarSign, TrendingUp, MoreVertical, LayoutGrid } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useGetStatsQuery } from '../store/dashboardApiSlice';


const revenueData = [
    { name: 'Mon', revenue: 4200 },
    { name: 'Tue', revenue: 3800 },
    { name: 'Wed', revenue: 5100 },
    { name: 'Thu', revenue: 4600 },
    { name: 'Fri', revenue: 6200 },
    { name: 'Sat', revenue: 5800 },
    { name: 'Sun', revenue: 7100 },
];

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
    <div className="card-premium p-8 flex flex-col group h-full">
        <div className="flex justify-between items-start mb-6">
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                <Icon size={24} />
            </div>
            <button className="text-gray-400 hover:text-gray-900 p-1">
                <MoreVertical size={18} />
            </button>
        </div>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">{title}</h3>
        <div className="flex items-end justify-between">
            <p className="text-3xl font-black text-gray-900 font-outfit">{value}</p>
            <div className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                <TrendingUp size={12} className="mr-1" />
                {change}
            </div>
        </div>
    </div>
);

export const Dashboard = () => {
    const { data: stats, isLoading } = useGetStatsQuery(undefined, {
        pollingInterval: 30000, // Refresh every 30 seconds
    });
    const { user } = useSelector((state: any) => state.auth);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-bold animate-pulse">Syncing system data...</p>
                </div>
            </div>
        );
    }

    const formatCurrency = (amt: number) => {
        if (amt >= 10000000) return `₹${(amt / 10000000).toFixed(1)}Cr`;
        if (amt >= 100000) return `₹${(amt / 100000).toFixed(1)}L`;
        return `₹${amt.toLocaleString()}`;
    }

    return (
        <div className="w-full animate-in fade-in duration-700">
            <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight font-outfit mb-2">Systems Overview</h1>
                    <p className="text-gray-500 font-medium">Welcome back, {user?.firstName || 'Administrator'}. Real-time system status is active.</p>
                </div>
                <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
                    <button className="px-6 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold transition-all shadow-lg flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        Live Stats
                    </button>
                    <button className="px-6 py-2.5 rounded-xl text-gray-500 text-sm font-bold hover:bg-gray-50">Reports</button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                <StatCard title="Registered Users" value={stats?.users?.toLocaleString() || "0"} change="+14.2%" icon={Users} color="from-indigo-600 to-violet-700" />
                <StatCard title="Market Listings" value={stats?.listings?.toLocaleString() || "0"} change="+8.1%" icon={ShoppingBag} color="from-blue-600 to-indigo-700" />
                <StatCard title="Property Assets" value={stats?.properties?.toLocaleString() || "0"} change="+3.4%" icon={HomeIcon} color="from-rose-500 to-orange-500" />
                <StatCard title="System GMV" value={formatCurrency(stats?.totalValue || 0)} change={stats?.revenueGrowth || "+0%"} icon={DollarSign} color="from-emerald-500 to-teal-600" />
            </div>

            {/* Main Insights Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2 card-premium p-10">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-black text-gray-900 font-outfit">Revenue Performance</h3>
                        <select className="bg-gray-50 border-0 text-sm font-bold text-gray-600 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500/20 outline-none">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }} tickFormatter={(v: number) => `₹${v}`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card-premium p-10 flex flex-col">
                    <h3 className="text-xl font-black text-gray-900 font-outfit mb-10 text-left">Listing Analytics</h3>
                    <div className="space-y-8 flex-grow">
                        {(stats?.categoryData || []).map((cat: any) => (
                            <div key={cat.name} className="flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-700 flex items-center">
                                        <LayoutGrid size={16} className="mr-2 text-indigo-500" />
                                        {cat.name}
                                    </span>
                                    <span className="text-sm font-black text-gray-900">{cat.count} listings</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                                        style={{ width: `${Math.min((cat.count / (stats?.listings || 1)) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                        {(!stats?.categoryData || stats.categoryData.length === 0) && (
                            <p className="text-gray-400 text-sm font-medium italic">No category data available</p>
                        )}
                    </div>
                    <button className="mt-auto w-full py-4 text-indigo-600 font-bold bg-indigo-50 border border-indigo-100 rounded-2xl hover:bg-indigo-100 transition-colors">
                        View Detailed Report
                    </button>
                </div>
            </div>

            {/* Recent Activity Mini Table */}
            <div className="card-premium overflow-hidden">
                <div className="bg-gray-50/50 px-10 py-6 border-b border-gray-100 flex justify-between items-center text-left">
                    <h3 className="text-xl font-black text-gray-900 font-outfit">Priority System Actions</h3>
                </div>
                <div className="p-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: 'System Sync', status: 'Healthy', color: 'emerald' },
                            { name: 'Database Status', status: 'Operational', color: 'indigo' },
                            { name: 'API Latency', status: '24ms', color: 'blue' },
                            { name: 'Active Nodes', status: '12 Online', color: 'violet' }
                        ].map(item => (
                            <div key={item.name} className="p-6 rounded-2xl bg-white border border-gray-50 shadow-sm flex items-center justify-between">
                                <span className="font-bold text-gray-600">{item.name}</span>
                                <span className={`text-[10px] font-black uppercase tracking-wider text-${item.color}-600 bg-${item.color}-50 px-3 py-1 rounded-full border border-${item.color}-100`}>
                                    {item.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


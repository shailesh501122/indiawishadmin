import React, { useState } from 'react';
import { useGetAdminListingsQuery, useCreateListingMutation, useUpdateListingMutation, useDeleteListingMutation } from '../store/dashboardApiSlice';
import { useGetCategoriesQuery } from '../store/configApiSlice';
import { Plus, Trash2, Edit3, X, Check, Search, RotateCw, List, Download, ShoppingBag } from 'lucide-react';

export const Listings = () => {
    const { data: listings, isLoading } = useGetAdminListingsQuery(undefined);
    const { data: categories } = useGetCategoriesQuery();
    const [createListing] = useCreateListingMutation();
    const [updateListing] = useUpdateListingMutation();
    const [deleteListing] = useDeleteListingMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingListing, setEditingListing] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category_id: '',
        status: 'Active',
        location: '',
    });
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

    const handleOpenModal = (listing: any = null) => {
        if (listing) {
            setEditingListing(listing);
            setFormData({
                title: listing.title,
                description: listing.description,
                price: listing.price.toString(),
                category_id: listing.category_id,
                status: listing.status,
                location: listing.location || '',
            });
        } else {
            setEditingListing(null);
            setFormData({
                title: '',
                description: '',
                price: '',
                category_id: '',
                status: 'Active',
                location: '',
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });
        if (selectedFiles) {
            Array.from(selectedFiles).forEach(file => {
                data.append('images_files', file);
            });
        }

        try {
            if (editingListing) {
                await updateListing({ id: editingListing.id, data }).unwrap();
            } else {
                await createListing(data).unwrap();
            }
            setIsModalOpen(false);
        } catch (err) {
            console.error('Failed to save listing:', err);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this listing?')) {
            try {
                await deleteListing(id).unwrap();
            } catch (err) {
                console.error('Failed to delete listing:', err);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#00B4D8] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-bold">Accessing marketplace records...</p>
                </div>
            </div>
        );
    }

    const filteredListings = listings?.filter((l: any) =>
        l.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full max-w-[1400px] mx-auto p-2 sm:p-6 bg-gray-50/50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold text-gray-700">Listings</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center px-4 py-2 bg-[#00B4D8] text-white rounded-md text-sm font-medium hover:bg-[#0096B4] transition shadow-sm"
                >
                    <Plus className="h-4 w-4 mr-1.5" />
                    New Listing
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">{editingListing ? 'Edit Listing' : 'Create New Listing'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Title</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded-lg"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Price (₹)</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border rounded-lg"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Category</label>
                                    <select
                                        className="w-full p-2 border rounded-lg"
                                        value={formData.category_id}
                                        onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories?.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Status</label>
                                    <select
                                        className="w-full p-2 border rounded-lg"
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Sold">Sold</option>
                                        <option value="Suspended">Suspended</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Location</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-lg"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Description</label>
                                <textarea
                                    className="w-full p-2 border rounded-lg h-32"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Images</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={e => setSelectedFiles(e.target.files)}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500 font-bold">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 flex items-center">
                                    <Check className="h-4 w-4 mr-2" />
                                    {editingListing ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative w-full sm:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input type="text" className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="Search Listings..." />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100 uppercase-headers">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest border-r border-gray-100 last:border-0 w-16">ID <span className="inline-block scale-75 ml-0.5">↕</span></th>
                                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest border-r border-gray-100 last:border-0">Title / Category <span className="inline-block scale-75 ml-0.5">↕</span></th>
                                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest border-r border-gray-100 last:border-0">Price Details <span className="inline-block scale-75 ml-0.5">↕</span></th>
                                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest border-r border-gray-100 last:border-0 w-32">Status</th>
                                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest border-r border-gray-100 last:border-0">Created <span className="inline-block scale-75 ml-0.5">↕</span></th>
                                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-outfit">
                            {filteredListings?.map((listing: any, index: number) => (
                                <tr key={listing.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'} hover:bg-cyan-50/30 transition-colors`}>
                                    <td className="px-4 py-4 text-xs text-gray-400 font-mono">{listing.id?.substring(0, 4)}</td>
                                    <td className="px-4 py-4">
                                        <div className="text-sm font-bold text-gray-900 truncate max-w-xs">{listing.title}</div>
                                        <div className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">{listing.category_name}</div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="text-sm font-black text-indigo-600">₹{listing.price?.toLocaleString()}</div>
                                        <div className="text-[10px] text-gray-400">Regular Listing</div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 inline-flex text-[10px] leading-4 font-bold rounded-lg uppercase tracking-wider
                                            ${listing.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                                                listing.status === 'Sold' ? 'bg-indigo-100 text-indigo-700' :
                                                    'bg-rose-100 text-rose-700'}`}>
                                            {listing.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500 font-medium">
                                        {new Date(listing.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <button onClick={() => handleOpenModal(listing)} className="w-8 h-8 flex items-center justify-center rounded bg-cyan-500 text-white hover:bg-cyan-600 transition shadow-sm" title="Edit">
                                                <Edit3 className="h-3.5 w-3.5" />
                                            </button>
                                            <button onClick={() => handleDelete(listing.id)} className="w-8 h-8 flex items-center justify-center rounded bg-rose-500 text-white hover:bg-rose-600 transition shadow-sm" title="Delete">
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-700">{editingListing ? 'Edit Listing' : 'New Listing'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition">
                                <Plus className="h-6 w-6 rotate-45" />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Title</label>
                                    <input
                                        type="text"
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-cyan-400 focus:bg-white transition text-sm"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Price (₹)</label>
                                    <input
                                        type="number"
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-cyan-400 focus:bg-white transition text-sm"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Category</label>
                                    <select
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-cyan-400 focus:bg-white transition text-sm"
                                        value={formData.category_id}
                                        onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories?.map((cat: any) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</label>
                                    <select
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-cyan-400 focus:bg-white transition text-sm"
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Sold">Sold</option>
                                        <option value="Suspended">Suspended</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Location</label>
                                <input
                                    type="text"
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-cyan-400 focus:bg-white transition text-sm"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Description</label>
                                <textarea
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-cyan-400 focus:bg-white transition text-sm h-28"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Images</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={e => setSelectedFiles(e.target.files)}
                                    className="w-full text-[13px] text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-[11px] file:font-bold file:bg-[#00B4D8] file:text-white hover:file:bg-[#0096B4] cursor-pointer"
                                />
                            </div>
                            <div className="flex gap-2 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-500 rounded-lg font-bold text-sm hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="flex-1 py-2.5 bg-[#00B4D8] text-white rounded-lg font-bold text-sm hover:bg-[#0096B4] transition shadow-sm">
                                    {editingListing ? 'Update Listing' : 'Create Listing'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

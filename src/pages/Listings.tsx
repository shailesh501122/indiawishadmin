import React, { useState } from 'react';
import { useGetAdminListingsQuery, useCreateListingMutation, useUpdateListingMutation, useDeleteListingMutation } from '../store/dashboardApiSlice';
import { useGetCategoriesQuery } from '../store/configApiSlice';
import { Plus, Trash2, Edit3, X, Check, Search, RotateCw, List, Download, ShoppingBag, ChevronRight } from 'lucide-react';

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
        subcategory_id: '',
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
                subcategory_id: listing.subcategory_id || '',
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
                subcategory_id: '',
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

            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-50 bg-gray-50/30 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                            <ShoppingBag className="h-5 w-5 text-[#00B4D8]" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-800">Product Listings</p>
                            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Manage marketplace inventory</p>
                        </div>
                    </div>
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search listings..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-cyan-50 focus:border-cyan-400 transition-all font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100 uppercase-headers">
                        <thead>
                            <tr className="bg-white">
                                <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Listing Info</th>
                                <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Price & Category</th>
                                <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Date</th>
                                <th className="px-6 py-4 text-right text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {filteredListings?.map((listing: any, index: number) => (
                                <tr key={listing.id} className="group hover:bg-cyan-50/30 transition-all duration-300">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                                                {listing.images?.length > 0 ? (
                                                    <img
                                                        src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${listing.images[0]}`}
                                                        alt={listing.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <RotateCw className="h-5 w-5 text-gray-200" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-sm font-bold text-gray-800 truncate max-w-[200px]">{listing.title}</div>
                                                <div className="text-[10px] text-gray-400 font-mono mt-0.5">ID: {listing.id?.substring(0, 8)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-black text-cyan-600">₹{listing.price?.toLocaleString()}</div>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{listing.category_name}</span>
                                            {listing.subcategory && (
                                                <>
                                                    <ChevronRight className="h-2 w-2 text-gray-300" />
                                                    <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-tight">{listing.subcategory}</span>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 inline-flex text-[10px] font-black rounded-lg uppercase tracking-widest border
                                            ${listing.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                listing.status === 'Sold' ? 'bg-gray-50 text-gray-500 border-gray-100' :
                                                    'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                            {listing.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-[11px] text-gray-400 font-bold uppercase tracking-widest">
                                        {new Date(listing.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <button onClick={() => handleOpenModal(listing)} className="p-2.5 bg-white border border-gray-100 text-gray-400 hover:text-cyan-600 hover:border-cyan-200 rounded-xl transition-all shadow-sm">
                                                <Edit3 className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => handleDelete(listing.id)} className="p-2.5 bg-white border border-gray-100 text-gray-400 hover:text-rose-600 hover:border-rose-200 rounded-xl transition-all shadow-sm">
                                                <Trash2 className="h-4 w-4" />
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
                                        onChange={e => setFormData({ ...formData, category_id: e.target.value, subcategory_id: '' })}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories?.map((cat: any) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Subcategory</label>
                                    <select
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-cyan-400 focus:bg-white transition text-sm"
                                        value={formData.subcategory_id}
                                        onChange={e => setFormData({ ...formData, subcategory_id: e.target.value })}
                                        disabled={!formData.category_id}
                                    >
                                        <option value="">Select Subcategory</option>
                                        {categories?.find((c: any) => c.id === formData.category_id)?.subcategory_list?.map((sub: any) => (
                                            <option key={sub.id} value={sub.id}>{sub.name}</option>
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

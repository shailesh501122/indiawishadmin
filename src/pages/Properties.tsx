import React, { useState } from 'react';
import { useGetAdminPropertiesQuery, useCreatePropertyMutation, useUpdatePropertyMutation, useDeletePropertyMutation, Property } from '../store/dashboardApiSlice';
import { Plus, Trash2, Edit3, X, Check, Home, Search, RotateCw, List, Download } from 'lucide-react';

export const Properties = () => {
    const { data: properties, isLoading } = useGetAdminPropertiesQuery(undefined);
    const [createProperty] = useCreatePropertyMutation();
    const [updateProperty] = useUpdatePropertyMutation();
    const [deleteProperty] = useDeletePropertyMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProperty, setEditingProperty] = useState<Property | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        type: 'Apartment',
        status: 'Active',
        address: '',
        city: '',
        area: '',
        bedrooms: '',
        bathrooms: '',
    });
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

    const handleOpenModal = (prop: Property | null = null) => {
        if (prop) {
            setEditingProperty(prop);
            setFormData({
                title: prop.title,
                description: prop.description,
                price: prop.price.toString(),
                type: prop.type,
                status: prop.status,
                address: prop.address || '',
                city: prop.city || '',
                area: prop.area?.toString() || '',
                bedrooms: prop.bedrooms?.toString() || '',
                bathrooms: prop.bathrooms?.toString() || '',
            });
        } else {
            setEditingProperty(null);
            setFormData({
                title: '',
                description: '',
                price: '',
                type: 'Apartment',
                status: 'Active',
                address: '',
                city: '',
                area: '',
                bedrooms: '',
                bathrooms: '',
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== '') data.append(key, value);
        });
        if (selectedFiles) {
            Array.from(selectedFiles).forEach(file => {
                data.append('images_files', file);
            });
        }

        try {
            if (editingProperty) {
                await updateProperty({ id: editingProperty.id, data }).unwrap();
            } else {
                await createProperty(data).unwrap();
            }
            setIsModalOpen(false);
        } catch (err) {
            console.error('Failed to save property:', err);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this property?')) {
            try {
                await deleteProperty(id).unwrap();
            } catch (err) {
                console.error('Failed to delete property:', err);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#00B4D8] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-bold tracking-tight">Loading real estate records...</p>
                </div>
            </div>
        );
    }

    const filteredProperties = properties?.filter((p: any) =>
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.city?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full max-w-[1400px] mx-auto p-2 sm:p-6 bg-gray-50/50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold text-gray-700">Properties</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center px-4 py-2 bg-[#00B4D8] text-white rounded-md text-sm font-medium hover:bg-[#0096B4] transition shadow-sm"
                >
                    <Plus className="h-4 w-4 mr-1.5" />
                    New Property
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 flex flex-col sm:flex-row justify-end items-center gap-2">
                    <div className="relative w-full sm:w-64">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-3 pr-10 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-cyan-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex items-center border border-gray-200 rounded overflow-hidden">
                        <button className="p-2 border-r border-gray-200 hover:bg-gray-50 text-gray-400 group"><RotateCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" /></button>
                        <button className="p-2 border-r border-gray-200 hover:bg-gray-50 text-gray-400"><List className="h-4 w-4" /></button>
                        <button className="p-2 hover:bg-gray-50 text-gray-400"><Download className="h-4 w-4" /></button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100 uppercase-headers">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest border-r border-gray-100 last:border-0 w-16">ID</th>
                                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest border-r border-gray-100 last:border-0">Property Details</th>
                                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest border-r border-gray-100 last:border-0">Location / Type</th>
                                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest border-r border-gray-100 last:border-0">Price Details</th>
                                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest border-r border-gray-100 last:border-0 w-24">Status</th>
                                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-outfit">
                            {filteredProperties?.map((prop: Property, index: number) => (
                                <tr key={prop.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'} hover:bg-cyan-50/30 transition-colors`}>
                                    <td className="px-4 py-4 text-xs text-gray-500 font-mono">{prop.id?.substring(0, 4)}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-9 w-9 bg-indigo-50 text-[#00B4D8] rounded-lg flex items-center justify-center border border-indigo-100 shadow-sm">
                                                <Home className="h-4 w-4" />
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{prop.title}</div>
                                                <div className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Real Estate</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-gray-900">{prop.city || 'N/A'}</div>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-tight">{prop.type}</div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="text-sm font-black text-emerald-600">₹{prop.price?.toLocaleString()}</div>
                                        <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{prop.area} sqft</div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 inline-flex text-[10px] leading-4 font-bold rounded-lg uppercase tracking-wider
                                            ${prop.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                                                prop.status === 'Pending Approval' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-rose-100 text-rose-700'}`}>
                                            {prop.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <button onClick={() => handleOpenModal(prop)} className="w-8 h-8 flex items-center justify-center rounded bg-cyan-500 text-white hover:bg-cyan-600 transition shadow-sm" title="Edit">
                                                <Edit3 className="h-3.5 w-3.5" />
                                            </button>
                                            <button onClick={() => handleDelete(prop.id)} className="w-8 h-8 flex items-center justify-center rounded bg-rose-500 text-white hover:bg-rose-600 transition shadow-sm" title="Delete">
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {(!properties || properties.length === 0) && (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 bg-gray-50 flex items-center justify-center rounded-2xl mx-auto mb-4">
                            <Home className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No properties found</h3>
                        <p className="text-gray-500">The property inventory is currently empty.</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-700">{editingProperty ? 'Edit Property' : 'New Property'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition">
                                <Plus className="h-6 w-6 rotate-45" />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Title</label>
                                    <input type="text" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-cyan-400 focus:bg-white transition text-sm" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Price (₹)</label>
                                    <input type="number" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-cyan-400 focus:bg-white transition text-sm" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Type</label>
                                    <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-cyan-400 focus:bg-white transition text-sm" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                        <option value="Apartment">Apartment</option>
                                        <option value="Villa">Villa</option>
                                        <option value="House">House</option>
                                        <option value="Plot">Plot</option>
                                        <option value="Commercial">Commercial</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</label>
                                    <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-cyan-400 focus:bg-white transition text-sm" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                        <option value="Active">Active</option>
                                        <option value="Pending">Pending Approval</option>
                                        <option value="Sold">Sold</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">City</label>
                                    <input type="text" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-cyan-400 focus:bg-white transition text-sm" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Area (sqft)</label>
                                    <input type="number" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-cyan-400 focus:bg-white transition text-sm" value={formData.area} onChange={e => setFormData({ ...formData, area: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Description</label>
                                <textarea className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-cyan-400 focus:bg-white transition text-sm h-24" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Images</label>
                                <input type="file" multiple accept="image/*" onChange={e => setSelectedFiles(e.target.files)} className="w-full text-[13px] text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-[11px] file:font-bold file:bg-[#00B4D8] file:text-white hover:file:bg-[#0096B4] cursor-pointer" />
                            </div>
                            <div className="flex gap-2 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-500 rounded-lg font-bold text-sm hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="flex-1 py-2.5 bg-[#00B4D8] text-white rounded-lg font-bold text-sm hover:bg-[#0096B4] transition shadow-sm">
                                    {editingProperty ? 'Update Property' : 'Create Property'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

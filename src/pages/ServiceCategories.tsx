import React, { useState } from 'react';
import {
    useGetServiceCategoriesQuery,
    useCreateServiceCategoryMutation,
    useUpdateServiceCategoryMutation,
    useDeleteServiceCategoryMutation
} from '../store/adminApiSlice';
import {
    Plus, Edit3, Trash2, List, RotateCw, Download,
    Search, Check, X, Image as ImageIcon, Briefcase
} from 'lucide-react';

export const ServiceCategories = () => {
    const { data: categories, isLoading, refetch } = useGetServiceCategoriesQuery();
    const [createCategory] = useCreateServiceCategoryMutation();
    const [updateCategory] = useUpdateServiceCategoryMutation();
    const [deleteCategory] = useDeleteServiceCategoryMutation();

    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '', active_status: true });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formDataToSubmit = new FormData();
            formDataToSubmit.append('name', formData.name);
            formDataToSubmit.append('description', formData.description);
            // formDataToSubmit.append('active_status', String(formData.active_status)); // Optional: based on backend handling

            if (selectedFile) {
                formDataToSubmit.append('icon_file', selectedFile);
            }

            if (editingId) {
                await updateCategory({ id: editingId, data: formDataToSubmit }).unwrap();
                setEditingId(null);
            } else {
                await createCategory(formDataToSubmit).unwrap();
                setIsAdding(false);
            }

            resetForm();
        } catch (err) {
            console.error('Failed to save service category:', err);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', active_status: true });
        setSelectedFile(null);
        setPreviewUrl(null);
        setEditingId(null);
        setIsAdding(false);
    };

    const startEdit = (cat: any) => {
        setEditingId(cat.id);
        setFormData({
            name: cat.name,
            description: cat.description || '',
            active_status: cat.active_status
        });
        setPreviewUrl(cat.icon ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${cat.icon}` : null);
        setSelectedFile(null);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this service category?')) {
            try {
                await deleteCategory(id).unwrap();
            } catch (err) {
                console.error('Failed to delete service category:', err);
            }
        }
    };

    const toggleStatus = async (cat: any) => {
        try {
            const formDataToSubmit = new FormData();
            formDataToSubmit.append('active_status', String(!cat.active_status));
            await updateCategory({ id: cat.id, data: formDataToSubmit }).unwrap();
        } catch (err) {
            console.error('Failed to toggle status:', err);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-bold tracking-tight">Loading Service Categories...</p>
                </div>
            </div>
        );
    }

    const filteredCategories = categories?.filter(cat =>
        cat.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full max-w-[1400px] mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 font-outfit tracking-tight">Service Categories</h1>
                    <p className="text-gray-500 text-sm mt-1 font-medium">Manage professional service types and icons</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsAdding(true); }}
                    className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    New Category
                </button>
            </div>

            <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative w-full md:w-96 group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search categories by name..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 focus:ring-2 focus:ring-indigo-500/20 rounded-2xl text-sm font-medium transition-all outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => refetch()}
                            className="p-3 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 transition-colors active:scale-90"
                            title="Refresh data"
                        >
                            <RotateCw className="h-5 w-5" />
                        </button>
                        <button className="p-3 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 transition-colors active:scale-90">
                            <Download className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead>
                            <tr className="bg-gray-50/30">
                                <th className="px-8 py-5 text-left text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Category Info</th>
                                <th className="px-8 py-5 text-left text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Icon Preview</th>
                                <th className="px-8 py-5 text-left text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Description</th>
                                <th className="px-8 py-5 text-left text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-5 text-right text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredCategories?.map((cat: any) => (
                                <tr key={cat.id} className="hover:bg-indigo-50/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm transition-transform group-hover:scale-110">
                                                <Briefcase className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="font-outfit font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{cat.name}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">ID: {cat.id?.substring(0, 8)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="w-14 h-14 bg-white rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden p-2 shadow-sm group-hover:shadow-md transition-all">
                                            {cat.icon ? (
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${cat.icon}`}
                                                    alt={cat.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <ImageIcon className="h-7 w-7 text-gray-200" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm text-gray-500 max-w-xs line-clamp-2 font-medium">
                                            {cat.description || <span className="text-gray-300 italic">No description provided</span>}
                                        </p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <button
                                            onClick={() => toggleStatus(cat)}
                                            className={`flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all shadow-sm ${cat.active_status
                                                    ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                                                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                                }`}
                                        >
                                            {cat.active_status ? <Check className="h-3 w-3 mr-1.5" /> : <X className="h-3 w-3 mr-1.5" />}
                                            {cat.active_status ? 'Active' : 'Hidden'}
                                        </button>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => startEdit(cat)}
                                                className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm active:scale-90"
                                                title="Edit Category"
                                            >
                                                <Edit3 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat.id)}
                                                className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm active:scale-90"
                                                title="Delete Category"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredCategories?.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 px-8">
                            <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-4">
                                <Search className="h-8 w-8 text-gray-300" />
                            </div>
                            <h3 className="text-gray-900 font-black font-outfit text-xl">No categories found</h3>
                            <p className="text-gray-400 text-center mt-2 max-w-sm font-medium">Try adjusting your search query or add a new category to get started.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Premium Modal for Add/Edit */}
            {(isAdding || editingId) && (
                <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-[100] p-4 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 ring-1 ring-white/20">
                        <div className="bg-gray-50/50 px-10 py-8 flex justify-between items-center border-b border-gray-100">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 font-outfit tracking-tight">
                                    {editingId ? 'Modify Category' : 'Create New Category'}
                                </h2>
                                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mt-1">
                                    {editingId ? 'Edit existing service type details' : 'Configure a new service offering'}
                                </p>
                            </div>
                            <button
                                onClick={resetForm}
                                className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100 rounded-2xl transition-all shadow-sm active:scale-90"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-10 space-y-8">
                            <div className="space-y-6">
                                <div className="group">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1 group-focus-within:text-indigo-500 transition-colors">Category Name</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="e.g. Interior Design, Web Development"
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl outline-none font-bold text-gray-900 placeholder:text-gray-300 transition-all"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1 group-focus-within:text-indigo-500 transition-colors">Short Description</label>
                                    <textarea
                                        placeholder="Describe the types of services included in this category..."
                                        className="w-full p-4 bg-gray-50 border-0 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl outline-none font-bold text-gray-900 placeholder:text-gray-300 transition-all h-32 resize-none"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="group">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1 group-focus-within:text-indigo-500 transition-colors">Visual Icon</label>
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 h-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-indigo-400 bg-center bg-no-repeat relative">
                                            {previewUrl ? (
                                                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain p-2" />
                                            ) : (
                                                <ImageIcon className="h-8 w-8 text-gray-300" />
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-gray-700">Recommended Size</p>
                                            <p className="text-[11px] font-medium text-gray-400 mt-1">Upload a PNG or SVG icon with a transparent background. Max size 2MB.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 py-4 px-6 border border-gray-100 text-gray-500 rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-3 py-4 px-10 bg-indigo-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
                                >
                                    {editingId ? 'Update Identity' : 'Save Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

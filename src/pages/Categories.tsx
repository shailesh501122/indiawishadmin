import React, { useState } from 'react';
import {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useCreateSubcategoryMutation,
    useUpdateSubcategoryMutation,
    useDeleteSubcategoryMutation
} from '../store/configApiSlice';
import { Plus, Edit3, Trash2, List, Search, RotateCw, Download, ChevronRight, Settings, X, Layers } from 'lucide-react';

export const Categories = () => {
    const { data: categories, isLoading } = useGetCategoriesQuery();
    const [createCategory] = useCreateCategoryMutation();
    const [updateCategory] = useUpdateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();

    const [createSubcategory] = useCreateSubcategoryMutation();
    const [updateSubcategory] = useUpdateSubcategoryMutation();
    const [deleteSubcategory] = useDeleteSubcategoryMutation();

    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '', icon: '' });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Subcategory management state
    const [managingSubcatCatId, setManagingSubcatCatId] = useState<string | null>(null);
    const [subcatFormData, setSubcatFormData] = useState({ name: '' });
    const [editingSubcatId, setEditingSubcatId] = useState<string | null>(null);
    const [selectedSubcatFile, setSelectedSubcatFile] = useState<File | null>(null);
    const [subcatPreviewUrl, setSubcatPreviewUrl] = useState<string | null>(null);

    const handleSubcatFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedSubcatFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setSubcatPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

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
            setFormData({ name: '', description: '', icon: '' });
            setSelectedFile(null);
            setPreviewUrl(null);
        } catch (err) {
            console.error('Failed to save category:', err);
        }
    };

    const handleSubcatSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!managingSubcatCatId) return;
        try {
            const formDataToSubmit = new FormData();
            formDataToSubmit.append('name', subcatFormData.name);
            if (selectedSubcatFile) {
                formDataToSubmit.append('icon_file', selectedSubcatFile);
            }

            if (editingSubcatId) {
                await updateSubcategory({ id: editingSubcatId, data: formDataToSubmit }).unwrap();
                setEditingSubcatId(null);
            } else {
                formDataToSubmit.append('category_id', managingSubcatCatId);
                await createSubcategory(formDataToSubmit).unwrap();
            }
            setSubcatFormData({ name: '' });
            setSelectedSubcatFile(null);
            setSubcatPreviewUrl(null);
        } catch (err) {
            console.error('Failed to save subcategory:', err);
        }
    };

    const startEdit = (cat: any) => {
        setEditingId(cat.id);
        setFormData({ name: cat.name, description: cat.description || '', icon: cat.icon || '' });
        setPreviewUrl(cat.icon ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${cat.icon}` : null);
        setSelectedFile(null);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await deleteCategory(id).unwrap();
            } catch (err) {
                console.error('Failed to delete category:', err);
            }
        }
    };

    const startSubcatEdit = (sub: any) => {
        setEditingSubcatId(sub.id);
        setSubcatFormData({ name: sub.name });
        setSubcatPreviewUrl(sub.icon ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${sub.icon}` : null);
        setSelectedSubcatFile(null);
    };

    const handleSubcatDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this subcategory?')) {
            try {
                await deleteSubcategory(id).unwrap();
            } catch (err) {
                console.error('Failed to delete subcategory:', err);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-bold tracking-tight">Loading Categories...</p>
                </div>
            </div>
        );
    }

    const filteredCategories = categories?.filter(cat =>
        cat.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const currentCatForSubcat = categories?.find(c => c.id === managingSubcatCatId);

    return (
        <div className="w-full max-w-[1400px] mx-auto p-2 sm:p-6 bg-gray-50/50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold text-gray-700">Categories</h1>
                <button
                    onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ name: '', description: '', icon: '' }); setPreviewUrl(null); setSelectedFile(null); }}
                    className="flex items-center px-4 py-2 bg-[#00B4D8] text-white rounded-md text-sm font-medium hover:bg-[#0096B4] transition shadow-sm"
                >
                    <Plus className="h-4 w-4 mr-1.5" />
                    Add Category
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-50 bg-gray-50/30 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                            <Layers className="h-5 w-5 text-cyan-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-800">Available Categories</p>
                            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Manage your marketplace structure</p>
                        </div>
                    </div>
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-cyan-50 focus:border-cyan-400 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100 uppercase-headers">
                        <thead>
                            <tr className="bg-white">
                                <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Category</th>
                                <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Structure</th>
                                <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Visibility</th>
                                <th className="px-6 py-4 text-right text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {filteredCategories?.map((cat: any, index: number) => (
                                <tr key={cat.id} className="group hover:bg-cyan-50/30 transition-all duration-300">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden p-2 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                                {cat.icon ? (
                                                    <img
                                                        src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${cat.icon}`}
                                                        alt={cat.name}
                                                        className="w-full h-full object-contain"
                                                    />
                                                ) : (
                                                    <RotateCw className="h-5 w-5 text-gray-300" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-gray-800">{cat.name}</div>
                                                <div className="text-[11px] text-gray-400 max-w-[200px] truncate">{cat.description || 'No description provided'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="inline-flex items-center px-3 py-1 bg-cyan-50 text-cyan-700 rounded-lg text-[11px] font-bold border border-cyan-100/50">
                                            <List className="h-3 w-3 mr-1.5 opacity-60" />
                                            {cat.subcategory_list?.length || 0} Subcategories
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" checked={cat.active_status} readOnly />
                                            <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500 shadow-inner"></div>
                                        </label>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setManagingSubcatCatId(cat.id)}
                                                className="px-4 py-1.5 bg-white border border-gray-200 text-gray-600 hover:text-cyan-600 hover:border-cyan-200 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 group/btn"
                                            >
                                                <Settings className="h-3.5 w-3.5 group-hover/btn:rotate-90 transition-transform" />
                                                Manage
                                            </button>
                                            <div className="w-px h-4 bg-gray-100 mx-1"></div>
                                            <button onClick={() => startEdit(cat)} className="p-2 text-gray-400 hover:text-cyan-600 transition-colors" title="Edit">
                                                <Edit3 className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => handleDelete(cat.id)} className="p-2 text-gray-400 hover:text-rose-600 transition-colors" title="Delete">
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

            {/* Modal for Add/Edit Category */}
            {(isAdding || editingId) && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-700">{editingId ? 'Edit Category' : 'New Category'}</h2>
                            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-600 transition">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Name</label>
                                <input
                                    type="text"
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-cyan-400 focus:bg-white transition"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Description</label>
                                <textarea
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-cyan-400 focus:bg-white transition h-20"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Icon</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full text-[13px] text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-[11px] file:font-bold file:bg-[#00B4D8] file:text-white hover:file:bg-[#0096B4] cursor-pointer"
                                />
                                {previewUrl && (
                                    <div className="mt-3 flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-100">
                                        <img src={previewUrl} alt="Preview" className="w-10 h-10 rounded object-contain bg-white border border-gray-200" />
                                        <span className="text-[11px] font-medium text-gray-400 uppercase">Preview</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); }} className="flex-1 py-2.5 border border-gray-200 text-gray-500 rounded-lg font-bold text-sm hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="flex-1 py-2.5 bg-[#00B4D8] text-white rounded-lg font-bold text-sm hover:bg-[#0096B4] transition shadow-sm">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal for Subcategory Management */}
            {managingSubcatCatId && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-5 flex justify-between items-center border-b border-gray-100">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">Manage Subcategories</h2>
                                <p className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest mt-0.5">Parent: {currentCatForSubcat?.name}</p>
                            </div>
                            <button onClick={() => { setManagingSubcatCatId(null); setEditingSubcatId(null); setSubcatFormData({ name: '' }); }} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-400 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            {/* Subcategory Form Section */}
                            <div className="mb-8">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Add or Edit Subcategory</h3>
                                <form onSubmit={handleSubcatSave} className="p-4 bg-gray-50/80 rounded-xl border border-dashed border-gray-200 space-y-4">
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                placeholder="Subcategory Name (e.g. Mobile, Laptops)"
                                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50 transition text-sm font-medium"
                                                value={subcatFormData.name}
                                                onChange={e => setSubcatFormData({ name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="px-6 py-2.5 bg-cyan-600 text-white rounded-lg text-sm font-bold hover:bg-cyan-700 transition shadow-lg shadow-cyan-200 whitespace-nowrap">
                                            {editingSubcatId ? 'Save Changes' : 'Add Item'}
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="flex-1">
                                            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100/50 transition bg-white/50">
                                                <div className="flex flex-col items-center justify-center pt-2 pb-2">
                                                    <Download className="h-5 w-5 text-gray-300 mb-2" />
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                        {selectedSubcatFile ? selectedSubcatFile.name : 'Choose Icon'}
                                                    </p>
                                                </div>
                                                <input type="file" accept="image/*" onChange={handleSubcatFileChange} className="hidden" />
                                            </label>
                                        </div>

                                        {subcatPreviewUrl && (
                                            <div className="relative group">
                                                <div className="w-24 h-24 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center overflow-hidden p-2">
                                                    <img src={subcatPreviewUrl} alt="Preview" className="w-full h-full object-contain" />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => { setSelectedSubcatFile(null); setSubcatPreviewUrl(null); }}
                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-rose-600 opacity-0 group-hover:opacity-100 transition"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {editingSubcatId && (
                                        <button
                                            type="button"
                                            onClick={() => { setEditingSubcatId(null); setSubcatFormData({ name: '' }); setSubcatPreviewUrl(null); setSelectedSubcatFile(null); }}
                                            className="w-full py-2 text-gray-500 font-bold text-xs uppercase tracking-widest hover:text-gray-700 underline underline-offset-4"
                                        >
                                            Cancel Editing
                                        </button>
                                    )}
                                </form>
                            </div>

                            {/* Subcategory List Section */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center justify-between">
                                    Current Subcategories
                                    <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[9px] font-mono">{currentCatForSubcat?.subcategory_list?.length || 0}</span>
                                </h3>

                                <div className="grid grid-cols-1 gap-3">
                                    {(currentCatForSubcat?.subcategory_list && currentCatForSubcat.subcategory_list.length > 0) ? (
                                        currentCatForSubcat.subcategory_list.map((sub: any) => (
                                            <div key={sub.id} className="group p-4 bg-white border border-gray-100 rounded-2xl hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-100/30 transition-all duration-300 flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden p-2 group-hover:bg-cyan-50/50 transition-colors">
                                                    {sub.icon ? (
                                                        <img
                                                            src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${sub.icon}`}
                                                            alt={sub.name}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    ) : (
                                                        <Layers className="h-5 w-5 text-gray-300" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-[13px] font-black text-gray-800 tracking-tight">{sub.name}</h4>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className={`w-1.5 h-1.5 rounded-full ${sub.active_status ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{sub.active_status ? 'Active' : 'Hidden'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => startSubcatEdit(sub)}
                                                        className="p-2.5 bg-gray-50 text-gray-400 hover:bg-cyan-500 hover:text-white rounded-xl transition-all duration-300"
                                                    >
                                                        <Edit3 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleSubcatDelete(sub.id)}
                                                        className="p-2.5 bg-gray-50 text-gray-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all duration-300"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-16 flex flex-col items-center justify-center text-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200 transition-all">
                                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
                                                <Plus className="h-8 w-8 text-cyan-200" />
                                            </div>
                                            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">No Subcategories</p>
                                            <p className="text-xs text-gray-300 mt-1">Start adding structure to your category</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="bg-white px-8 py-5 border-t border-gray-100 flex justify-between items-center">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Changes are saved automatically</p>
                            <button
                                onClick={() => { setManagingSubcatCatId(null); setEditingSubcatId(null); setSubcatFormData({ name: '' }); }}
                                className="px-8 py-2.5 bg-gray-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-95"
                            >
                                Close Modal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

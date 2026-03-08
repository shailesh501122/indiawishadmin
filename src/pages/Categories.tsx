import React, { useState } from 'react';
import { useGetCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } from '../store/configApiSlice';
import { Plus, Edit3, Trash2, List, Search, RotateCw, Download, ChevronRight, Settings } from 'lucide-react';

export const Categories = () => {
    const { data: categories, isLoading } = useGetCategoriesQuery();
    const [createCategory] = useCreateCategoryMutation();
    const [updateCategory] = useUpdateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();

    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '', icon: '' });
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

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-50">
                    <button className="text-[#00B4D8] text-sm font-medium flex items-center hover:underline">
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Set Order of Categories
                    </button>
                </div>

                <div className="p-4 flex flex-col sm:flex-row justify-end items-center gap-2">
                    <div className="relative w-full sm:w-64">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-3 pr-10 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-cyan-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
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
                                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest border-r border-gray-100 last:border-0 w-16">ID <span className="inline-block scale-75 ml-0.5">↕</span></th>
                                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest border-r border-gray-100 last:border-0">Name <span className="inline-block scale-75 ml-0.5">↕</span></th>
                                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest border-r border-gray-100 last:border-0 w-24">Image</th>
                                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest border-r border-gray-100 last:border-0">Subcategories</th>
                                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest border-r border-gray-100 last:border-0">Custom Fields</th>
                                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest border-r border-gray-100 last:border-0">Advertisement Count <span className="inline-block scale-75 ml-0.5">↕</span></th>
                                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest border-r border-gray-100 last:border-0 w-24">Active</th>
                                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredCategories?.map((cat: any, index: number) => (
                                <tr key={cat.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'} hover:bg-cyan-50/30 transition-colors`}>
                                    <td className="px-4 py-4 text-sm text-gray-500">{cat.id?.substring(0, 4)}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center text-[#06B6D4] font-medium text-sm">
                                            <div className="w-5 h-5 rounded border border-[#06B6D4] flex items-center justify-center mr-2 bg-white">
                                                <Plus className="h-3 w-3" />
                                            </div>
                                            {cat.name}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="w-12 h-12 bg-white rounded border border-gray-100 flex items-center justify-center overflow-hidden p-1 shadow-sm">
                                            {cat.icon ? (
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${cat.icon}`}
                                                    alt={cat.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <RotateCw className="h-6 w-6 text-gray-200" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-[13px] text-gray-600">0 Subcategories</td>
                                    <td className="px-4 py-4 text-[13px] text-gray-600">0 Custom Fields</td>
                                    <td className="px-4 py-4 text-center text-sm font-medium text-gray-500">0</td>
                                    <td className="px-4 py-4">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                                        </label>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <button onClick={() => startEdit(cat)} className="w-8 h-8 flex items-center justify-center rounded bg-cyan-500 text-white hover:bg-cyan-600 transition shadow-sm">
                                                <Edit3 className="h-3.5 w-3.5" />
                                            </button>
                                            <button onClick={() => handleDelete(cat.id)} className="w-8 h-8 flex items-center justify-center rounded bg-rose-500 text-white hover:bg-rose-600 transition shadow-sm">
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                            <button className="w-8 h-8 flex items-center justify-center rounded bg-zinc-500 text-white hover:bg-zinc-600 transition shadow-sm">
                                                <List className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Add/Edit */}
            {(isAdding || editingId) && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-700">{editingId ? 'Edit Category' : 'New Category'}</h2>
                            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-600 transition">
                                <Plus className="h-6 w-6 rotate-45" />
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
        </div>
    );
};

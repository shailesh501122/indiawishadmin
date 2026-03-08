import React, { useState } from 'react';
import { useGetConfigsQuery, useUpdateConfigMutation, useCreateConfigMutation } from '../store/configApiSlice';
import { Settings as SettingsIcon, Save, Palette, Key, Globe, Info, Plus } from 'lucide-react';

export const Settings = () => {
    const { data: configs, isLoading } = useGetConfigsQuery();
    const [updateConfig] = useUpdateConfigMutation();
    const [createConfig] = useCreateConfigMutation();

    const [isAdding, setIsAdding] = useState(false);
    const [newConfig, setNewConfig] = useState({ key: '', value: '', description: '' });

    const handleUpdate = async (key: string, value: string) => {
        try {
            await updateConfig({ key, value }).unwrap();
            alert(`Setting ${key} updated successfully!`);
        } catch (err) {
            console.error('Update failed:', err);
            alert('Failed to update setting.');
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createConfig(newConfig).unwrap();
            setIsAdding(false);
            setNewConfig({ key: '', value: '', description: '' });
        } catch (err) {
            console.error('Creation failed:', err);
        }
    };

    if (isLoading) return <div className="p-10 text-center text-gray-500 font-bold">Fetching system parameters...</div>;

    const sections = [
        { title: 'Branding & Aesthetics', icon: Palette, keys: ['primary_color', 'secondary_color', 'accent_color'] },
        { title: 'API Integrations', icon: Key, keys: ['google_maps_api_key', 'firebase_server_key'] },
        { title: 'Regional Settings', icon: Globe, keys: ['default_location', 'currency_symbol'] },
    ];

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight font-outfit">System Configuration</h1>
                    <p className="text-gray-500 font-medium">Manage global application variables and security keys.</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold flex items-center shadow-lg shadow-indigo-600/20 hover:scale-105 transition-transform"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Parameter
                </button>
            </div>

            {isAdding && (
                <div className="mb-8 bg-indigo-50 border border-indigo-100 p-6 rounded-2xl animate-in zoom-in-95 duration-200">
                    <h3 className="text-indigo-900 font-bold mb-4">New Configuration Key</h3>
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text" placeholder="Key (e.g. primary_color)"
                            className="p-3 bg-white rounded-xl border-0 focus:ring-2 focus:ring-indigo-600 outline-none text-sm font-bold"
                            value={newConfig.key} onChange={e => setNewConfig({ ...newConfig, key: e.target.value })}
                            required
                        />
                        <input
                            type="text" placeholder="Value (e.g. #FF5733)"
                            className="p-3 bg-white rounded-xl border-0 focus:ring-2 focus:ring-indigo-600 outline-none text-sm"
                            value={newConfig.value} onChange={e => setNewConfig({ ...newConfig, value: e.target.value })}
                            required
                        />
                        <input
                            type="text" placeholder="Short Description"
                            className="p-3 bg-white rounded-xl border-0 focus:ring-2 focus:ring-indigo-600 outline-none text-sm"
                            value={newConfig.description} onChange={e => setNewConfig({ ...newConfig, description: e.target.value })}
                        />
                        <div className="md:col-span-3 flex justify-end space-x-3">
                            <button type="button" onClick={() => setIsAdding(false)} className="text-indigo-600 font-bold px-4 py-2 hover:bg-white/50 rounded-xl transition">Discard</button>
                            <button type="submit" className="bg-indigo-600 text-white font-black px-6 py-2 rounded-xl shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700">Enable Parameter</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-8">
                {sections.map(section => (
                    <div key={section.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center">
                            <section.icon className="w-5 h-5 text-indigo-600 mr-3" />
                            <h2 className="font-black text-gray-900 uppercase tracking-widest text-[11px]">{section.title}</h2>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {section.keys.map(key => {
                                const config = configs?.find((c: any) => c.key === key);
                                return (
                                    <div key={key} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gray-50/30 transition-colors">
                                        <div className="flex-grow max-w-md">
                                            <div className="flex items-center mb-1">
                                                <span className="text-sm font-black text-gray-900 uppercase tracking-tight mr-2">{key.replace(/_/g, ' ')}</span>
                                                <span className="px-2 py-0.5 bg-gray-100 text-[10px] font-bold text-gray-500 rounded-md font-mono">{key}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 font-medium">
                                                {config?.description || `Set the ${key.replace(/_/g, ' ')} for the application.`}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="relative group min-w-[300px]">
                                                <input
                                                    type="text"
                                                    defaultValue={config?.value || ''}
                                                    id={`config-${key}`}
                                                    placeholder="Not configured"
                                                    className="w-full pl-4 pr-4 py-3 bg-gray-50 border-gray-100 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-600/10 outline-none transition-all group-hover:border-indigo-100"
                                                />
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const val = (document.getElementById(`config-${key}`) as HTMLInputElement).value;
                                                    handleUpdate(key, val);
                                                }}
                                                className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-300"
                                                title="Save Changes"
                                            >
                                                <Save className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Other settings that didn't fit into sections */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center">
                        <Info className="w-5 h-5 text-gray-400 mr-3" />
                        <h2 className="font-black text-gray-900 uppercase tracking-widest text-[11px]">System Metadata</h2>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {configs?.filter((c: any) => !sections.some(s => s.keys.includes(c.key))).map((config: any) => (
                            <div key={config.key} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex-grow max-w-md">
                                    <div className="flex items-center mb-1">
                                        <span className="text-sm font-black text-gray-900 uppercase tracking-tight mr-2">{config.key.replace(/_/g, ' ')}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 font-medium">{config.description || 'No description provided.'}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="text" defaultValue={config.value}
                                        id={`config-${config.key}`}
                                        className="w-full min-w-[300px] pl-4 pr-4 py-3 bg-gray-50 border-gray-100 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-600/10 outline-none transition-all"
                                    />
                                    <button
                                        onClick={() => handleUpdate(config.key, (document.getElementById(`config-${config.key}`) as HTMLInputElement).value)}
                                        className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
                                    >
                                        <Save className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

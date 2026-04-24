import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/api/admin';
const PRESET_COLORS = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16',
];
const emptyForm = { name: '', description: '', color_code: '#3B82F6', is_active: 1 };
export default function ThemesPage() {
    const qc = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [err, setErr] = useState('');
    const { data: themes = [], isLoading, error } = useQuery({
        queryKey: ['admin-themes'],
        queryFn: async () => {
            const result = await adminApi.getThemes();
            return Array.isArray(result) ? result : [];
        },
    });
    const createMutation = useMutation({
        mutationFn: adminApi.createTheme,
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-themes'] }); closeForm(); },
        onError: (e) => setErr(e?.response?.data?.detail ?? 'Failed to create theme'),
    });
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => adminApi.updateTheme(id, data),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-themes'] }); closeForm(); },
        onError: (e) => setErr(e?.response?.data?.detail ?? 'Failed to update theme'),
    });
    const deleteMutation = useMutation({
        mutationFn: adminApi.deleteTheme,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-themes'] }),
        onError: (e) => setErr(e?.response?.data?.detail ?? 'Failed to delete theme'),
    });
    const openCreate = () => { setEditing(null); setForm(emptyForm); setErr(''); setShowForm(true); };
    const openEdit = (t) => {
        setEditing(t);
        setForm({ name: t.name, description: t.description ?? '', color_code: t.color_code, is_active: t.is_active });
        setErr('');
        setShowForm(true);
    };
    const closeForm = () => { setShowForm(false); setEditing(null); setForm(emptyForm); setErr(''); };
    const handleSubmit = () => {
        if (!form.name.trim()) {
            setErr('Name is required');
            return;
        }
        if (editing) {
            updateMutation.mutate({ id: editing.id, data: form });
        }
        else {
            createMutation.mutate(form);
        }
    };
    const handleDelete = (t) => {
        if (confirm(`Delete theme "${t.name}"? Teams using this theme will have it unlinked.`)) {
            deleteMutation.mutate(t.id);
        }
    };
    const isPending = createMutation.isPending || updateMutation.isPending;
    return (_jsxs("div", { className: "max-w-4xl mx-auto space-y-5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Themes" }), _jsx("p", { className: "text-gray-500 text-sm mt-0.5", children: "Manage hackathon project themes" })] }), _jsx("button", { onClick: openCreate, className: "bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors", children: "+ Add Theme" })] }), err && !showForm && (_jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm", children: err })), error && (_jsxs("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm", children: ["Failed to load themes: ", error?.response?.data?.detail ?? error?.message] })), showForm && (_jsx("div", { className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900", children: editing ? 'Edit Theme' : 'Add Theme' }), err && _jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm", children: err }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Name *" }), _jsx("input", { type: "text", value: form.name, onChange: (e) => setForm((f) => ({ ...f, name: e.target.value })), placeholder: "e.g. Education, Fintech\u2026", className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Description" }), _jsx("textarea", { rows: 3, value: form.description, onChange: (e) => setForm((f) => ({ ...f, description: e.target.value })), placeholder: "Brief description of this theme\u2026", className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Color" }), _jsx("div", { className: "flex flex-wrap gap-2 mb-2", children: PRESET_COLORS.map((c) => (_jsx("button", { onClick: () => setForm((f) => ({ ...f, color_code: c })), style: { backgroundColor: c }, className: `w-7 h-7 rounded-full transition-transform ${form.color_code === c ? 'ring-2 ring-offset-2 ring-gray-800 scale-110' : 'hover:scale-105'}` }, c))) }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "color", value: form.color_code, onChange: (e) => setForm((f) => ({ ...f, color_code: e.target.value })), className: "w-8 h-8 rounded cursor-pointer border border-gray-300" }), _jsx("span", { className: "text-sm text-gray-500 font-mono", children: form.color_code })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", id: "is_active", checked: form.is_active === 1, onChange: (e) => setForm((f) => ({ ...f, is_active: e.target.checked ? 1 : 0 })), className: "w-4 h-4 text-indigo-600 rounded" }), _jsx("label", { htmlFor: "is_active", className: "text-sm font-medium text-gray-700 cursor-pointer", children: "Active (visible to participants)" })] }), _jsxs("div", { className: "flex gap-3 pt-2", children: [_jsx("button", { onClick: closeForm, className: "flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors", children: "Cancel" }), _jsx("button", { onClick: handleSubmit, disabled: isPending, className: "flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors", children: isPending ? 'Saving…' : editing ? 'Save Changes' : 'Create Theme' })] })] }) })), isLoading ? (_jsx("div", { className: "py-20 text-center text-gray-400", children: "Loading themes\u2026" })) : themes.length === 0 ? (_jsxs("div", { className: "bg-white rounded-xl border border-gray-200 py-16 text-center text-gray-400", children: [_jsx("p", { className: "text-4xl mb-3", children: "\uD83C\uDFA8" }), _jsx("p", { className: "font-medium", children: "No themes yet" }), _jsx("p", { className: "text-sm mt-1", children: "Add your first theme to get started" })] })) : (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: themes.map((t) => (_jsxs("div", { className: "bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-4", children: [_jsx("div", { className: "w-10 h-10 rounded-full shrink-0 mt-0.5", style: { backgroundColor: t.color_code } }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-semibold text-gray-900 truncate", children: t.name }), t.is_active ? (_jsx("span", { className: "text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full", children: "Active" })) : (_jsx("span", { className: "text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full", children: "Inactive" }))] }), t.description && _jsx("p", { className: "text-sm text-gray-500 mt-0.5 line-clamp-2", children: t.description }), _jsx("p", { className: "text-xs text-gray-400 font-mono mt-1", children: t.color_code })] }), _jsxs("div", { className: "flex gap-1 shrink-0", children: [_jsx("button", { onClick: () => openEdit(t), className: "p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-sm", children: "\u270F\uFE0F" }), _jsx("button", { onClick: () => handleDelete(t), disabled: deleteMutation.isPending, className: "p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm", children: "\uD83D\uDDD1\uFE0F" })] })] }, t.id))) }))] }));
}

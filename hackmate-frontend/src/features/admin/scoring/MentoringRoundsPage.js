import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scoringApi } from '@/api/scoring';
const emptyForm = { round_name: '', description: '', start_time: '', end_time: '', max_score: 100, is_active: true };
export default function AdminMentoringRoundsPage() {
    const qc = useQueryClient();
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editRound, setEditRound] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const { data: rounds = [], isLoading } = useQuery({
        queryKey: ['admin-rounds'],
        queryFn: scoringApi.getRounds,
    });
    const openCreate = () => { setForm(emptyForm); setEditRound(null); setShowForm(true); };
    const openEdit = (r) => {
        setForm({
            round_name: r.round_name,
            description: r.description ?? '',
            start_time: r.start_time?.slice(0, 16) ?? '',
            end_time: r.end_time?.slice(0, 16) ?? '',
            max_score: r.max_score,
            is_active: r.is_active,
        });
        setEditRound(r);
        setShowForm(true);
    };
    const save = useMutation({
        mutationFn: () => editRound
            ? scoringApi.updateRound(editRound.id, form)
            : scoringApi.createRound(form),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['admin-rounds'] });
            setMsg(editRound ? 'Round updated!' : 'Round created!');
            setShowForm(false);
            setEditRound(null);
            setTimeout(() => setMsg(''), 3000);
        },
        onError: (e) => setErr(e?.response?.data?.detail ?? 'Failed to save round'),
    });
    const remove = useMutation({
        mutationFn: (id) => scoringApi.deleteRound(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['admin-rounds'] });
            setDeleteId(null);
            setMsg('Round deleted');
            setTimeout(() => setMsg(''), 3000);
        },
        onError: () => setErr('Failed to delete round'),
    });
    const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
    const statusBadge = (r) => {
        const now = new Date();
        const start = r.start_time ? new Date(r.start_time) : null;
        const end = r.end_time ? new Date(r.end_time) : null;
        if (!r.is_active)
            return _jsx("span", { className: "text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500", children: "Inactive" });
        if (start && now < start)
            return _jsx("span", { className: "text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700", children: "Upcoming" });
        if (end && now > end)
            return _jsx("span", { className: "text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500", children: "Ended" });
        return _jsx("span", { className: "text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700", children: "Active" });
    };
    return (_jsxs("div", { className: "space-y-6 max-w-4xl mx-auto", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Mentoring Rounds" }), _jsx("p", { className: "text-gray-500 text-sm mt-0.5", children: "Create and manage mentoring scoring rounds" })] }), _jsx("button", { onClick: openCreate, className: "bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors", children: "+ New Round" })] }), msg && _jsx("div", { className: "bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm", children: msg }), err && _jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm", children: err }), isLoading ? (_jsx("div", { className: "py-20 text-center text-gray-400 text-sm", children: "Loading rounds\u2026" })) : rounds.length === 0 ? (_jsxs("div", { className: "bg-white rounded-xl border border-gray-200 py-16 text-center", children: [_jsx("p", { className: "text-gray-400 text-sm", children: "No mentoring rounds yet." }), _jsx("button", { onClick: openCreate, className: "mt-3 text-indigo-600 text-sm hover:underline", children: "Create the first round" })] })) : (_jsx("div", { className: "space-y-3", children: rounds.map((r) => (_jsxs("div", { className: "bg-white rounded-xl border border-gray-200 p-5 flex items-start justify-between gap-4", children: [_jsxs("div", { className: "space-y-1 flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx("span", { className: "font-semibold text-gray-900", children: r.round_name }), statusBadge(r), _jsxs("span", { className: "text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full", children: ["Max: ", r.max_score, " pts"] })] }), r.description && _jsx("p", { className: "text-sm text-gray-500 truncate", children: r.description }), _jsxs("div", { className: "flex gap-4 text-xs text-gray-400 flex-wrap", children: [r.start_time && _jsxs("span", { children: ["Start: ", new Date(r.start_time).toLocaleString()] }), r.end_time && _jsxs("span", { children: ["End: ", new Date(r.end_time).toLocaleString()] })] })] }), _jsxs("div", { className: "flex gap-2 shrink-0", children: [_jsx("button", { onClick: () => openEdit(r), className: "text-indigo-600 hover:text-indigo-800 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-50 border border-indigo-200 transition-colors", children: "Edit" }), _jsx("button", { onClick: () => setDeleteId(r.id), className: "text-red-500 hover:text-red-700 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 border border-red-200 transition-colors", children: "Delete" })] })] }, r.id))) })), showForm && (_jsx("div", { className: "fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-white rounded-xl w-full max-w-lg shadow-xl", children: [_jsxs("div", { className: "px-6 py-4 border-b border-gray-100 flex items-center justify-between", children: [_jsx("h3", { className: "text-base font-semibold text-gray-900", children: editRound ? 'Edit Round' : 'New Mentoring Round' }), _jsx("button", { onClick: () => { setShowForm(false); setEditRound(null); }, className: "text-gray-400 hover:text-gray-600 text-xl leading-none", children: "\u00D7" })] }), _jsxs("div", { className: "p-6 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Round Name" }), _jsx("input", { value: form.round_name, onChange: (e) => set('round_name', e.target.value), placeholder: "e.g. Round 1 \u2013 Technical Review", className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Description" }), _jsx("textarea", { value: form.description, onChange: (e) => set('description', e.target.value), rows: 2, placeholder: "Optional description\u2026", className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Start Time" }), _jsx("input", { type: "datetime-local", value: form.start_time, onChange: (e) => set('start_time', e.target.value), className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "End Time" }), _jsx("input", { type: "datetime-local", value: form.end_time, onChange: (e) => set('end_time', e.target.value), className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Max Score" }), _jsx("input", { type: "number", min: 1, value: form.max_score, onChange: (e) => set('max_score', Number(e.target.value)), className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: form.is_active, onChange: (e) => set('is_active', e.target.checked), className: "sr-only peer" }), _jsx("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" })] }), _jsx("span", { className: "text-sm text-gray-700", children: "Active" })] })] }), _jsxs("div", { className: "px-6 py-4 border-t border-gray-100 flex justify-end gap-3", children: [_jsx("button", { onClick: () => { setShowForm(false); setEditRound(null); }, className: "px-4 py-2 text-sm text-gray-600 hover:text-gray-800", children: "Cancel" }), _jsx("button", { onClick: () => save.mutate(), disabled: save.isPending || !form.round_name, className: "px-5 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors", children: save.isPending ? 'Saving…' : editRound ? 'Update Round' : 'Create Round' })] })] }) })), deleteId !== null && (_jsx("div", { className: "fixed inset-0 bg-black/40 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white rounded-xl p-6 w-full max-w-sm shadow-xl space-y-4", children: [_jsx("h3", { className: "text-base font-semibold text-gray-900", children: "Delete Round?" }), _jsx("p", { className: "text-sm text-gray-500", children: "All scores associated with this round will also be removed. This cannot be undone." }), _jsxs("div", { className: "flex gap-3 justify-end", children: [_jsx("button", { onClick: () => setDeleteId(null), className: "px-4 py-2 text-sm text-gray-600 hover:text-gray-800", children: "Cancel" }), _jsx("button", { onClick: () => remove.mutate(deleteId), disabled: remove.isPending, className: "px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50", children: remove.isPending ? 'Deleting…' : 'Delete' })] })] }) }))] }));
}

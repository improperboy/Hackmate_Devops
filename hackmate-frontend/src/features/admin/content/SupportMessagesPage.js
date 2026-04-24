import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/api/admin';
const priorityBadge = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700',
};
const statusBadge = {
    open: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-700',
};
export default function SupportMessagesPage() {
    const qc = useQueryClient();
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [selected, setSelected] = useState(null);
    const [notes, setNotes] = useState('');
    const [msg, setMsg] = useState('');
    const { data: messages = [], isLoading } = useQuery({
        queryKey: ['support-messages', statusFilter, priorityFilter],
        queryFn: () => adminApi.getSupportMessages({ status: statusFilter || undefined, priority: priorityFilter || undefined }),
    });
    const updateStatus = useMutation({
        mutationFn: ({ id, status }) => adminApi.updateSupportStatus(id, status, notes || undefined),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['support-messages'] }); setMsg('Status updated!'); setSelected(null); setNotes(''); },
    });
    const deleteMsg = useMutation({
        mutationFn: adminApi.deleteSupportMessage,
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['support-messages'] }); setMsg('Message deleted'); },
    });
    const openCount = messages.filter((m) => m.status === 'open').length;
    return (_jsxs("div", { className: "space-y-5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Support Messages" }), _jsx("p", { className: "text-gray-500 text-sm mt-0.5", children: "Handle support tickets from participants, mentors, and volunteers" })] }), openCount > 0 && (_jsxs("span", { className: "bg-red-100 text-red-800 px-3 py-1.5 rounded-lg text-sm font-medium", children: ["\u26A0\uFE0F ", openCount, " Open"] }))] }), msg && _jsx("div", { className: "bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm", children: msg }), _jsxs("div", { className: "bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3", children: [_jsxs("select", { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), className: "px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500", children: [_jsx("option", { value: "", children: "All Statuses" }), _jsx("option", { value: "open", children: "Open" }), _jsx("option", { value: "in_progress", children: "In Progress" }), _jsx("option", { value: "resolved", children: "Resolved" }), _jsx("option", { value: "closed", children: "Closed" })] }), _jsxs("select", { value: priorityFilter, onChange: (e) => setPriorityFilter(e.target.value), className: "px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500", children: [_jsx("option", { value: "", children: "All Priorities" }), _jsx("option", { value: "low", children: "Low" }), _jsx("option", { value: "medium", children: "Medium" }), _jsx("option", { value: "high", children: "High" }), _jsx("option", { value: "urgent", children: "Urgent" })] }), _jsx("button", { onClick: () => { setStatusFilter(''); setPriorityFilter(''); }, className: "px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors", children: "Clear" })] }), _jsxs("div", { className: "bg-white rounded-xl border border-gray-200 overflow-hidden", children: [_jsx("div", { className: "px-5 py-3 border-b border-gray-100", children: _jsxs("h3", { className: "font-semibold text-gray-900", children: ["Messages (", messages.length, ")"] }) }), isLoading ? (_jsx("div", { className: "py-12 text-center text-gray-400", children: "Loading\u2026" })) : messages.length === 0 ? (_jsx("div", { className: "py-12 text-center text-gray-400", children: "No messages found" })) : (_jsx("div", { className: "divide-y divide-gray-100", children: messages.map((m) => (_jsxs("div", { className: "p-5", children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap mb-1", children: [_jsx("span", { className: "font-medium text-gray-900 text-sm", children: m.subject ?? 'Support Request' }), _jsx("span", { className: `px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadge[m.status]}`, children: m.status }), _jsx("span", { className: `px-2 py-0.5 rounded-full text-xs font-semibold ${priorityBadge[m.priority]}`, children: m.priority })] }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: m.message }), _jsxs("div", { className: "flex items-center gap-3 mt-2 text-xs text-gray-400", children: [_jsxs("span", { children: ["From: ", m.from_role] }), _jsxs("span", { children: ["To: ", m.to_role] }), _jsx("span", { children: new Date(m.created_at).toLocaleString() })] }), m.resolution_notes && (_jsxs("div", { className: "mt-2 bg-green-50 border border-green-100 rounded px-3 py-2 text-xs text-green-700", children: ["Resolution: ", m.resolution_notes] }))] }), _jsxs("div", { className: "flex flex-col gap-1 shrink-0", children: [m.status === 'open' && (_jsx("button", { onClick: () => { setSelected(m.id); setNotes(''); }, className: "text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors", children: "Resolve" })), _jsx("button", { onClick: () => { if (confirm('Delete this message?'))
                                                        deleteMsg.mutate(m.id); }, className: "text-xs text-red-500 hover:text-red-700 transition-colors", children: "Delete" })] })] }), selected === m.id && (_jsxs("div", { className: "mt-3 bg-gray-50 rounded-lg p-3 space-y-2", children: [_jsx("textarea", { rows: 2, value: notes, onChange: (e) => setNotes(e.target.value), placeholder: "Resolution notes (optional)\u2026", className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" }), _jsxs("div", { className: "flex gap-2", children: [['in_progress', 'resolved', 'closed'].map((s) => (_jsxs("button", { onClick: () => updateStatus.mutate({ id: m.id, status: s }), className: "text-xs bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 px-3 py-1 rounded transition-colors capitalize", children: ["\u2192 ", s.replace('_', ' ')] }, s))), _jsx("button", { onClick: () => setSelected(null), className: "text-xs text-gray-400 hover:text-gray-600 ml-auto", children: "Cancel" })] })] }))] }, m.id))) }))] })] }));
}

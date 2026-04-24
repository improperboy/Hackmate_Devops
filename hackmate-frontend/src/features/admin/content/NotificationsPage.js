import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '@/api/notifications';
import { Bell, Send, Clock } from 'lucide-react';
const ROLES = ['participant', 'mentor', 'volunteer', 'admin'];
export default function AdminNotificationsPage() {
    const qc = useQueryClient();
    const [form, setForm] = useState({ title: '', body: '', type: 'general', target_roles: null });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const { data: logs = [], isLoading } = useQuery({
        queryKey: ['notification-logs'],
        queryFn: () => notificationsApi.getLogs({ limit: 50 }),
    });
    const send = useMutation({
        mutationFn: notificationsApi.send,
        onSuccess: () => {
            setSuccess('Notification sent successfully');
            setForm({ title: '', body: '', type: 'general', target_roles: null });
            setError('');
            qc.invalidateQueries({ queryKey: ['notification-logs'] });
            setTimeout(() => setSuccess(''), 3000);
        },
        onError: () => setError('Failed to send notification'),
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.body.trim()) {
            setError('Title and message are required');
            return;
        }
        setError('');
        send.mutate(form);
    };
    const toggleRole = (role) => {
        const current = form.target_roles ? JSON.parse(form.target_roles) : [];
        const updated = current.includes(role) ? current.filter((r) => r !== role) : [...current, role];
        setForm((f) => ({ ...f, target_roles: updated.length ? JSON.stringify(updated) : null }));
    };
    const selectedRoles = form.target_roles ? JSON.parse(form.target_roles) : [];
    return (_jsxs("div", { className: "space-y-6 max-w-4xl", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Push Notifications" }), _jsx("p", { className: "text-gray-500 text-sm mt-0.5", children: "Send push notifications to users and view delivery logs" })] }), _jsxs("div", { className: "bg-white rounded-2xl border border-gray-200 p-6", children: [_jsxs("h2", { className: "text-base font-semibold text-gray-800 mb-4 flex items-center gap-2", children: [_jsx(Send, { className: "w-4 h-4 text-indigo-500" }), "Send Notification"] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Title" }), _jsx("input", { type: "text", value: form.title, onChange: (e) => setForm((f) => ({ ...f, title: e.target.value })), placeholder: "Notification title", className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Message" }), _jsx("textarea", { value: form.body, onChange: (e) => setForm((f) => ({ ...f, body: e.target.value })), placeholder: "Notification body text", rows: 3, className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Type" }), _jsx("select", { value: form.type, onChange: (e) => setForm((f) => ({ ...f, type: e.target.value })), className: "border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500", children: ['general', 'announcement', 'score_update', 'team_update', 'support'].map((t) => (_jsx("option", { value: t, children: t }, t))) })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Target Roles ", _jsx("span", { className: "text-gray-400 font-normal", children: "(leave empty to send to all)" })] }), _jsx("div", { className: "flex gap-2 flex-wrap", children: ROLES.map((role) => (_jsx("button", { type: "button", onClick: () => toggleRole(role), className: `px-3 py-1.5 rounded-full text-xs font-medium border transition-colors capitalize ${selectedRoles.includes(role)
                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'}`, children: role }, role))) })] }), error && _jsx("p", { className: "text-sm text-red-600", children: error }), success && _jsx("p", { className: "text-sm text-green-600", children: success }), _jsxs("button", { type: "submit", disabled: send.isPending, className: "flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60", children: [_jsx(Send, { className: "w-4 h-4" }), send.isPending ? 'Sending…' : 'Send Notification'] })] })] }), _jsxs("div", { className: "bg-white rounded-2xl border border-gray-200 overflow-hidden", children: [_jsxs("div", { className: "px-6 py-4 border-b border-gray-100 flex items-center gap-2", children: [_jsx(Bell, { className: "w-4 h-4 text-gray-500" }), _jsx("h2", { className: "text-base font-semibold text-gray-800", children: "Notification Logs" }), _jsxs("span", { className: "ml-auto text-xs text-gray-400", children: [logs.length, " entries"] })] }), isLoading ? (_jsx("div", { className: "py-12 text-center text-gray-400", children: "Loading logs\u2026" })) : logs.length === 0 ? (_jsx("div", { className: "py-12 text-center text-gray-400", children: "No notifications sent yet" })) : (_jsx("div", { className: "divide-y divide-gray-100", children: logs.map((log) => (_jsxs("div", { className: "px-6 py-4 flex items-start gap-4", children: [_jsx("div", { className: "w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0", children: _jsx(Bell, { className: "w-4 h-4 text-indigo-600" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx("span", { className: "text-sm font-semibold text-gray-900", children: log.title }), _jsx("span", { className: "text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full", children: log.type }), log.target_roles && (_jsx("span", { className: "text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full", children: JSON.parse(log.target_roles).join(', ') }))] }), _jsx("p", { className: "text-sm text-gray-600 mt-0.5 truncate", children: log.body }), log.created_at && (_jsxs("div", { className: "flex items-center gap-1 mt-1 text-xs text-gray-400", children: [_jsx(Clock, { className: "w-3 h-3" }), new Date(log.created_at).toLocaleString()] }))] })] }, log.id))) }))] })] }));
}

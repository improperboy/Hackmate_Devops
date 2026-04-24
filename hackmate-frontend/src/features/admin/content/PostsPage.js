import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client from '@/api/client';
export default function PostsPage() {
    const qc = useQueryClient();
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({ title: '', content: '', link_url: '', link_text: '' });
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');
    const { data: posts = [], isLoading } = useQuery({
        queryKey: ['admin-posts'],
        queryFn: () => client.get('/announcements/').then((r) => r.data),
    });
    const submit = useMutation({
        mutationFn: () => editId
            ? client.put(`/announcements/${editId}`, form).then((r) => r.data)
            : client.post('/announcements/', form).then((r) => r.data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['admin-posts'] });
            setMsg(editId ? 'Announcement updated!' : 'Announcement posted!');
            setEditId(null);
            setForm({ title: '', content: '', link_url: '', link_text: '' });
        },
        onError: (e) => setErr(e?.response?.data?.detail ?? 'Failed to save'),
    });
    const deletePost = useMutation({
        mutationFn: (id) => client.delete(`/announcements/${id}`).then((r) => r.data),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-posts'] }); setMsg('Announcement deleted'); },
        onError: () => setErr('Failed to delete'),
    });
    const startEdit = (post) => {
        setEditId(post.id);
        setForm({ title: post.title, content: post.content, link_url: post.link_url ?? '', link_text: post.link_text ?? '' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const reset = () => { setEditId(null); setForm({ title: '', content: '', link_url: '', link_text: '' }); };
    return (_jsxs("div", { className: "max-w-3xl mx-auto space-y-5", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Manage Announcements" }), _jsx("p", { className: "text-gray-500 text-sm mt-0.5", children: "Create and manage hackathon announcements" })] }), msg && _jsx("div", { className: "bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm", children: msg }), err && _jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm", children: err }), _jsxs("div", { className: "bg-white rounded-xl border border-gray-200 p-5", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-4", children: editId ? '✏️ Edit Announcement' : '+ Create New Announcement' }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Title *" }), _jsx("input", { type: "text", required: true, value: form.title, onChange: (e) => setForm({ ...form, title: e.target.value }), placeholder: "e.g., Important Update, Submission Deadline Extended", className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Content *" }), _jsx("textarea", { required: true, rows: 5, value: form.content, onChange: (e) => setForm({ ...form, content: e.target.value }), placeholder: "Write your announcement details here\u2026", className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" })] }), _jsxs("div", { className: "border-t pt-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-700 mb-3", children: "Optional Link" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs text-gray-600 mb-1", children: "Link URL" }), _jsx("input", { type: "url", value: form.link_url, onChange: (e) => setForm({ ...form, link_url: e.target.value }), placeholder: "https://example.com", className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-gray-600 mb-1", children: "Link Text" }), _jsx("input", { type: "text", value: form.link_text, onChange: (e) => setForm({ ...form, link_text: e.target.value }), placeholder: "e.g., View Form, Download Document", className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" })] })] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => { setMsg(''); setErr(''); submit.mutate(); }, disabled: !form.title || !form.content || submit.isPending, className: "bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors", children: submit.isPending ? 'Saving…' : editId ? 'Update' : '📢 Post Announcement' }), editId && (_jsx("button", { onClick: reset, className: "bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium transition-colors", children: "Cancel" }))] })] })] }), _jsxs("div", { className: "bg-white rounded-xl border border-gray-200 overflow-hidden", children: [_jsx("div", { className: "px-5 py-3 border-b border-gray-100", children: _jsxs("h3", { className: "font-semibold text-gray-900", children: ["All Announcements (", posts.length, ")"] }) }), isLoading ? (_jsx("div", { className: "py-10 text-center text-gray-400", children: "Loading\u2026" })) : posts.length === 0 ? (_jsx("div", { className: "py-10 text-center text-gray-400", children: "No announcements yet" })) : (_jsx("div", { className: "divide-y divide-gray-100", children: posts.map((post) => (_jsxs("div", { className: "px-5 py-4", children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsx("h4", { className: "font-semibold text-gray-900", children: post.title }), _jsxs("div", { className: "flex gap-3 shrink-0", children: [_jsx("button", { onClick: () => startEdit(post), className: "text-indigo-600 hover:text-indigo-800 text-xs font-medium", children: "Edit" }), _jsx("button", { onClick: () => { if (confirm('Delete this announcement?')) {
                                                        setMsg('');
                                                        setErr('');
                                                        deletePost.mutate(post.id);
                                                    } }, className: "text-red-500 hover:text-red-700 text-xs font-medium", children: "Delete" })] })] }), _jsx("p", { className: "text-sm text-gray-600 mt-1 whitespace-pre-line", children: post.content }), post.link_url && post.link_text && (_jsxs("a", { href: post.link_url, target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-1 mt-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-lg hover:bg-indigo-100 transition-colors", children: ["\uD83D\uDD17 ", post.link_text] })), _jsx("p", { className: "text-xs text-gray-400 mt-2", children: new Date(post.created_at).toLocaleString() })] }, post.id))) }))] })] }));
}

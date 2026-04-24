import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import client from '@/api/client';
const ROLES = ['admin', 'mentor', 'participant', 'volunteer'];
const roleBadge = {
    admin: 'bg-red-100 text-red-800',
    mentor: 'bg-green-100 text-green-800',
    participant: 'bg-blue-100 text-blue-800',
    volunteer: 'bg-purple-100 text-purple-800',
};
export default function ManageUsersPage() {
    const qc = useQueryClient();
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');
    const [editingSkills, setEditingSkills] = useState(null);
    const { data: users = [], isLoading } = useQuery({
        queryKey: ['admin-users', search, roleFilter],
        queryFn: () => client.get('/users/', { params: { search: search || undefined, role: roleFilter || undefined } }).then((r) => r.data.users ?? []),
    });
    const updateRole = useMutation({
        mutationFn: ({ id, role }) => client.put(`/users/${id}/role`, { role }).then((r) => r.data),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); setMsg('Role updated!'); },
        onError: () => setErr('Failed to update role'),
    });
    const updateSkills = useMutation({
        mutationFn: ({ id, tech_stack }) => client.put(`/users/${id}`, { tech_stack }).then((r) => r.data),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); setMsg('Skills updated!'); setEditingSkills(null); },
        onError: () => setErr('Failed to update skills'),
    });
    const deleteUser = useMutation({
        mutationFn: (id) => client.delete(`/users/${id}`).then((r) => r.data),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); setMsg('User deleted!'); },
        onError: () => setErr('Failed to delete user'),
    });
    return (_jsxs("div", { className: "space-y-5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "User Management" }), _jsx("p", { className: "text-gray-500 text-sm mt-0.5", children: "Manage all registered users" })] }), _jsx(Link, { to: "/admin/users/add", className: "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors", children: "+ Add User" })] }), msg && _jsx("div", { className: "bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm", children: msg }), err && _jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm", children: err }), _jsxs("div", { className: "bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3", children: [_jsx("input", { type: "text", placeholder: "Search by name or email\u2026", value: search, onChange: (e) => setSearch(e.target.value), className: "flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" }), _jsxs("select", { value: roleFilter, onChange: (e) => setRoleFilter(e.target.value), className: "px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500", children: [_jsx("option", { value: "", children: "All Roles" }), ROLES.map((r) => _jsx("option", { value: r, children: r.charAt(0).toUpperCase() + r.slice(1) }, r))] }), _jsx("button", { onClick: () => { setSearch(''); setRoleFilter(''); }, className: "px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors", children: "Clear" })] }), _jsxs("div", { className: "bg-white rounded-xl border border-gray-200 overflow-hidden", children: [_jsx("div", { className: "px-5 py-3 border-b border-gray-100 flex items-center justify-between", children: _jsxs("h3", { className: "font-semibold text-gray-900", children: ["All Users (", users.length, ")"] }) }), isLoading ? (_jsx("div", { className: "py-12 text-center text-gray-400", children: "Loading\u2026" })) : users.length === 0 ? (_jsx("div", { className: "py-12 text-center text-gray-400", children: "No users found" })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-gray-50 text-xs text-gray-500 uppercase tracking-wide", children: _jsxs("tr", { children: [_jsx("th", { className: "px-5 py-3 text-left", children: "Name" }), _jsx("th", { className: "px-5 py-3 text-left", children: "Email" }), _jsx("th", { className: "px-5 py-3 text-left", children: "Role" }), _jsx("th", { className: "px-5 py-3 text-left", children: "Tech Stack" }), _jsx("th", { className: "px-5 py-3 text-left", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-100", children: users.map((u) => (_jsxs("tr", { className: "hover:bg-gray-50 transition-colors", children: [_jsx("td", { className: "px-5 py-3 font-medium text-gray-900", children: u.name }), _jsx("td", { className: "px-5 py-3 text-gray-600", children: u.email }), _jsx("td", { className: "px-5 py-3", children: _jsx("span", { className: `px-2 py-0.5 rounded-full text-xs font-semibold ${roleBadge[u.role] ?? 'bg-gray-100 text-gray-700'}`, children: u.role }) }), _jsx("td", { className: "px-5 py-3 max-w-[200px]", children: u.tech_stack ? (_jsx("span", { className: "text-gray-600 text-xs truncate block", title: u.tech_stack, children: u.tech_stack })) : (_jsx("span", { className: "text-gray-300 text-xs italic", children: "none" })) }), _jsx("td", { className: "px-5 py-3", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("select", { value: u.role, onChange: (e) => { setMsg(''); setErr(''); updateRole.mutate({ id: u.id, role: e.target.value }); }, className: "text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500", children: ROLES.map((r) => _jsx("option", { value: r, children: r }, r)) }), _jsx("button", { onClick: () => { setMsg(''); setErr(''); setEditingSkills({ id: u.id, tech_stack: u.tech_stack ?? '' }); }, className: "text-indigo-500 hover:text-indigo-700 text-xs font-medium transition-colors", children: "Skills" }), _jsx("button", { onClick: () => { if (confirm('Delete this user?')) {
                                                                setMsg('');
                                                                setErr('');
                                                                deleteUser.mutate(u.id);
                                                            } }, className: "text-red-500 hover:text-red-700 text-xs font-medium transition-colors", children: "Delete" })] }) })] }, u.id))) })] }) }))] }), editingSkills && (_jsx("div", { className: "fixed inset-0 bg-black/40 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white rounded-xl border border-gray-200 p-6 w-full max-w-md shadow-xl", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-1", children: "Edit Tech Stack" }), _jsx("p", { className: "text-xs text-gray-500 mb-4", children: "Comma-separated skills used for AI mentor matching (e.g. Python, React, Docker)" }), _jsx("input", { type: "text", value: editingSkills.tech_stack, onChange: (e) => setEditingSkills({ ...editingSkills, tech_stack: e.target.value }), placeholder: "Python, React, Docker, PostgreSQL", className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4", autoFocus: true }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => updateSkills.mutate({ id: editingSkills.id, tech_stack: editingSkills.tech_stack }), disabled: updateSkills.isPending, className: "flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors", children: updateSkills.isPending ? 'Saving…' : 'Save' }), _jsx("button", { onClick: () => setEditingSkills(null), className: "flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors", children: "Cancel" })] })] }) }))] }));
}

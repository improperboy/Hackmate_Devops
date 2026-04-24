import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '@/api/client';
export default function AddUserPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm_password: '', role: '', tech_stack: '' });
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg('');
        setErr('');
        if (form.password !== form.confirm_password) {
            setErr('Passwords do not match');
            return;
        }
        if (form.password.length < 6) {
            setErr('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            const res = await client.post('/auth/register', { name: form.name, email: form.email, password: form.password, role: form.role });
            // Update tech_stack if provided
            if (form.tech_stack.trim() && res.data?.id) {
                await client.put(`/users/${res.data.id}`, { tech_stack: form.tech_stack.trim() });
            }
            setMsg('User added successfully!');
            setForm({ name: '', email: '', password: '', confirm_password: '', role: '', tech_stack: '' });
        }
        catch (e) {
            setErr(e?.response?.data?.detail ?? 'Failed to add user');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "max-w-lg mx-auto space-y-5", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: () => navigate('/admin/users'), className: "text-gray-500 hover:text-gray-700 text-sm", children: "\u2190 Back" }), _jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Add New User" })] }), msg && _jsx("div", { className: "bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm", children: msg }), err && _jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm", children: err }), _jsx("div", { className: "bg-white rounded-xl border border-gray-200 p-6", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [[
                            { label: 'Full Name', key: 'name', type: 'text', placeholder: 'John Doe' },
                            { label: 'Email Address', key: 'email', type: 'email', placeholder: 'user@example.com' },
                            { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
                            { label: 'Confirm Password', key: 'confirm_password', type: 'password', placeholder: '••••••••' },
                        ].map(({ label, key, type, placeholder }) => (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: label }), _jsx("input", { type: type, placeholder: placeholder, required: true, value: form[key], onChange: (e) => setForm({ ...form, [key]: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" })] }, key))), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Role" }), _jsxs("select", { required: true, value: form.role, onChange: (e) => setForm({ ...form, role: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500", children: [_jsx("option", { value: "", children: "Select Role" }), ['admin', 'participant', 'mentor', 'volunteer'].map((r) => (_jsx("option", { value: r, children: r.charAt(0).toUpperCase() + r.slice(1) }, r)))] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: ["Tech Stack ", _jsx("span", { className: "text-gray-400 font-normal", children: "(comma-separated, e.g. Python, React, Docker)" })] }), _jsx("input", { type: "text", placeholder: "Python, React, Docker", value: form.tech_stack, onChange: (e) => setForm({ ...form, tech_stack: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" })] }), _jsxs("div", { className: "flex gap-3 pt-2", children: [_jsx("button", { type: "submit", disabled: loading, className: "flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors", children: loading ? 'Adding…' : '+ Add User' }), _jsx("button", { type: "button", onClick: () => navigate('/admin/users'), className: "flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors", children: "Cancel" })] })] }) })] }));
}

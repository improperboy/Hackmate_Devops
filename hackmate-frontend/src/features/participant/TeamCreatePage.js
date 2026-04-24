import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamsApi } from '@/api/teams';
export default function TeamCreatePage() {
    const navigate = useNavigate();
    const qc = useQueryClient();
    const [form, setForm] = useState({ name: '', idea: '', problem_statement: '', tech_skills: '', theme_id: '' });
    const [error, setError] = useState('');
    const { data: themes = [] } = useQuery({ queryKey: ['themes'], queryFn: teamsApi.getThemes });
    const { mutate: createTeam, isPending } = useMutation({
        mutationFn: () => teamsApi.createTeam({
            name: form.name,
            idea: form.idea,
            problem_statement: form.problem_statement,
            tech_skills: form.tech_skills,
            theme_id: form.theme_id ? Number(form.theme_id) : undefined,
        }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['my-team'] });
            navigate('/participant/dashboard');
        },
        onError: (err) => {
            setError(err?.response?.data?.detail ?? 'Failed to create team. Please try again.');
        },
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!form.name || !form.idea || !form.problem_statement || !form.tech_skills || !form.theme_id) {
            setError('All fields are required.');
            return;
        }
        createTeam();
    };
    const selectedTheme = themes.find((t) => t.id === Number(form.theme_id));
    return (_jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white text-lg", children: "+" }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Create Team" }), _jsx("p", { className: "text-gray-500 text-sm", children: "Start your hackathon journey by creating a new team" })] })] }), error && (_jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm", children: error })), _jsx("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [_jsx(Field, { label: "Team Name *", icon: "\uD83D\uDC65", children: _jsx("input", { type: "text", value: form.name, onChange: (e) => setForm({ ...form, name: e.target.value }), placeholder: "e.g., Innovators, CodeMasters", className: "input", required: true }) }), _jsx(Field, { label: "Project Idea *", icon: "\uD83D\uDCA1", children: _jsx("textarea", { value: form.idea, onChange: (e) => setForm({ ...form, idea: e.target.value }), placeholder: "Briefly describe your project idea...", rows: 4, className: "input resize-none", required: true }) }), _jsx(Field, { label: "Problem Statement *", icon: "\u2753", children: _jsx("textarea", { value: form.problem_statement, onChange: (e) => setForm({ ...form, problem_statement: e.target.value }), placeholder: "What problem does your project aim to solve?", rows: 4, className: "input resize-none", required: true }) }), _jsxs(Field, { label: "Required Tech Skills *", icon: "\uD83D\uDCBB", children: [_jsx("textarea", { value: form.tech_skills, onChange: (e) => setForm({ ...form, tech_skills: e.target.value }), placeholder: "e.g., React, Node.js, Python, MongoDB...", rows: 3, className: "input resize-none", required: true }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "List technologies needed \u2014 helps match you with the right mentor." })] }), _jsxs(Field, { label: "Theme Category *", icon: "\uD83C\uDFF7\uFE0F", children: [_jsxs("select", { value: form.theme_id, onChange: (e) => setForm({ ...form, theme_id: e.target.value }), className: "input", required: true, style: selectedTheme ? { borderLeftColor: selectedTheme.color_code, borderLeftWidth: 4 } : {}, children: [_jsx("option", { value: "", children: "Select a theme for your project" }), themes.map((t) => (_jsx("option", { value: t.id, children: t.name }, t.id)))] }), selectedTheme?.description && (_jsx("p", { className: "text-xs text-gray-600 mt-1 font-medium", children: selectedTheme.description }))] }), _jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-gray-700", children: [_jsx("p", { className: "font-semibold text-gray-900 mb-1", children: "Important Information" }), "After creating your team, it will be sent to the admin for approval. Once approved, you'll be assigned a floor and room, and can invite other participants.", _jsx("br", {}), _jsx("strong", { children: "Note:" }), " Theme selection cannot be changed once created."] }), _jsxs("div", { className: "flex gap-3 pt-2", children: [_jsx("button", { type: "submit", disabled: isPending, className: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all disabled:opacity-60", children: isPending ? 'Creating…' : 'Create Team' }), _jsx(Link, { to: "/participant/dashboard", className: "bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-6 rounded-xl transition-all border border-gray-300", children: "Cancel" })] })] }) })] }));
}
function Field({ label, icon, children }) {
    return (_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: [_jsx("span", { className: "mr-1", children: icon }), label] }), children] }));
}

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { teamsApi } from '@/api/teams';
import { submissionsApi } from '@/api/submissions';
export default function SubmitProjectPage() {
    const navigate = useNavigate();
    const qc = useQueryClient();
    const user = useAuthStore((s) => s.user);
    const [form, setForm] = useState({ github_link: '', live_link: '', tech_stack: '', demo_video: '' });
    const [toast, setToast] = useState('');
    const [error, setError] = useState('');
    const { data: myTeam, isLoading: teamLoading } = useQuery({
        queryKey: ['my-team'],
        queryFn: teamsApi.getMyTeam,
        retry: false,
    });
    const isLeader = myTeam?.leader_id === user?.id;
    const { data: settings } = useQuery({
        queryKey: ['submission-settings'],
        queryFn: submissionsApi.getSettings,
        retry: false,
    });
    const { data: existing } = useQuery({
        queryKey: ['submission', myTeam?.id],
        queryFn: () => submissionsApi.getByTeam(myTeam.id),
        enabled: !!myTeam?.id,
        retry: false,
    });
    useEffect(() => {
        if (existing) {
            setForm({
                github_link: existing.github_link ?? '',
                live_link: existing.live_link ?? '',
                tech_stack: existing.tech_stack ?? '',
                demo_video: existing.demo_video ?? '',
            });
        }
    }, [existing]);
    const { mutate: submit, isPending } = useMutation({
        mutationFn: () => existing
            ? submissionsApi.update(existing.id, form)
            : submissionsApi.submit({ team_id: myTeam.id, ...form }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['submission', myTeam?.id] });
            setToast(existing ? 'Submission updated successfully!' : 'Project submitted successfully!');
            setTimeout(() => navigate('/participant/dashboard'), 2000);
        },
        onError: (err) => {
            setError(err?.response?.data?.detail ?? 'Submission failed. Please try again.');
            setTimeout(() => setError(''), 5000);
        },
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.github_link || !form.tech_stack) {
            setError('GitHub link and tech stack are required.');
            return;
        }
        submit();
    };
    if (teamLoading)
        return _jsx("div", { className: "flex items-center justify-center h-64 text-gray-400", children: "Loading\u2026" });
    if (!myTeam || myTeam.status !== 'approved') {
        return (_jsxs("div", { className: "max-w-xl mx-auto text-center mt-20", children: [_jsx("p", { className: "text-gray-500 mb-4", children: "You must have an approved team to submit projects." }), _jsx(Link, { to: "/participant/dashboard", className: "text-indigo-600 hover:underline", children: "\u2190 Back to Dashboard" })] }));
    }
    if (!isLeader) {
        return (_jsxs("div", { className: "max-w-xl mx-auto text-center mt-20", children: [_jsx("p", { className: "text-gray-500 mb-4", children: "Only team leaders can submit projects." }), _jsx(Link, { to: "/participant/dashboard", className: "text-indigo-600 hover:underline", children: "\u2190 Back to Dashboard" })] }));
    }
    // Check submission window
    let windowError = '';
    if (!settings) {
        windowError = 'Submissions are not yet open.';
    }
    else {
        const now = new Date();
        if (now < new Date(settings.start_time)) {
            windowError = `Submissions have not started yet. Start time: ${new Date(settings.start_time).toLocaleString()}`;
        }
        else if (now > new Date(settings.end_time)) {
            windowError = `Submission deadline has passed. Deadline was: ${new Date(settings.end_time).toLocaleString()}`;
        }
    }
    return (_jsxs("div", { className: "max-w-2xl mx-auto space-y-6", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-2xl font-bold text-gray-900", children: [existing ? 'Update' : 'Submit', " Project"] }), _jsxs("p", { className: "text-gray-500 text-sm", children: ["Team: ", myTeam.name] })] }), toast && _jsx("div", { className: "bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm", children: toast }), error && _jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm", children: error }), settings && !windowError && (_jsxs("div", { className: "bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl text-sm text-blue-700", children: [_jsx("strong", { children: "Submission Deadline:" }), " ", new Date(settings.end_time).toLocaleString()] })), windowError ? (_jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-xl text-sm", children: windowError })) : (_jsx("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "GitHub Repository URL *" }), _jsx("input", { type: "url", value: form.github_link, onChange: (e) => setForm({ ...form, github_link: e.target.value }), placeholder: "https://github.com/username/repository", className: "input", required: true }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Your project's GitHub repository URL" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Live Demo URL (Optional)" }), _jsx("input", { type: "url", value: form.live_link, onChange: (e) => setForm({ ...form, live_link: e.target.value }), placeholder: "https://your-project-demo.com", className: "input" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Technology Stack *" }), _jsx("textarea", { value: form.tech_stack, onChange: (e) => setForm({ ...form, tech_stack: e.target.value }), placeholder: "List the technologies, frameworks, and tools used...", rows: 4, className: "input resize-none", required: true }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "e.g., React, Node.js, MongoDB, Express, etc." })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Demo Video URL (Optional)" }), _jsx("input", { type: "url", value: form.demo_video, onChange: (e) => setForm({ ...form, demo_video: e.target.value }), placeholder: "https://youtube.com/watch?v=...", className: "input" })] }), _jsxs("div", { className: "bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl text-sm text-yellow-700", children: [_jsx("strong", { children: "Important:" }), " Make sure your GitHub repository is public and contains a README with setup instructions. You can update your submission multiple times before the deadline."] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { type: "submit", disabled: isPending, className: "bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors disabled:opacity-60", children: isPending ? 'Submitting…' : `${existing ? 'Update' : 'Submit'} Project` }), _jsx(Link, { to: "/participant/dashboard", className: "bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2.5 px-6 rounded-xl transition-colors", children: "Cancel" })] })] }) })), existing && (_jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-5", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-3", children: "Current Submission" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-500", children: "GitHub" }), _jsx("a", { href: existing.github_link, target: "_blank", rel: "noreferrer", className: "text-blue-600 hover:underline break-all", children: existing.github_link })] }), existing.live_link && (_jsxs("div", { children: [_jsx("p", { className: "text-gray-500", children: "Live Demo" }), _jsx("a", { href: existing.live_link, target: "_blank", rel: "noreferrer", className: "text-blue-600 hover:underline break-all", children: existing.live_link })] })), _jsxs("div", { children: [_jsx("p", { className: "text-gray-500", children: "Last Updated" }), _jsx("p", { className: "text-gray-800", children: existing.submitted_at ? new Date(existing.submitted_at).toLocaleString() : '—' })] })] })] }))] }));
}

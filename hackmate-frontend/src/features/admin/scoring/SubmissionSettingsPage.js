import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { submissionsApi } from '@/api/submissions';
import { adminApi } from '@/api/admin';
export default function SubmissionSettingsPage() {
    const qc = useQueryClient();
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    // Submission window settings
    const { data: settings, isLoading: loadingSettings } = useQuery({
        queryKey: ['submission-settings'],
        queryFn: submissionsApi.getSettings,
    });
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [isActive, setIsActive] = useState(true);
    // Sync form when settings load
    useState(() => {
        if (settings) {
            setStartTime(settings.start_time?.slice(0, 16) ?? '');
            setEndTime(settings.end_time?.slice(0, 16) ?? '');
            setIsActive(settings.is_active);
        }
    });
    const updateSettings = useMutation({
        mutationFn: () => submissionsApi.updateSettings({ start_time: startTime, end_time: endTime, is_active: isActive }),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['submission-settings'] }); setMsg('Settings saved!'); },
        onError: (e) => setErr(e?.response?.data?.detail ?? 'Failed to save'),
    });
    // All submissions list
    const { data: submissionsData, isLoading: loadingSubs } = useQuery({
        queryKey: ['admin-submissions-list'],
        queryFn: () => adminApi.listSubmissions(),
    });
    const submissions = submissionsData?.submissions ?? [];
    const deleteSub = useMutation({
        mutationFn: (id) => adminApi.deleteSubmission(id),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-submissions-list'] }); setDeleteId(null); setMsg('Submission deleted'); },
        onError: () => setErr('Failed to delete submission'),
    });
    return (_jsxs("div", { className: "space-y-6 max-w-4xl mx-auto", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Submission Settings" }), _jsx("p", { className: "text-gray-500 text-sm mt-0.5", children: "Manage submission window and review all project submissions" })] }), _jsx("span", { className: "bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-xs font-medium", children: "Admin Only" })] }), msg && _jsx("div", { className: "bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm", children: msg }), err && _jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm", children: err }), _jsxs("div", { className: "bg-white rounded-xl border border-gray-200 p-6 space-y-4", children: [_jsx("h2", { className: "text-base font-semibold text-gray-800", children: "Submission Window" }), loadingSettings ? (_jsx("p", { className: "text-gray-400 text-sm", children: "Loading\u2026" })) : (_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Start Time" }), _jsx("input", { type: "datetime-local", value: startTime || (settings?.start_time?.slice(0, 16) ?? ''), onChange: (e) => setStartTime(e.target.value), className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "End Time" }), _jsx("input", { type: "datetime-local", value: endTime || (settings?.end_time?.slice(0, 16) ?? ''), onChange: (e) => setEndTime(e.target.value), className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" })] }), _jsxs("div", { className: "flex items-center gap-3 sm:col-span-2", children: [_jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: isActive ?? settings?.is_active ?? false, onChange: (e) => setIsActive(e.target.checked), className: "sr-only peer" }), _jsx("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" })] }), _jsx("span", { className: "text-sm text-gray-700", children: "Submissions Active" }), _jsx("span", { className: `ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${(isActive ?? settings?.is_active) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`, children: (isActive ?? settings?.is_active) ? 'Open' : 'Closed' })] }), _jsx("div", { className: "sm:col-span-2 flex justify-end", children: _jsx("button", { onClick: () => updateSettings.mutate(), disabled: updateSettings.isPending, className: "bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors", children: updateSettings.isPending ? 'Saving…' : 'Save Settings' }) })] }))] }), _jsxs("div", { className: "bg-white rounded-xl border border-gray-200 overflow-hidden", children: [_jsxs("div", { className: "px-6 py-4 border-b border-gray-100 flex items-center justify-between", children: [_jsx("h2", { className: "text-base font-semibold text-gray-800", children: "All Submissions" }), _jsxs("span", { className: "text-xs text-gray-400", children: [submissions.length, " total"] })] }), loadingSubs ? (_jsx("div", { className: "py-12 text-center text-gray-400 text-sm", children: "Loading submissions\u2026" })) : submissions.length === 0 ? (_jsx("div", { className: "py-12 text-center text-gray-400 text-sm", children: "No submissions yet" })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-gray-50 text-gray-500 text-xs uppercase tracking-wide", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 text-left", children: "Team ID" }), _jsx("th", { className: "px-4 py-3 text-left", children: "GitHub" }), _jsx("th", { className: "px-4 py-3 text-left", children: "Tech Stack" }), _jsx("th", { className: "px-4 py-3 text-left", children: "Submitted" }), _jsx("th", { className: "px-4 py-3 text-right", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-100", children: submissions.map((s) => (_jsxs("tr", { className: "hover:bg-gray-50 transition-colors", children: [_jsxs("td", { className: "px-4 py-3 font-medium text-gray-900", children: ["#", s.team_id] }), _jsx("td", { className: "px-4 py-3", children: _jsx("a", { href: s.github_link, target: "_blank", rel: "noopener noreferrer", className: "text-indigo-600 hover:underline truncate max-w-[180px] block", children: s.github_link.replace('https://github.com/', '') }) }), _jsx("td", { className: "px-4 py-3 text-gray-600 max-w-[160px] truncate", children: s.tech_stack }), _jsx("td", { className: "px-4 py-3 text-gray-500", children: s.submitted_at ? new Date(s.submitted_at).toLocaleDateString() : '—' }), _jsx("td", { className: "px-4 py-3 text-right", children: _jsx("button", { onClick: () => setDeleteId(s.id), className: "text-red-500 hover:text-red-700 text-xs font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors", children: "Delete" }) })] }, s.id))) })] }) }))] }), deleteId !== null && (_jsx("div", { className: "fixed inset-0 bg-black/40 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white rounded-xl p-6 w-full max-w-sm shadow-xl space-y-4", children: [_jsx("h3", { className: "text-base font-semibold text-gray-900", children: "Delete Submission?" }), _jsx("p", { className: "text-sm text-gray-500", children: "This action cannot be undone. The submission will be permanently removed." }), _jsxs("div", { className: "flex gap-3 justify-end", children: [_jsx("button", { onClick: () => setDeleteId(null), className: "px-4 py-2 text-sm text-gray-600 hover:text-gray-800", children: "Cancel" }), _jsx("button", { onClick: () => deleteSub.mutate(deleteId), disabled: deleteSub.isPending, className: "px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50", children: deleteSub.isPending ? 'Deleting…' : 'Delete' })] })] }) }))] }));
}

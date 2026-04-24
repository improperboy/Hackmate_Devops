import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { adminApi } from '@/api/admin';
const EXPORTS = [
    { key: 'users', label: 'Users', desc: 'All registered users with roles', icon: '👤', color: 'blue' },
    { key: 'teams', label: 'Teams', desc: 'All teams with leader, members, location', icon: '👥', color: 'green' },
    { key: 'submissions', label: 'Submissions', desc: 'Project submissions with GitHub/live links', icon: '📤', color: 'purple' },
    { key: 'scores', label: 'Scores', desc: 'All mentor scores per round', icon: '⭐', color: 'yellow' },
];
function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
export default function ExportPage() {
    const [loading, setLoading] = useState(null);
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');
    const handleExport = async (type) => {
        setLoading(type);
        setMsg('');
        setErr('');
        try {
            let blob;
            const ts = new Date().toISOString().slice(0, 10);
            if (type === 'users')
                blob = await adminApi.exportUsers();
            else if (type === 'teams')
                blob = await adminApi.exportTeams();
            else if (type === 'submissions')
                blob = await adminApi.exportSubmissions();
            else if (type === 'scores')
                blob = await adminApi.exportScores();
            else
                return;
            downloadBlob(blob, `${type}_export_${ts}.csv`);
            setMsg(`${type.charAt(0).toUpperCase() + type.slice(1)} exported successfully!`);
        }
        catch {
            setErr(`Failed to export ${type}`);
        }
        finally {
            setLoading(null);
        }
    };
    const colorMap = {
        blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
        green: 'bg-green-50 border-green-200 hover:bg-green-100',
        purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
        yellow: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
    };
    return (_jsxs("div", { className: "max-w-2xl mx-auto space-y-5", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Export Data" }), _jsx("p", { className: "text-gray-500 text-sm mt-0.5", children: "Download hackathon data as CSV files" })] }), msg && _jsxs("div", { className: "bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm", children: ["\u2705 ", msg] }), err && _jsxs("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm", children: ["\u274C ", err] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: EXPORTS.map((e) => (_jsxs("button", { onClick: () => handleExport(e.key), disabled: loading === e.key, className: `${colorMap[e.color]} border rounded-xl p-5 text-left transition-all disabled:opacity-50 group`, children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-2xl", children: e.icon }), loading === e.key
                                    ? _jsx("span", { className: "text-xs text-gray-500", children: "Downloading\u2026" })
                                    : _jsx("span", { className: "text-xs text-gray-400 group-hover:text-gray-600", children: "\uD83D\uDCE5 CSV" })] }), _jsx("div", { className: "font-semibold text-gray-900", children: e.label }), _jsx("div", { className: "text-xs text-gray-500 mt-0.5", children: e.desc })] }, e.key))) }), _jsxs("div", { className: "bg-white rounded-xl border border-gray-200 p-5", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-2", children: "\uD83D\uDCC4 Team PDF Reports" }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Export detailed PDF reports for individual teams. Go to", ' ', _jsx("a", { href: "/admin/teams", className: "text-indigo-600 hover:underline", children: "Manage Teams" }), ' ', "and use the export button on any team."] })] })] }));
}

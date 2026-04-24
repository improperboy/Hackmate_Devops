import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/api/admin';
const ACTION_ICONS = {
    create: '➕',
    update: '✏️',
    delete: '🗑️',
    login: '🔑',
    logout: '🚪',
    approve: '✅',
    reject: '❌',
    assign: '📌',
    export: '📥',
};
const getIcon = (action) => {
    const key = Object.keys(ACTION_ICONS).find((k) => action.toLowerCase().includes(k));
    return key ? ACTION_ICONS[key] : '📋';
};
const ENTITY_COLORS = {
    user: 'bg-blue-100 text-blue-700',
    team: 'bg-purple-100 text-purple-700',
    submission: 'bg-green-100 text-green-700',
    score: 'bg-yellow-100 text-yellow-700',
    round: 'bg-orange-100 text-orange-700',
    setting: 'bg-gray-100 text-gray-600',
};
const entityColor = (type) => type ? (ENTITY_COLORS[type.toLowerCase()] ?? 'bg-gray-100 text-gray-600') : 'bg-gray-100 text-gray-600';
export default function RecentActivityPage() {
    const [entityFilter, setEntityFilter] = useState('');
    const [limit, setLimit] = useState(100);
    const { data: logs = [], isLoading, isError, error, refetch } = useQuery({
        queryKey: ['activity-logs', entityFilter, limit],
        queryFn: () => adminApi.getActivityLogs({ limit, ...(entityFilter ? { entity_type: entityFilter } : {}) }),
        retry: 1,
    });
    const entityTypes = [...new Set(logs.map((l) => l.entity_type).filter(Boolean))];
    return (_jsxs("div", { className: "space-y-5 max-w-4xl mx-auto", children: [_jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Recent Activity" }), _jsx("p", { className: "text-gray-500 text-sm mt-0.5", children: "System-wide activity log" })] }), _jsx("button", { onClick: () => refetch(), className: "text-sm text-indigo-600 hover:text-indigo-800 px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors", children: "\u21BB Refresh" })] }), _jsxs("div", { className: "flex gap-3 flex-wrap", children: [_jsxs("select", { value: entityFilter, onChange: (e) => setEntityFilter(e.target.value), className: "border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500", children: [_jsx("option", { value: "", children: "All entity types" }), entityTypes.map((t) => (_jsx("option", { value: t, children: t }, t)))] }), _jsxs("select", { value: limit, onChange: (e) => setLimit(Number(e.target.value)), className: "border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500", children: [_jsx("option", { value: 50, children: "Last 50" }), _jsx("option", { value: 100, children: "Last 100" }), _jsx("option", { value: 200, children: "Last 200" }), _jsx("option", { value: 500, children: "Last 500" })] })] }), _jsxs("div", { className: "bg-white rounded-xl border border-gray-200 overflow-hidden", children: [_jsxs("div", { className: "px-5 py-3 border-b border-gray-100 flex items-center justify-between", children: [_jsx("h3", { className: "font-semibold text-gray-900", children: "Activity Log" }), _jsxs("span", { className: "text-xs text-gray-400", children: [logs.length, " entries"] })] }), isLoading ? (_jsxs("div", { className: "py-16 text-center", children: [_jsx("div", { className: "inline-block w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" }), _jsx("p", { className: "text-gray-400 text-sm", children: "Loading activity logs\u2026" })] })) : isError ? (_jsxs("div", { className: "py-16 text-center space-y-3", children: [_jsx("p", { className: "text-2xl", children: "\u26A0\uFE0F" }), _jsx("p", { className: "text-gray-700 font-medium text-sm", children: "Failed to load activity logs" }), _jsx("p", { className: "text-gray-400 text-xs max-w-xs mx-auto", children: error?.response?.data?.detail ?? error?.message ?? 'The admin service may be unavailable.' }), _jsx("button", { onClick: () => refetch(), className: "mt-2 text-sm text-indigo-600 hover:underline", children: "Try again" })] })) : logs.length === 0 ? (_jsxs("div", { className: "py-16 text-center", children: [_jsx("p", { className: "text-3xl mb-3", children: "\uD83D\uDCCB" }), _jsx("p", { className: "text-gray-500 text-sm font-medium", children: "No activity logged yet" }), _jsx("p", { className: "text-gray-400 text-xs mt-1", children: "Activity will appear here as users interact with the system" })] })) : (_jsx("div", { className: "divide-y divide-gray-100", children: logs.map((log) => (_jsxs("div", { className: "px-5 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors", children: [_jsx("div", { className: "w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center text-base shrink-0 mt-0.5", children: getIcon(log.action) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx("span", { className: "font-medium text-gray-900 text-sm", children: log.action }), log.entity_type && (_jsxs("span", { className: `text-xs px-2 py-0.5 rounded-full font-medium ${entityColor(log.entity_type)}`, children: [log.entity_type, log.entity_id ? ` #${log.entity_id}` : ''] })), log.user_id && (_jsxs("span", { className: "text-xs text-gray-400", children: ["by user #", log.user_id] }))] }), log.details && (_jsx("p", { className: "text-xs text-gray-500 mt-0.5 break-words", children: log.details })), _jsx("p", { className: "text-xs text-gray-400 mt-0.5", children: log.created_at ? new Date(log.created_at).toLocaleString() : '—' })] })] }, log.id))) }))] })] }));
}

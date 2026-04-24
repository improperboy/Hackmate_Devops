import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { teamsApi } from '@/api/teams';
export default function MyJoinRequestsPage() {
    const qc = useQueryClient();
    const { data: requests = [], isLoading } = useQuery({
        queryKey: ['my-join-requests'],
        queryFn: teamsApi.getMyJoinRequests,
    });
    const { mutate: cancelRequest } = useMutation({
        mutationFn: (id) => teamsApi.cancelJoinRequest(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['my-join-requests'] });
        },
    });
    const statusColor = {
        pending: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        expired: 'bg-gray-100 text-gray-600',
    };
    return (_jsxs("div", { className: "max-w-3xl mx-auto space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "My Join Requests" }), _jsx("p", { className: "text-gray-500 text-sm", children: "Track the status of your team join requests" })] }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200", children: [_jsx("div", { className: "px-5 py-4 border-b border-gray-200", children: _jsxs("h3", { className: "font-semibold text-gray-900", children: ["All Requests (", requests.length, ")"] }) }), isLoading ? (_jsx("div", { className: "p-8 text-center text-gray-400", children: "Loading\u2026" })) : requests.length === 0 ? (_jsxs("div", { className: "p-10 text-center", children: [_jsx("p", { className: "text-gray-500 mb-4", children: "You haven't sent any join requests yet." }), _jsx(Link, { to: "/participant/team/join", className: "bg-gradient-to-r from-green-600 to-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity", children: "Browse Teams" })] })) : (_jsx("div", { className: "divide-y divide-gray-200", children: requests.map((req) => (_jsxs("div", { className: "px-5 py-4 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900", children: req.team_name ?? `Team #${req.team_id}` }), req.leader_name && _jsxs("p", { className: "text-sm text-gray-500", children: ["Leader: ", req.leader_name] }), req.message && _jsxs("p", { className: "text-xs text-gray-400 mt-1 italic", children: ["\"", req.message, "\""] }), _jsxs("p", { className: "text-xs text-gray-400 mt-1", children: ["Sent: ", req.created_at ? new Date(req.created_at).toLocaleString() : '—'] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { className: `text-xs font-semibold px-3 py-1 rounded-full ${statusColor[req.status] ?? 'bg-gray-100 text-gray-600'}`, children: req.status.charAt(0).toUpperCase() + req.status.slice(1) }), req.status === 'pending' && (_jsx("button", { onClick: () => { if (confirm('Delete this join request?'))
                                                cancelRequest(req.id); }, className: "text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded transition-colors text-sm", title: "Delete request", children: "\uD83D\uDDD1\uFE0F" }))] })] }, req.id))) }))] })] }));
}

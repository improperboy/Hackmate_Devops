import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { teamsApi } from '@/api/teams';
import { useState } from 'react';
export default function ManageRequestsPage() {
    const navigate = useNavigate();
    const qc = useQueryClient();
    const user = useAuthStore((s) => s.user);
    const [toast, setToast] = useState('');
    const [error, setError] = useState('');
    const { data: myTeam, isLoading: teamLoading } = useQuery({
        queryKey: ['my-team'],
        queryFn: teamsApi.getMyTeam,
        retry: false,
    });
    // Redirect if not a leader
    const isLeader = myTeam?.leader_id === user?.id;
    const { data: requests = [], isLoading } = useQuery({
        queryKey: ['team-join-requests', myTeam?.id],
        queryFn: () => teamsApi.getTeamJoinRequests(myTeam.id),
        enabled: !!myTeam?.id && isLeader,
    });
    const { mutate: cancelInvite } = useMutation({
        mutationFn: (id) => teamsApi.cancelInvitation(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['team-sent-invitations', myTeam?.id] });
            showToast('Invitation cancelled.');
        },
        onError: (err) => showError(err?.response?.data?.detail ?? 'Failed to cancel invitation.'),
    });
    const { data: sentInvites = [] } = useQuery({
        queryKey: ['team-sent-invitations', myTeam?.id],
        queryFn: () => teamsApi.getSentInvitations(myTeam.id),
        enabled: !!myTeam?.id && isLeader,
    });
    const pendingInvites = sentInvites.filter((i) => i.status === 'pending');
    const { mutate: respond } = useMutation({
        mutationFn: ({ id, status }) => teamsApi.respondJoinRequest(id, status),
        onSuccess: (_, vars) => {
            qc.invalidateQueries({ queryKey: ['team-join-requests', myTeam?.id] });
            qc.invalidateQueries({ queryKey: ['team-members', myTeam?.id] });
            showToast(vars.status === 'approved' ? 'Request approved! Member added to team.' : 'Request rejected.');
        },
        onError: (err) => showError(err?.response?.data?.detail ?? 'Action failed.'),
    });
    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
    const showError = (msg) => { setError(msg); setTimeout(() => setError(''), 4000); };
    if (teamLoading)
        return _jsx("div", { className: "flex items-center justify-center h-64 text-gray-400", children: "Loading\u2026" });
    if (!myTeam || !isLeader) {
        navigate('/participant/dashboard');
        return null;
    }
    const pending = requests.filter((r) => r.status === 'pending');
    const processed = requests.filter((r) => r.status !== 'pending');
    const memberCount = myTeam.member_count ?? 0;
    return (_jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Manage Join Requests" }), _jsxs("p", { className: "text-gray-500 text-sm", children: ["Team: ", myTeam.name] })] }), toast && _jsx("div", { className: "bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm", children: toast }), error && _jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm", children: error }), _jsxs("div", { className: "bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl text-sm text-blue-700", children: [_jsx("strong", { children: "Team Status:" }), " ", memberCount, "/4 members \u2014", ' ', memberCount >= 4
                        ? _jsx("span", { className: "text-red-600 font-medium", children: "Team is full" })
                        : _jsxs("span", { className: "text-green-600 font-medium", children: [4 - memberCount, " spot(s) available"] })] }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200", children: [_jsx("div", { className: "px-5 py-4 border-b border-gray-200", children: _jsxs("h3", { className: "font-semibold text-yellow-600", children: ["\u23F3 Pending Join Requests (", pending.length, ")"] }) }), isLoading ? (_jsx("div", { className: "p-8 text-center text-gray-400", children: "Loading\u2026" })) : pending.length === 0 ? (_jsx("div", { className: "p-8 text-center text-gray-500", children: "No pending join requests." })) : (_jsx("div", { className: "divide-y divide-gray-200", children: pending.map((req) => (_jsxs("div", { className: "px-5 py-4 flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("p", { className: "font-medium text-gray-900", children: req.name ?? `User #${req.user_id}` }), _jsx("span", { className: "text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full", children: "Pending" })] }), _jsx("p", { className: "text-sm text-gray-500", children: req.email ?? '' }), req.message && (_jsx("div", { className: "mt-2 bg-gray-50 p-3 rounded-lg text-sm text-gray-700", children: req.message })), _jsxs("p", { className: "text-xs text-gray-400 mt-1", children: ["Requested: ", req.created_at ? new Date(req.created_at).toLocaleString() : '—'] })] }), _jsxs("div", { className: "flex gap-2 shrink-0", children: [memberCount < 4 && (_jsx("button", { onClick: () => { if (confirm(`Approve join request from ${req.name}?`))
                                                respond({ id: req.id, status: 'approved' }); }, className: "bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors", children: "\u2713 Approve" })), memberCount >= 4 && (_jsx("span", { className: "text-xs text-red-600 bg-red-50 px-2 py-1 rounded", children: "Team Full" })), _jsx("button", { onClick: () => { if (confirm(`Reject join request from ${req.name}?`))
                                                respond({ id: req.id, status: 'rejected' }); }, className: "bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors", children: "\u2715 Reject" })] })] }, req.id))) }))] }), pendingInvites.length > 0 && (_jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200", children: [_jsx("div", { className: "px-5 py-4 border-b border-gray-200", children: _jsxs("h3", { className: "font-semibold text-blue-600", children: ["\uD83D\uDCE4 Sent Invitations (", pendingInvites.length, ")"] }) }), _jsx("div", { className: "divide-y divide-gray-200", children: pendingInvites.map((inv) => (_jsxs("div", { className: "px-5 py-4 flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsxs("p", { className: "font-medium text-gray-900", children: ["Invited: ", inv.to_user_name ?? `User #${inv.to_user_id}`] }), _jsx("span", { className: "text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full", children: "Sent" })] }), inv.message && (_jsxs("div", { className: "mt-2 bg-gray-50 p-3 rounded-lg text-sm text-gray-700 italic border-l-2 border-blue-300", children: ["\"", inv.message, "\""] })), _jsxs("p", { className: "text-xs text-gray-400 mt-1", children: ["Sent: ", inv.created_at ? new Date(inv.created_at).toLocaleString() : '—'] })] }), _jsx("button", { onClick: () => { if (confirm('Cancel this invitation?'))
                                        cancelInvite(inv.id); }, className: "bg-gray-100 hover:bg-red-50 text-red-500 hover:text-red-700 border border-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors", children: "\uD83D\uDDD1\uFE0F Cancel" })] }, inv.id))) })] })), processed.length > 0 && (_jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200", children: [_jsx("div", { className: "px-5 py-4 border-b border-gray-200", children: _jsxs("h3", { className: "font-semibold text-gray-600", children: ["\uD83D\uDCCB Recent Responses (", processed.length, ")"] }) }), _jsx("div", { className: "divide-y divide-gray-200 max-h-80 overflow-y-auto", children: processed.slice(0, 10).map((req) => (_jsx("div", { className: "px-5 py-3 bg-gray-50 flex items-center justify-between", children: _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: req.name ?? `User #${req.user_id}` }), _jsx("span", { className: `text-xs px-2 py-0.5 rounded-full font-semibold ${req.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    req.status === 'expired' ? 'bg-gray-100 text-gray-600' :
                                                        'bg-red-100 text-red-800'}`, children: req.status.charAt(0).toUpperCase() + req.status.slice(1) })] }), _jsx("p", { className: "text-xs text-gray-400", children: req.responded_at ? new Date(req.responded_at).toLocaleString() : '—' })] }) }, req.id))) })] }))] }));
}

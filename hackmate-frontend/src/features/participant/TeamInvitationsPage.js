import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamsApi } from '@/api/teams';
export default function TeamInvitationsPage() {
    const qc = useQueryClient();
    const [toast, setToast] = useState('');
    const [error, setError] = useState('');
    const { data: myTeam } = useQuery({
        queryKey: ['my-team'],
        queryFn: teamsApi.getMyTeam,
        retry: false,
    });
    const { data: invitations = [], isLoading } = useQuery({
        queryKey: ['my-invitations'],
        queryFn: teamsApi.getMyInvitations,
    });
    const { mutate: respond } = useMutation({
        mutationFn: ({ id, status }) => teamsApi.respondInvitation(id, status),
        onSuccess: (_, vars) => {
            qc.invalidateQueries({ queryKey: ['my-invitations'] });
            qc.invalidateQueries({ queryKey: ['my-team'] });
            showToast(vars.status === 'accepted' ? 'Invitation accepted! You joined the team.' : 'Invitation rejected.');
        },
        onError: (err) => {
            const detail = err?.response?.data?.detail;
            const msg = Array.isArray(detail)
                ? detail.map((d) => d.msg).join(', ')
                : (detail ?? 'Action failed.');
            showError(msg);
        },
    });
    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
    const showError = (msg) => { setError(msg); setTimeout(() => setError(''), 4000); };
    const pending = invitations.filter((i) => i.status === 'pending');
    const history = invitations.filter((i) => i.status !== 'pending');
    return (_jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Team Invitations" }), _jsx("p", { className: "text-gray-500 text-sm", children: "Manage invitations from team leaders" })] }), toast && _jsx("div", { className: "bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm", children: toast }), error && _jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm", children: error }), myTeam && (_jsx("div", { className: "bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-xl text-sm", children: "\u2139\uFE0F You are already part of a team. You cannot accept new invitations." })), _jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200", children: [_jsx("div", { className: "px-5 py-4 border-b border-gray-200", children: _jsxs("h3", { className: "font-semibold text-orange-600", children: ["\u23F3 Pending Invitations (", pending.length, ")"] }) }), isLoading ? (_jsx("div", { className: "p-8 text-center text-gray-400", children: "Loading\u2026" })) : pending.length === 0 ? (_jsxs("div", { className: "p-8 text-center text-gray-500", children: [_jsx("p", { children: "No pending team invitations." }), _jsx("p", { className: "text-sm text-gray-400 mt-1", children: "Team leaders can invite you to join their teams." })] })) : (_jsx("div", { className: "divide-y divide-gray-200", children: pending.map((inv) => (_jsx("div", { className: "p-5", children: _jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-3 mb-3", children: [_jsx("div", { className: "w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl", children: "\uD83D\uDC65" }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-900", children: inv.team_name ?? `Team #${inv.team_id}` }), _jsxs("p", { className: "text-sm text-gray-500", children: ["Invited by: ", inv.from_user_name ?? `User #${inv.from_user_id}`] })] })] }), inv.current_members !== undefined && (_jsxs("p", { className: "text-sm text-gray-600 mb-2", children: ["Team size: ", inv.current_members, "/4 members"] })), inv.team_idea && (_jsxs("div", { className: "mb-2", children: [_jsx("p", { className: "text-xs font-semibold text-gray-500", children: "Project Idea" }), _jsx("p", { className: "text-sm text-gray-700 bg-gray-50 p-2 rounded mt-1", children: inv.team_idea })] })), inv.message && (_jsxs("div", { className: "mb-2", children: [_jsx("p", { className: "text-xs font-semibold text-gray-500", children: "Personal Message" }), _jsx("p", { className: "text-sm text-gray-700 bg-blue-50 border-l-4 border-blue-400 p-3 rounded mt-1", children: inv.message })] })), _jsxs("p", { className: "text-xs text-gray-400", children: ["Received: ", inv.created_at ? new Date(inv.created_at).toLocaleString() : '—'] })] }), !myTeam && (_jsxs("div", { className: "flex flex-col gap-2 shrink-0", children: [_jsx("button", { onClick: () => { if (confirm(`Accept invitation to join ${inv.team_name}?`))
                                                    respond({ id: inv.id, status: 'accepted' }); }, className: "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors", children: "\u2713 Accept" }), _jsx("button", { onClick: () => { if (confirm(`Reject invitation from ${inv.team_name}?`))
                                                    respond({ id: inv.id, status: 'rejected' }); }, className: "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors", children: "\u2715 Reject" })] }))] }) }, inv.id))) }))] }), history.length > 0 && (_jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200", children: [_jsx("div", { className: "px-5 py-4 border-b border-gray-200", children: _jsx("h3", { className: "font-semibold text-gray-600", children: "\uD83D\uDCCB Invitation History" }) }), _jsx("div", { className: "divide-y divide-gray-200", children: history.map((inv) => (_jsxs("div", { className: "px-5 py-3 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900", children: inv.team_name ?? `Team #${inv.team_id}` }), _jsxs("p", { className: "text-sm text-gray-500", children: ["From: ", inv.from_user_name ?? `User #${inv.from_user_id}`] }), _jsx("p", { className: "text-xs text-gray-400", children: inv.responded_at ? new Date(inv.responded_at).toLocaleString() : '—' })] }), _jsx("span", { className: `text-xs font-semibold px-3 py-1 rounded-full ${inv.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`, children: inv.status.charAt(0).toUpperCase() + inv.status.slice(1) })] }, inv.id))) })] }))] }));
}

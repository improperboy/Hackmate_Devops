import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { teamsApi } from '@/api/teams';
import { usersApi } from '@/api/users';
export default function SearchUsersPage() {
    const navigate = useNavigate();
    const qc = useQueryClient();
    const user = useAuthStore((s) => s.user);
    const [search, setSearch] = useState('');
    const [tech, setTech] = useState('');
    const [inviteMsg, setInviteMsg] = useState({});
    const [toast, setToast] = useState('');
    const [error, setError] = useState('');
    const { data: myTeam, isLoading: teamLoading } = useQuery({
        queryKey: ['my-team'],
        queryFn: teamsApi.getMyTeam,
        retry: false,
    });
    const isLeader = myTeam?.leader_id === user?.id;
    const { data: users = [], isLoading } = useQuery({
        queryKey: ['users-search', search, tech, myTeam?.id],
        queryFn: () => usersApi.search({ q: search || undefined, tech: tech || undefined, team_id: myTeam?.id }),
        enabled: isLeader,
    });
    const { mutate: sendInvite } = useMutation({
        mutationFn: ({ userId, msg }) => teamsApi.sendInvitation(myTeam.id, { to_user_id: userId, message: msg }),
        onSuccess: (_, vars) => {
            qc.invalidateQueries({ queryKey: ['users-search'] });
            showToast('Invitation sent successfully!');
            setInviteMsg((prev) => ({ ...prev, [vars.userId]: '' }));
        },
        onError: (err) => showError(err?.response?.data?.detail ?? 'Failed to send invitation.'),
    });
    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
    const showError = (msg) => { setError(msg); setTimeout(() => setError(''), 4000); };
    if (teamLoading)
        return _jsx("div", { className: "flex items-center justify-center h-64 text-gray-400", children: "Loading\u2026" });
    if (!myTeam || !isLeader) {
        navigate('/participant/dashboard');
        return null;
    }
    const canInvite = (myTeam.member_count ?? 0) < 4;
    return (_jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Find Members" }), _jsx("p", { className: "text-gray-500 text-sm", children: "Search and invite participants to join your team" })] }), _jsxs("span", { className: "text-sm text-gray-500", children: ["Team: ", _jsx("span", { className: "font-semibold", children: myTeam.name }), " (", myTeam.member_count ?? 0, "/4)"] })] }), toast && _jsx("div", { className: "bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm", children: toast }), error && _jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm", children: error }), !canInvite && (_jsx("div", { className: "bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-xl text-sm", children: "\u26A0\uFE0F Your team is full (4 members). You cannot invite more users." })), _jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-5", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-4", children: "Search & Filter Users" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Name or Email" }), _jsx("input", { type: "text", value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search by name or email...", className: "input" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Tech Stack" }), _jsx("input", { type: "text", value: tech, onChange: (e) => setTech(e.target.value), placeholder: "e.g., React, Python...", className: "input" })] }), _jsx("div", { className: "flex items-end", children: _jsx("button", { onClick: () => { setSearch(''); setTech(''); }, className: "w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl border border-gray-300 text-sm font-medium transition-colors", children: "Clear" }) })] })] }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200", children: [_jsx("div", { className: "px-5 py-4 border-b border-gray-200", children: _jsxs("h3", { className: "font-semibold text-gray-900", children: ["Available Users (", users.length, ")"] }) }), isLoading ? (_jsx("div", { className: "p-8 text-center text-gray-400", children: "Loading\u2026" })) : users.length === 0 ? (_jsx("div", { className: "p-8 text-center text-gray-500", children: "No users found matching your criteria." })) : (_jsx("div", { className: "divide-y divide-gray-200", children: users.map((u) => (_jsx(UserRow, { user: u, canInvite: canInvite, inviteMsg: inviteMsg[u.id] ?? '', onMsgChange: (v) => setInviteMsg((prev) => ({ ...prev, [u.id]: v })), onInvite: () => sendInvite({ userId: u.id, msg: inviteMsg[u.id] ?? '' }) }, u.id))) }))] })] }));
}
function UserRow({ user, canInvite, inviteMsg, onMsgChange, onInvite }) {
    const [showForm, setShowForm] = useState(false);
    const alreadyInTeam = (user.in_team ?? 0) > 0 || (user.is_leader ?? 0) > 0;
    const hasPendingInvite = (user.has_pending_invite ?? 0) > 0;
    return (_jsxs("div", { className: "p-5", children: [_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex items-start gap-3 flex-1", children: [_jsx("div", { className: "w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0", children: "\uD83D\uDC64" }), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "font-medium text-gray-900", children: user.name }), _jsx("p", { className: "text-sm text-gray-500", children: user.email }), user.tech_stack && (_jsx("div", { className: "flex flex-wrap gap-1 mt-2", children: user.tech_stack.split(',').map((t) => t.trim()).filter(Boolean).map((t) => (_jsx("span", { className: "text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full", children: t }, t))) }))] })] }), _jsx("div", { className: "shrink-0", children: alreadyInTeam ? (_jsx("span", { className: "text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full", children: "Already in team" })) : hasPendingInvite ? (_jsx("span", { className: "text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full", children: "\u23F3 Invitation sent" })) : canInvite ? (_jsx("button", { onClick: () => setShowForm(!showForm), className: "bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors", children: "\u2709\uFE0F Invite" })) : (_jsx("span", { className: "text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full", children: "Team full" })) })] }), showForm && canInvite && !alreadyInTeam && !hasPendingInvite && (_jsxs("div", { className: "mt-3 ml-13 space-y-2", children: [_jsx("textarea", { value: inviteMsg, onChange: (e) => onMsgChange(e.target.value), placeholder: "Add a personal message... (optional)", rows: 2, className: "input resize-none text-sm" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => { onInvite(); setShowForm(false); }, className: "bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors", children: "Send Invitation" }), _jsx("button", { onClick: () => setShowForm(false), className: "text-gray-500 hover:text-gray-700 text-sm px-3 py-1.5", children: "Cancel" })] })] }))] }));
}

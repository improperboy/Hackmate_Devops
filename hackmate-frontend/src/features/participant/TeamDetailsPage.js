import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { teamsApi } from '@/api/teams';
import { submissionsApi } from '@/api/submissions';
export default function TeamDetailsPage() {
    const { id } = useParams();
    const teamId = Number(id);
    const navigate = useNavigate();
    const qc = useQueryClient();
    const user = useAuthStore((s) => s.user);
    const [editing, setEditing] = useState(false);
    const [editForm, setEditForm] = useState({ idea: '', problem_statement: '' });
    const [toast, setToast] = useState('');
    const [error, setError] = useState('');
    const { data: team, isLoading } = useQuery({
        queryKey: ['team', teamId],
        queryFn: () => teamsApi.getTeam(teamId),
        enabled: !!teamId,
    });
    const { data: members = [] } = useQuery({
        queryKey: ['team-members', teamId],
        queryFn: () => teamsApi.getMembers(teamId),
        enabled: !!teamId,
    });
    const { data: submission } = useQuery({
        queryKey: ['submission', teamId],
        queryFn: () => submissionsApi.getByTeam(teamId),
        enabled: !!teamId,
        retry: false,
    });
    const isLeader = team?.leader_id === user?.id;
    const { mutate: updateTeam, isPending: updating } = useMutation({
        mutationFn: () => teamsApi.updateTeam(teamId, editForm),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['team', teamId] });
            setEditing(false);
            showToast('Team details updated!');
        },
        onError: (err) => showError(err?.response?.data?.detail ?? 'Update failed.'),
    });
    const { mutate: removeMember } = useMutation({
        mutationFn: (userId) => teamsApi.removeMember(teamId, userId),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['team-members', teamId] });
            showToast('Member removed.');
        },
        onError: (err) => showError(err?.response?.data?.detail ?? 'Failed to remove member.'),
    });
    const { mutate: leaveTeam } = useMutation({
        mutationFn: () => teamsApi.leaveTeam(teamId, user.id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['my-team'] });
            navigate('/participant/dashboard');
        },
        onError: (err) => showError(err?.response?.data?.detail ?? 'Failed to leave team.'),
    });
    const { mutate: deleteTeam } = useMutation({
        mutationFn: () => teamsApi.deleteTeam(teamId),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['my-team'] });
            navigate('/participant/dashboard');
        },
        onError: (err) => showError(err?.response?.data?.detail ?? 'Failed to delete team.'),
    });
    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
    const showError = (msg) => { setError(msg); setTimeout(() => setError(''), 4000); };
    const startEdit = () => {
        setEditForm({ idea: team?.idea ?? '', problem_statement: team?.problem_statement ?? '' });
        setEditing(true);
    };
    if (isLoading)
        return _jsx("div", { className: "flex items-center justify-center h-64 text-gray-400", children: "Loading\u2026" });
    if (!team)
        return _jsx("div", { className: "text-center text-gray-500 mt-20", children: "Team not found." });
    return (_jsxs("div", { className: "max-w-5xl mx-auto space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Team Details" }), _jsx("p", { className: "text-gray-500 text-sm", children: "Manage your team information and members" })] }), _jsxs("span", { className: "text-sm text-gray-500", children: ["Team: ", _jsx("span", { className: "font-semibold", children: team.name })] })] }), toast && _jsx("div", { className: "bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm", children: toast }), error && _jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm", children: error }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 space-y-5", children: [_jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-5", children: [_jsxs("div", { className: "flex items-center justify-between mb-5", children: [_jsx("h3", { className: "font-semibold text-gray-900", children: "Team Information" }), isLeader && !editing && (_jsx("button", { onClick: startEdit, className: "text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg transition-colors", children: "\u270F\uFE0F Edit Details" }))] }), !editing ? (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-500", children: "Team Name" }), _jsx("p", { className: "font-semibold text-gray-900", children: team.name })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-500", children: "Status" }), _jsx(StatusBadge, { status: team.status })] }), team.theme_name && (_jsx("div", { className: "flex items-center gap-2", children: _jsxs("div", { children: [_jsx("p", { className: "text-gray-500", children: "Theme" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "w-3 h-3 rounded-full", style: { backgroundColor: team.theme_color } }), _jsx("span", { className: "font-medium text-gray-900", children: team.theme_name })] })] }) })), team.floor_number && team.room_number && (_jsxs("div", { children: [_jsx("p", { className: "text-gray-500", children: "Location" }), _jsxs("p", { className: "font-medium text-gray-900", children: ["Floor ", team.floor_number, ", Room ", team.room_number] })] }))] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500 mb-1", children: "Project Idea" }), _jsx("p", { className: "text-gray-900 bg-gray-50 p-3 rounded-lg text-sm", children: team.idea || 'Not provided yet' })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500 mb-1", children: "Problem Statement" }), _jsx("p", { className: "text-gray-900 bg-gray-50 p-3 rounded-lg text-sm", children: team.problem_statement || 'Not provided yet' })] })] })) : (_jsxs("form", { onSubmit: (e) => { e.preventDefault(); updateTeam(); }, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "\uD83D\uDCA1 Project Idea *" }), _jsx("textarea", { value: editForm.idea, onChange: (e) => setEditForm({ ...editForm, idea: e.target.value }), rows: 4, className: "input resize-none", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "\u2753 Problem Statement *" }), _jsx("textarea", { value: editForm.problem_statement, onChange: (e) => setEditForm({ ...editForm, problem_statement: e.target.value }), rows: 4, className: "input resize-none", required: true })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { type: "submit", disabled: updating, className: "bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors disabled:opacity-60", children: updating ? 'Saving…' : '💾 Save Changes' }), _jsx("button", { type: "button", onClick: () => setEditing(false), className: "bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-5 rounded-lg transition-colors", children: "Cancel" })] })] }))] }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-5", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-4", children: "\uD83D\uDCE4 Project Submission" }), submission ? (_jsxs("div", { className: "bg-green-50 border border-green-200 rounded-xl p-4", children: [_jsx("p", { className: "font-medium text-green-800 mb-3", children: "\u2705 Project Submitted Successfully!" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-500", children: "GitHub Repository" }), _jsx("a", { href: submission.github_link, target: "_blank", rel: "noreferrer", className: "text-blue-600 hover:underline break-all", children: submission.github_link })] }), submission.live_link && (_jsxs("div", { children: [_jsx("p", { className: "text-gray-500", children: "Live Demo" }), _jsx("a", { href: submission.live_link, target: "_blank", rel: "noreferrer", className: "text-blue-600 hover:underline break-all", children: submission.live_link })] })), _jsxs("div", { children: [_jsx("p", { className: "text-gray-500", children: "Tech Stack" }), _jsx("p", { className: "text-gray-800", children: submission.tech_stack })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-500", children: "Submitted" }), _jsx("p", { className: "text-gray-800", children: submission.submitted_at ? new Date(submission.submitted_at).toLocaleString() : '—' })] })] }), isLeader && (_jsx(Link, { to: "/participant/submit", className: "inline-block mt-3 bg-orange-600 hover:bg-orange-700 text-white px-4 py-1.5 rounded-lg text-sm transition-colors", children: "\u270F\uFE0F Update Submission" }))] })) : (_jsxs("div", { className: "bg-yellow-50 border border-yellow-200 rounded-xl p-4", children: [_jsx("p", { className: "font-medium text-yellow-800 mb-1", children: "\u26A0\uFE0F No Submission Yet" }), _jsx("p", { className: "text-yellow-700 text-sm mb-3", children: "Your team hasn't submitted the project yet." }), isLeader ? (_jsx(Link, { to: "/participant/submit", className: "bg-orange-600 hover:bg-orange-700 text-white px-4 py-1.5 rounded-lg text-sm transition-colors", children: "\uD83D\uDCE4 Submit Project" })) : (_jsx("p", { className: "text-yellow-600 text-sm", children: "Only the team leader can submit the project." }))] }))] })] }), _jsx("div", { className: "space-y-5", children: _jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-5", children: [_jsxs("h3", { className: "font-semibold text-gray-900 mb-4", children: ["\uD83D\uDC65 Team Members (", members.length, "/4)"] }), _jsx("div", { className: "space-y-3", children: members.map((m) => (_jsxs("div", { className: "flex items-center gap-3 bg-gray-50 rounded-xl p-3", children: [_jsx("div", { className: "w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0", children: (m.name ?? 'U').slice(0, 2).toUpperCase() }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("p", { className: "text-sm font-medium text-gray-900 truncate", children: m.name ?? `User #${m.user_id}` }), m.user_id === team.leader_id && _jsx("span", { className: "text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full", children: "Leader" })] }), _jsx("p", { className: "text-xs text-gray-500 truncate", children: m.email ?? '' })] }), isLeader && m.user_id !== team.leader_id && (_jsx("button", { onClick: () => {
                                                    if (confirm(`Remove ${m.name ?? 'this member'} from the team?`))
                                                        removeMember(m.user_id);
                                                }, className: "text-red-500 hover:text-red-700 p-1 rounded transition-colors", title: "Remove member", children: "\u2715" }))] }, m.id))) }), members.length < 4 && (_jsxs("div", { className: "mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800", children: ["\u2139\uFE0F Your team can have up to ", 4 - members.length, " more member(s)."] })), _jsxs("div", { className: "mt-5 pt-4 border-t border-gray-200", children: [_jsx("h4", { className: "text-sm font-semibold text-gray-700 mb-3", children: "Team Actions" }), isLeader ? (_jsxs("div", { children: [_jsx("button", { onClick: () => {
                                                        if (confirm(`Delete team "${team.name}"? This will remove all members and cannot be undone.`)) {
                                                            if (confirm('FINAL WARNING: This permanently deletes the team and all data. Are you sure?')) {
                                                                deleteTeam();
                                                            }
                                                        }
                                                    }, className: "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors", children: "\uD83D\uDDD1\uFE0F Delete Team" }), _jsx("p", { className: "text-xs text-gray-500 mt-2", children: "Deleting removes all members and cannot be undone." })] })) : (_jsxs("div", { children: [_jsx("button", { onClick: () => {
                                                        if (confirm('Leave this team? You will lose access to all team activities.'))
                                                            leaveTeam();
                                                    }, className: "bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors", children: "\uD83D\uDEAA Leave Team" }), _jsx("p", { className: "text-xs text-gray-500 mt-2", children: "Leaving removes you from all team activities." })] }))] })] }) })] })] }));
}
function StatusBadge({ status }) {
    const colors = {
        approved: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        rejected: 'bg-red-100 text-red-800',
    };
    return (_jsx("span", { className: `inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${colors[status] ?? 'bg-gray-100 text-gray-800'}`, children: status.charAt(0).toUpperCase() + status.slice(1) }));
}

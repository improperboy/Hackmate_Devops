import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client from '@/api/client';
import { adminApi } from '@/api/admin';
const statusBadge = {
    approved: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    rejected: 'bg-red-100 text-red-800',
};
export default function TeamsPage() {
    const qc = useQueryClient();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');
    const [approveModal, setApproveModal] = useState(null);
    const [selectedFloor, setSelectedFloor] = useState('');
    const [selectedRoom, setSelectedRoom] = useState('');
    const [detailsModal, setDetailsModal] = useState(null);
    const { data: teamsData, isLoading } = useQuery({
        queryKey: ['admin-teams', search, statusFilter],
        queryFn: () => client.get('/teams/admin/all', {
            params: { search: search || undefined, status: statusFilter || undefined }
        }).then((r) => r.data),
    });
    const { data: floors = [] } = useQuery({ queryKey: ['floors'], queryFn: adminApi.getFloors });
    const { data: rooms = [] } = useQuery({ queryKey: ['rooms'], queryFn: adminApi.getRooms });
    // Detail modal queries — only run when a team is selected
    const { data: detailTeam } = useQuery({
        queryKey: ['team-detail', detailsModal?.id],
        queryFn: () => client.get(`/teams/${detailsModal.id}`).then((r) => r.data),
        enabled: !!detailsModal,
    });
    const { data: detailMembers = [] } = useQuery({
        queryKey: ['team-members', detailsModal?.id],
        queryFn: () => client.get(`/teams/${detailsModal.id}/members`).then((r) => r.data),
        enabled: !!detailsModal,
    });
    const { data: detailSubmission } = useQuery({
        queryKey: ['team-submission', detailsModal?.id],
        queryFn: () => client.get(`/submissions/team/${detailsModal.id}`)
            .then((r) => r.data)
            .catch(() => null),
        enabled: !!detailsModal,
    });
    const { data: detailScores = [] } = useQuery({
        queryKey: ['team-scores', detailsModal?.id],
        queryFn: () => client.get(`/scores/team/${detailsModal.id}`)
            .then((r) => r.data)
            .catch(() => []),
        enabled: !!detailsModal,
    });
    const teams = teamsData?.teams ?? [];
    const approveTeam = useMutation({
        mutationFn: ({ id, floor_id, room_id }) => client.put(`/teams/${id}/approve`, { floor_id, room_id }).then((r) => r.data),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-teams'] }); setMsg('Team approved!'); setApproveModal(null); },
        onError: (e) => {
            const detail = e?.response?.data?.detail;
            if (Array.isArray(detail))
                setErr(detail.map((d) => d.msg ?? JSON.stringify(d)).join(', '));
            else
                setErr(typeof detail === 'string' ? detail : 'Failed to approve');
        },
    });
    const rejectTeam = useMutation({
        mutationFn: (id) => client.put(`/teams/${id}/reject`).then((r) => r.data),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-teams'] }); setMsg('Team rejected'); },
        onError: () => setErr('Failed to reject team'),
    });
    const deleteTeam = useMutation({
        mutationFn: (id) => client.delete(`/teams/${id}`).then((r) => r.data),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-teams'] }); setMsg('Team deleted'); },
        onError: () => setErr('Failed to delete team'),
    });
    const filteredRooms = selectedFloor
        ? rooms.filter((r) => r.floor_id === Number(selectedFloor))
        : rooms;
    const handleExportPdf = async (teamId) => {
        try {
            const blob = await adminApi.exportTeamPdf(teamId);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `team_${teamId}_report.pdf`;
            a.click();
            URL.revokeObjectURL(url);
        }
        catch {
            setErr('Failed to export PDF');
        }
    };
    const activeTeam = detailTeam ?? detailsModal;
    return (_jsxs("div", { className: "space-y-5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Teams Management" }), _jsx("p", { className: "text-gray-500 text-sm mt-0.5", children: "Manage team registrations and approvals" })] }), _jsx("div", { className: "flex gap-2", children: teams.filter((t) => t.status === 'pending').length > 0 && (_jsxs("span", { className: "bg-orange-100 text-orange-800 px-3 py-1.5 rounded-lg text-sm font-medium", children: ["\u23F3 ", teams.filter((t) => t.status === 'pending').length, " Pending"] })) })] }), msg && _jsx("div", { className: "bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm", children: msg }), err && _jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm", children: err }), _jsxs("div", { className: "bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3", children: [_jsx("input", { type: "text", placeholder: "Search teams\u2026", value: search, onChange: (e) => setSearch(e.target.value), className: "flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" }), _jsxs("select", { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), className: "px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500", children: [_jsx("option", { value: "", children: "All Statuses" }), _jsx("option", { value: "pending", children: "Pending" }), _jsx("option", { value: "approved", children: "Approved" }), _jsx("option", { value: "rejected", children: "Rejected" })] }), _jsx("button", { onClick: () => { setSearch(''); setStatusFilter(''); }, className: "px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors", children: "Clear" })] }), _jsxs("div", { className: "bg-white rounded-xl border border-gray-200 overflow-hidden", children: [_jsx("div", { className: "px-5 py-3 border-b border-gray-100", children: _jsxs("h3", { className: "font-semibold text-gray-900", children: ["All Teams (", teams.length, ")"] }) }), isLoading ? (_jsx("div", { className: "py-12 text-center text-gray-400", children: "Loading\u2026" })) : teams.length === 0 ? (_jsx("div", { className: "py-12 text-center text-gray-400", children: "No teams found" })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-gray-50 text-xs text-gray-500 uppercase tracking-wide", children: _jsxs("tr", { children: [_jsx("th", { className: "px-5 py-3 text-left", children: "Team" }), _jsx("th", { className: "px-5 py-3 text-left", children: "Leader" }), _jsx("th", { className: "px-5 py-3 text-left", children: "Members" }), _jsx("th", { className: "px-5 py-3 text-left", children: "Location" }), _jsx("th", { className: "px-5 py-3 text-left", children: "Status" }), _jsx("th", { className: "px-5 py-3 text-left", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-100", children: teams.map((team) => (_jsxs("tr", { className: "hover:bg-gray-50 transition-colors", children: [_jsxs("td", { className: "px-5 py-3", children: [_jsx("div", { className: "font-medium text-gray-900", children: team.name }), team.idea && _jsx("div", { className: "text-xs text-gray-500 truncate max-w-[200px]", children: team.idea })] }), _jsx("td", { className: "px-5 py-3 text-gray-600", children: team.leader_name ?? '—' }), _jsxs("td", { className: "px-5 py-3 text-gray-600", children: [team.member_count ?? '—', "/4"] }), _jsx("td", { className: "px-5 py-3 text-gray-600", children: team.floor_number
                                                    ? `${team.floor_number} - ${team.room_number}`
                                                    : _jsx("span", { className: "text-red-500 text-xs", children: "Not assigned" }) }), _jsx("td", { className: "px-5 py-3", children: _jsx("span", { className: `px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadge[team.status ?? 'pending']}`, children: team.status }) }), _jsx("td", { className: "px-5 py-3", children: _jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx("button", { onClick: () => { setMsg(''); setErr(''); setDetailsModal(team); }, className: "text-blue-600 hover:text-blue-800 text-xs font-medium", children: "\uD83D\uDC41 View" }), team.status === 'pending' && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => { setMsg(''); setErr(''); setApproveModal({ team }); setSelectedFloor(''); setSelectedRoom(''); }, className: "text-green-600 hover:text-green-800 text-xs font-medium", children: "\u2713 Approve" }), _jsx("button", { onClick: () => { if (confirm('Reject this team?')) {
                                                                        setMsg('');
                                                                        setErr('');
                                                                        rejectTeam.mutate(team.id);
                                                                    } }, className: "text-red-500 hover:text-red-700 text-xs font-medium", children: "\u2717 Reject" })] })), _jsx("button", { onClick: () => { if (confirm('Delete this team?')) {
                                                                setMsg('');
                                                                setErr('');
                                                                deleteTeam.mutate(team.id);
                                                            } }, className: "text-gray-400 hover:text-gray-600 text-xs font-medium", children: "Delete" })] }) })] }, team.id))) })] }) }))] }), approveModal && (_jsx("div", { className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-white rounded-xl shadow-xl w-full max-w-md p-6", children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: ["Approve Team: ", _jsx("span", { className: "text-indigo-600", children: approveModal.team.name })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Assign Floor *" }), _jsxs("select", { value: selectedFloor, onChange: (e) => { setSelectedFloor(e.target.value); setSelectedRoom(''); }, className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500", children: [_jsx("option", { value: "", children: "Select Floor" }), floors.map((f) => _jsx("option", { value: f.id, children: f.floor_number }, f.id))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Assign Room *" }), _jsxs("select", { value: selectedRoom, onChange: (e) => setSelectedRoom(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500", children: [_jsx("option", { value: "", children: "Select Room" }), filteredRooms.map((r) => _jsxs("option", { value: r.id, children: ["Room ", r.room_number, " (Cap: ", r.capacity, ")"] }, r.id))] })] })] }), _jsxs("div", { className: "flex gap-3 mt-5", children: [_jsx("button", { disabled: !selectedFloor || !selectedRoom, onClick: () => approveTeam.mutate({ id: approveModal.team.id, floor_id: Number(selectedFloor), room_id: Number(selectedRoom) }), className: "flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-2 rounded-lg text-sm font-medium transition-colors", children: "\u2713 Approve & Assign" }), _jsx("button", { onClick: () => setApproveModal(null), className: "flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors", children: "Cancel" })] })] }) })), detailsModal && (_jsx("div", { className: "fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4", onClick: () => setDetailsModal(null), children: _jsxs("div", { className: "bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-start justify-between mb-5", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900", children: activeTeam?.name }), _jsx("button", { onClick: () => setDetailsModal(null), className: "text-gray-400 hover:text-gray-600 text-2xl leading-none", children: "\u00D7" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1", children: "\u2139\uFE0F General Information" }), _jsxs("div", { className: "bg-gray-50 rounded-lg p-3 space-y-1.5 text-sm", children: [_jsxs("p", { children: [_jsx("span", { className: "font-medium text-gray-600", children: "Leader:" }), " ", activeTeam?.leader_name ?? '—', " ", activeTeam?.leader_email ? `(${activeTeam.leader_email})` : ''] }), _jsxs("p", { children: [_jsx("span", { className: "font-medium text-gray-600", children: "Members:" }), " ", activeTeam?.member_count ?? detailMembers.length, "/4"] }), _jsxs("p", { children: [_jsx("span", { className: "font-medium text-gray-600", children: "Location:" }), " ", activeTeam?.floor_number ? `${activeTeam.floor_number} - ${activeTeam.room_number}` : 'Not assigned'] }), _jsxs("p", { children: [_jsx("span", { className: "font-medium text-gray-600", children: "Status:" }), ' ', _jsx("span", { className: `px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadge[activeTeam?.status ?? 'pending']}`, children: activeTeam?.status })] }), activeTeam?.created_at && (_jsxs("p", { children: [_jsx("span", { className: "font-medium text-gray-600", children: "Created:" }), " ", new Date(activeTeam.created_at).toLocaleString()] }))] })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-semibold text-gray-700 mb-1", children: "Project Idea" }), _jsx("p", { className: "bg-gray-50 rounded-lg p-3 text-sm text-gray-700", children: activeTeam?.idea || 'Not provided yet' })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-semibold text-gray-700 mb-1", children: "Problem Statement" }), _jsx("p", { className: "bg-gray-50 rounded-lg p-3 text-sm text-gray-700", children: activeTeam?.problem_statement || 'Not provided yet' })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-semibold text-gray-700 mb-2", children: "\uD83D\uDCE6 Submission" }), _jsx("div", { className: "bg-gray-50 rounded-lg p-3 text-sm space-y-1.5", children: detailSubmission ? (_jsxs(_Fragment, { children: [_jsx("p", { className: "text-green-700 font-medium", children: "\u2713 Project Submitted" }), detailSubmission.github_link && (_jsxs("p", { children: [_jsx("span", { className: "font-medium text-gray-600", children: "GitHub:" }), ' ', _jsx("a", { href: detailSubmission.github_link, target: "_blank", rel: "noreferrer", className: "text-blue-600 hover:underline break-all", children: detailSubmission.github_link })] })), detailSubmission.live_link && (_jsxs("p", { children: [_jsx("span", { className: "font-medium text-gray-600", children: "Live Demo:" }), ' ', _jsx("a", { href: detailSubmission.live_link, target: "_blank", rel: "noreferrer", className: "text-blue-600 hover:underline break-all", children: detailSubmission.live_link })] })), detailSubmission.tech_stack && (_jsxs("p", { children: [_jsx("span", { className: "font-medium text-gray-600", children: "Tech Stack:" }), " ", detailSubmission.tech_stack] })), detailSubmission.submitted_at && (_jsxs("p", { children: [_jsx("span", { className: "font-medium text-gray-600", children: "Submitted:" }), " ", new Date(detailSubmission.submitted_at).toLocaleString()] }))] })) : (_jsx("p", { className: "text-yellow-700 font-medium", children: "\u23F3 Not Submitted Yet" })) })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-semibold text-gray-700 mb-2", children: "\uD83D\uDC65 Team Members" }), detailMembers.length === 0 ? (_jsx("p", { className: "text-gray-400 text-sm", children: "No members found." })) : (_jsx("div", { className: "space-y-2", children: detailMembers.map((m) => (_jsxs("div", { className: "flex items-center gap-3 bg-gray-50 rounded-lg p-2.5", children: [_jsx("span", { className: "text-lg", children: m.user_id === activeTeam?.leader_id ? '👑' : '👤' }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-medium text-gray-900 truncate", children: m.name ?? `User #${m.user_id}` }), _jsx("p", { className: "text-xs text-gray-500 truncate", children: m.email ?? '' }), _jsx("p", { className: "text-xs text-gray-400", children: m.user_id === activeTeam?.leader_id ? 'Team Leader' : m.joined_at ? `Joined: ${new Date(m.joined_at).toLocaleDateString()}` : '' })] })] }, m.user_id))) }))] }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-semibold text-gray-700 mb-2", children: "\u2B50 Mentor Scores" }), detailScores.length === 0 ? (_jsx("p", { className: "text-gray-400 text-sm", children: "No scores recorded yet." })) : (_jsx("div", { className: "space-y-2", children: detailScores.map((s) => (_jsxs("div", { className: "border-l-4 border-blue-400 bg-blue-50 rounded p-3", children: [_jsxs("div", { className: "flex justify-between items-start mb-1", children: [_jsxs("p", { className: "text-sm font-medium text-gray-900", children: [s.round_name ?? 'Round', " by ", s.mentor_name ?? '—'] }), _jsxs("span", { className: "text-sm font-bold text-blue-600", children: [s.score, "/", s.max_score ?? '?'] })] }), s.comment && _jsx("p", { className: "text-xs text-gray-600", children: s.comment }), s.created_at && _jsx("p", { className: "text-xs text-gray-400 mt-1", children: new Date(s.created_at).toLocaleString() })] }, s.id))) }))] })] })] }), _jsxs("div", { className: "flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100", children: [_jsx("button", { onClick: () => handleExportPdf(detailsModal.id), className: "flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors", children: "\uD83D\uDCC4 Export PDF Report" }), _jsx("button", { onClick: () => setDetailsModal(null), className: "px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors", children: "Close" })] })] }) }))] }));
}

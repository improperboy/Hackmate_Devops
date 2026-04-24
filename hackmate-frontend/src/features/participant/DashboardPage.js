import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { teamsApi } from '@/api/teams';
import { submissionsApi } from '@/api/submissions';
import { Users, Upload, Trophy, Clock, CheckCircle, AlertTriangle, Send } from 'lucide-react';
export default function ParticipantDashboard() {
    const user = useAuthStore((s) => s.user);
    const { data: myTeam, isLoading: teamLoading } = useQuery({
        queryKey: ['my-team'],
        queryFn: teamsApi.getMyTeam,
        retry: false,
    });
    const { data: myJoinRequests } = useQuery({
        queryKey: ['my-join-requests'],
        queryFn: teamsApi.getMyJoinRequests,
        enabled: !myTeam,
    });
    const { data: submission } = useQuery({
        queryKey: ['submission', myTeam?.id],
        queryFn: () => submissionsApi.getByTeam(myTeam.id),
        enabled: !!myTeam?.id,
        retry: false,
    });
    const { data: submissionSettings } = useQuery({
        queryKey: ['submission-settings'],
        queryFn: submissionsApi.getSettings,
        retry: false,
    });
    const pendingRequests = (myJoinRequests ?? []).filter((r) => r.status === 'pending');
    const isLeader = myTeam?.leader_id === user?.id;
    const submissionStatus = submission ? 'Submitted' : submissionSettings ? 'Pending' : 'Not Available';
    if (teamLoading) {
        return _jsx("div", { className: "flex items-center justify-center h-64 text-gray-400", children: "Loading dashboard\u2026" });
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Welcome Back" }), _jsxs("p", { className: "text-gray-500 mt-1", children: ["Hi ", user?.name, ", ready to build something amazing?"] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsx(StatCard, { label: "Team Status", value: myTeam ? 'Active' : 'No Team', sub: myTeam ? `Team: ${myTeam.name}` : undefined, subColor: "text-green-600", icon: _jsx(Users, { className: "text-white w-5 h-5" }), gradient: "from-blue-500 to-purple-600" }), myTeam ? (_jsxs(_Fragment, { children: [_jsx(StatCard, { label: "Team Members", value: `${myTeam.member_count ?? '—'}/4`, sub: (myTeam.member_count ?? 0) < 4 ? 'Can add more members' : 'Team is full', icon: _jsx(Users, { className: "text-white w-5 h-5" }), gradient: "from-orange-500 to-red-600" }), _jsx(StatCard, { label: "Submission", value: submissionStatus, sub: submission ? 'Project submitted' : submissionSettings ? 'Submission pending' : 'Submissions closed', icon: submission ? _jsx(CheckCircle, { className: "text-white w-5 h-5" }) : _jsx(Upload, { className: "text-white w-5 h-5" }), gradient: "from-purple-500 to-pink-600" }), _jsx(StatCard, { label: "Location", value: myTeam.floor_number && myTeam.room_number ? `F${myTeam.floor_number} R${myTeam.room_number}` : 'Not Assigned', icon: _jsx(Trophy, { className: "text-white w-5 h-5" }), gradient: "from-green-500 to-teal-600" })] })) : (_jsx(StatCard, { label: "Your Requests", value: String(pendingRequests.length), sub: pendingRequests.length > 0 ? 'Pending responses' : 'No active requests', icon: _jsx(Send, { className: "text-white w-5 h-5" }), gradient: "from-purple-500 to-pink-600" }))] }), _jsx(StatusBanner, { myTeam: myTeam, pendingRequests: pendingRequests }), submissionSettings && myTeam?.status === 'approved' && (_jsx(Countdown, { endTime: submissionSettings.end_time })), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsx(QuickActions, { myTeam: myTeam, isLeader: isLeader, pendingRequests: pendingRequests, submission: submission, submissionSettings: submissionSettings }), myTeam && _jsx(TeamMembersCard, { teamId: myTeam.id, leaderId: myTeam.leader_id }), myTeam && submission && _jsx(SubmissionCard, { submission: submission })] }), _jsx("div", { children: _jsx(QuickLinks, { myTeam: myTeam, isLeader: isLeader }) })] })] }));
}
// ── Sub-components ──────────────────────────────────────────────────────────
function StatCard({ label, value, sub, subColor, icon, gradient }) {
    return (_jsxs("div", { className: "bg-white rounded-2xl p-5 shadow-sm border border-gray-100", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: label }), _jsx("p", { className: "text-2xl font-bold text-gray-900 mt-1", children: value })] }), _jsx("div", { className: `w-11 h-11 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center`, children: icon })] }), sub && _jsx("p", { className: `text-sm mt-3 ${subColor ?? 'text-gray-500'} truncate`, children: sub })] }));
}
function StatusBanner({ myTeam, pendingRequests }) {
    if (myTeam) {
        return (_jsxs("div", { className: `${myTeam.status === 'pending' ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'} border rounded-2xl p-5 flex items-start gap-4`, children: [_jsx("div", { className: `w-10 h-10 ${myTeam.status === 'pending' ? 'bg-orange-500' : 'bg-green-500'} rounded-xl flex items-center justify-center shrink-0`, children: myTeam.status === 'pending' ? _jsx(Clock, { className: "text-white w-5 h-5" }) : _jsx(CheckCircle, { className: "text-white w-5 h-5" }) }), _jsxs("div", { children: [_jsxs("h3", { className: `font-semibold ${myTeam.status === 'pending' ? 'text-orange-900' : 'text-green-900'}`, children: ["You're part of team: ", myTeam.name, " ", myTeam.status === 'pending' && '(Pending Approval)'] }), myTeam.leader_name && _jsxs("p", { className: `${myTeam.status === 'pending' ? 'text-orange-700' : 'text-green-700'} text-sm mt-0.5`, children: ["Leader: ", myTeam.leader_name] }), myTeam.theme_name && (_jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsx("span", { className: "w-3 h-3 rounded-full", style: { backgroundColor: myTeam.theme_color } }), _jsxs("span", { className: `${myTeam.status === 'pending' ? 'text-orange-700' : 'text-green-700'} text-sm`, children: ["Theme: ", myTeam.theme_name] })] })), myTeam.floor_number && myTeam.room_number && (_jsxs("p", { className: `${myTeam.status === 'pending' ? 'text-orange-700' : 'text-green-700'} text-sm mt-1`, children: ["\uD83D\uDCCD Floor ", myTeam.floor_number, ", Room ", myTeam.room_number] }))] })] }));
    }
    if (pendingRequests.length > 0) {
        return (_jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-4", children: [_jsx("div", { className: "w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shrink-0", children: _jsx(Send, { className: "text-white w-5 h-5" }) }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h3", { className: "font-semibold text-blue-900", children: [pendingRequests.length, " Pending Join Request", pendingRequests.length > 1 ? 's' : ''] }), _jsx(Link, { to: "/participant/join-requests", className: "text-blue-600 text-sm hover:underline", children: "View Details \u2192" })] }), _jsx("p", { className: "text-blue-700 text-sm mt-1", children: "When a team accepts, all other pending requests are automatically cancelled." })] })] }));
    }
    return (_jsxs("div", { className: "bg-yellow-50 border border-yellow-200 rounded-2xl p-5 flex items-start gap-4", children: [_jsx("div", { className: "w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shrink-0", children: _jsx(AlertTriangle, { className: "text-white w-5 h-5" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-yellow-900", children: "Ready to Join the Action?" }), _jsx("p", { className: "text-yellow-700 text-sm mt-1", children: "Create a new team or join an existing one to participate." }), _jsxs("div", { className: "flex gap-3 mt-3", children: [_jsx(Link, { to: "/participant/team/create", className: "bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors", children: "Create Team" }), _jsx(Link, { to: "/participant/team/join", className: "bg-white text-yellow-700 px-4 py-2 rounded-lg text-sm font-medium border border-yellow-300 hover:bg-yellow-50 transition-colors", children: "Join Team" })] })] })] }));
}
function QuickActions({ myTeam, isLeader, pendingRequests, submission, submissionSettings }) {
    if (!myTeam) {
        return (_jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-5", children: [_jsx("h3", { className: "font-bold text-gray-900 mb-4", children: pendingRequests.length > 0 ? 'Actions' : 'Get Started' }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsx(ActionCard, { to: "/participant/team/create", gradient: "from-blue-500 to-indigo-600", icon: "\u2795", title: "Create Team", desc: "Start your own team and invite others." }), _jsx(ActionCard, { to: "/participant/team/join", gradient: "from-green-500 to-emerald-600", icon: "\uD83E\uDD1D", title: "Join Team", desc: "Find and join an existing team." })] })] }));
    }
    return (_jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-5", children: [_jsx("h3", { className: "font-bold text-gray-900 mb-4", children: "Team Actions" }), _jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: [_jsx(ActionCard, { to: `/participant/team/${myTeam.id}`, gradient: "from-purple-500 to-pink-600", icon: "\uD83D\uDC65", title: "Team Details", small: true }), isLeader && (_jsxs(_Fragment, { children: [_jsx(ActionCard, { to: "/participant/manage-requests", gradient: "from-indigo-500 to-blue-600", icon: "\u2705", title: "Join Requests", small: true }), _jsx(ActionCard, { to: "/participant/search-users", gradient: "from-cyan-500 to-teal-600", icon: "\uD83D\uDD0D", title: "Find Members", small: true }), submissionSettings && myTeam.status === 'approved' && (_jsx(ActionCard, { to: "/participant/submit", gradient: "from-orange-500 to-red-600", icon: "\uD83D\uDCE4", title: submission ? 'Update Project' : 'Submit Project', small: true }))] })), myTeam.status === 'approved' && (_jsx(ActionCard, { to: "/participant/mentoring-rounds", gradient: "from-teal-500 to-green-600", icon: "\uD83C\uDF93", title: "Mentoring", small: true })), _jsx(ActionCard, { to: "/participant/rankings", gradient: "from-yellow-500 to-orange-600", icon: "\uD83C\uDFC6", title: "Rankings", small: true })] })] }));
}
function ActionCard({ to, gradient, icon, title, desc, small }) {
    return (_jsxs(Link, { to: to, className: "group bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 rounded-xl p-4 transition-all", children: [_jsx("div", { className: `w-10 h-10 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform text-lg`, children: icon }), _jsx("p", { className: `font-medium text-gray-900 ${small ? 'text-sm' : ''}`, children: title }), desc && _jsx("p", { className: "text-xs text-gray-500 mt-0.5", children: desc })] }));
}
function TeamMembersCard({ teamId, leaderId }) {
    const { data: members = [] } = useQuery({
        queryKey: ['team-members', teamId],
        queryFn: () => teamsApi.getMembers(teamId),
    });
    return (_jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-5", children: [_jsxs("h3", { className: "font-bold text-gray-900 mb-4 flex items-center gap-2", children: [_jsx(Users, { className: "w-5 h-5 text-blue-500" }), " Team Members (", members.length, "/4)"] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: members.map((m) => (_jsxs("div", { className: "flex items-center gap-3 bg-gray-50 rounded-xl p-3", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0", children: (m.name ?? 'U').slice(0, 2).toUpperCase() }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("p", { className: "text-sm font-medium text-gray-900 truncate", children: m.name ?? `User #${m.user_id}` }), m.user_id === leaderId && (_jsx("span", { className: "text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full shrink-0", children: "Leader" }))] }), _jsx("p", { className: "text-xs text-gray-500 truncate", children: m.email ?? '' })] })] }, m.id))) })] }));
}
function SubmissionCard({ submission }) {
    return (_jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-5", children: [_jsxs("h3", { className: "font-bold text-gray-900 mb-4 flex items-center gap-2", children: [_jsx(CheckCircle, { className: "w-5 h-5 text-green-500" }), " Your Submission"] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-500 mb-1", children: "GitHub Repository" }), _jsx("a", { href: submission.github_link, target: "_blank", rel: "noreferrer", className: "text-blue-600 hover:underline break-all", children: submission.github_link })] }), submission.live_link && (_jsxs("div", { children: [_jsx("p", { className: "text-gray-500 mb-1", children: "Live Demo" }), _jsx("a", { href: submission.live_link, target: "_blank", rel: "noreferrer", className: "text-blue-600 hover:underline break-all", children: submission.live_link })] })), _jsxs("div", { children: [_jsx("p", { className: "text-gray-500 mb-1", children: "Tech Stack" }), _jsx("p", { className: "text-gray-800", children: submission.tech_stack })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-500 mb-1", children: "Submitted" }), _jsx("p", { className: "text-gray-800", children: submission.submitted_at ? new Date(submission.submitted_at).toLocaleString() : '—' })] })] })] }));
}
function Countdown({ endTime }) {
    const [timeLeft, setTimeLeft] = useState(calcTimeLeft(endTime));
    useEffect(() => {
        const t = setInterval(() => setTimeLeft(calcTimeLeft(endTime)), 1000);
        return () => clearInterval(t);
    }, [endTime]);
    const segments = [
        { label: 'Days', value: timeLeft.days, gradient: 'from-red-500 to-pink-600' },
        { label: 'Hours', value: timeLeft.hours, gradient: 'from-orange-500 to-red-600' },
        { label: 'Minutes', value: timeLeft.minutes, gradient: 'from-yellow-500 to-orange-600' },
        { label: 'Seconds', value: timeLeft.seconds, gradient: 'from-green-500 to-yellow-600' },
    ];
    return (_jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-5", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("h3", { className: "font-bold text-gray-900 flex items-center gap-2", children: [_jsx(Clock, { className: "w-5 h-5 text-red-500" }), " Submission Deadline"] }), _jsx("span", { className: "text-sm text-gray-500", children: new Date(endTime).toLocaleString() })] }), _jsx("div", { className: "grid grid-cols-4 gap-3", children: segments.map(({ label, value, gradient }) => (_jsxs("div", { className: `rounded-2xl p-4 text-center text-white bg-gradient-to-br ${gradient}`, children: [_jsx("div", { className: "text-3xl font-bold", children: String(value).padStart(2, '0') }), _jsx("div", { className: "text-xs opacity-90", children: label })] }, label))) })] }));
}
function QuickLinks(_) {
    const links = [
        { to: '/participant/rankings', label: '🏆 Rankings' },
        { to: '/participant/announcements', label: '📢 Announcements' },
        { to: '/participant/invitations', label: '✉️ Invitations' },
        { to: '/participant/support', label: '💬 Support' },
        { to: '/participant/change-password', label: '🔑 Change Password' },
    ];
    return (_jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-5", children: [_jsx("h3", { className: "font-bold text-gray-900 mb-3", children: "Quick Links" }), _jsx("div", { className: "space-y-1", children: links.map((l) => (_jsx(Link, { to: l.to, className: "flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors", children: l.label }, l.to))) })] }));
}
function calcTimeLeft(endTime) {
    const diff = Math.max(0, new Date(endTime).getTime() - Date.now());
    return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
    };
}

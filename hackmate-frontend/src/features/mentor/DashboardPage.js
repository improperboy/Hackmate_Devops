import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { mentorApi, classifyRound } from '@/api/mentor';
import { Users, Star, Clock, LifeBuoy, Calendar, ChevronRight } from 'lucide-react';
export default function MentorDashboard() {
    const user = useAuthStore((s) => s.user);
    const { data: teamsData } = useQuery({
        queryKey: ['mentor-assigned-teams'],
        queryFn: () => mentorApi.getAssignedTeams(),
    });
    const { data: allRounds = [] } = useQuery({
        queryKey: ['mentor-all-rounds'],
        queryFn: mentorApi.getAllRounds,
    });
    const { data: myScores = [] } = useQuery({
        queryKey: ['mentor-my-scores'],
        queryFn: mentorApi.getMyScores,
    });
    const { data: supportMessages = [] } = useQuery({
        queryKey: ['mentor-support-open'],
        queryFn: () => mentorApi.getSupportMessages({ status: 'open' }),
    });
    const teams = teamsData?.teams ?? [];
    const activeRounds = allRounds.filter((r) => classifyRound(r) === 'active');
    const upcomingRounds = allRounds.filter((r) => classifyRound(r) === 'upcoming').slice(0, 3);
    const teamsScored = new Set(myScores.map((s) => s.team_id)).size;
    const avgScore = myScores.length
        ? (myScores.reduce((a, s) => a + s.score, 0) / myScores.length).toFixed(1)
        : '0';
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-2xl font-bold mb-1", children: [greeting, ", ", user?.name, "!"] }), _jsx("p", { className: "text-green-100 mb-3", children: "Ready to guide and mentor amazing teams today?" }), teams.length > 0 ? (_jsxs("p", { className: "text-sm text-green-100", children: ["\uD83D\uDCCD ", teams.length, " team", teams.length !== 1 ? 's' : '', " assigned to you"] })) : (_jsx("div", { className: "bg-yellow-500/20 border border-yellow-300/40 rounded-lg px-3 py-2 text-sm text-yellow-100 mt-2", children: "\u26A0\uFE0F No assignments yet \u2014 contact admin for team assignments." }))] }), _jsx("div", { className: "hidden md:flex w-20 h-20 bg-white/20 rounded-full items-center justify-center text-4xl", children: "\uD83E\uDDD1\u200D\uD83C\uDFEB" })] }) }), _jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
                    { label: 'Assigned Teams', value: teams.length, sub: 'in your area', icon: Users, gradient: 'from-blue-500 to-blue-600' },
                    { label: 'Teams Scored', value: teamsScored, sub: `Avg: ${avgScore} pts`, icon: Star, gradient: 'from-green-500 to-green-600' },
                    { label: 'Active Rounds', value: activeRounds.length, sub: `${upcomingRounds.length} upcoming`, icon: Clock, gradient: 'from-purple-500 to-purple-600' },
                    { label: 'Support Requests', value: supportMessages.length, sub: 'open', icon: LifeBuoy, gradient: 'from-orange-500 to-orange-600' },
                ].map((s) => (_jsx("div", { className: "bg-white rounded-xl border border-gray-200 p-5", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: s.label }), _jsx("p", { className: "text-3xl font-bold text-gray-900", children: s.value }), _jsx("p", { className: "text-xs text-gray-400 mt-1", children: s.sub })] }), _jsx("div", { className: `w-11 h-11 bg-gradient-to-br ${s.gradient} rounded-xl flex items-center justify-center`, children: _jsx(s.icon, { className: "text-white w-5 h-5" }) })] }) }, s.label))) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white rounded-2xl border border-gray-200 p-5", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-4", children: "\u26A1 Quick Actions" }), _jsx("div", { className: "grid grid-cols-2 gap-3", children: [
                                    { label: 'Score Teams', desc: `${activeRounds.length} active`, to: '/mentor/score', icon: '⭐', color: 'from-blue-50 to-blue-100', iconBg: 'bg-blue-500' },
                                    { label: 'My Teams', desc: `${teams.length} teams`, to: '/mentor/teams', icon: '👥', color: 'from-purple-50 to-purple-100', iconBg: 'bg-purple-500' },
                                    { label: 'Support', desc: `${supportMessages.length} open`, to: '/mentor/support', icon: '🆘', color: 'from-green-50 to-green-100', iconBg: 'bg-green-500' },
                                    { label: 'Schedule', desc: 'View rounds', to: '/mentor/schedule', icon: '📅', color: 'from-indigo-50 to-indigo-100', iconBg: 'bg-indigo-500' },
                                ].map((a) => (_jsxs(Link, { to: a.to, className: `bg-gradient-to-br ${a.color} hover:opacity-90 p-4 rounded-xl text-center transition-all group`, children: [_jsx("div", { className: `w-11 h-11 ${a.iconBg} rounded-lg flex items-center justify-center mx-auto mb-2 text-xl group-hover:scale-110 transition-transform`, children: a.icon }), _jsx("p", { className: "text-sm font-medium text-gray-900", children: a.label }), _jsx("p", { className: "text-xs text-gray-500 mt-0.5", children: a.desc })] }, a.to))) })] }), _jsxs("div", { className: "bg-white rounded-2xl border border-gray-200 p-5", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("h3", { className: "font-semibold text-gray-900 flex items-center gap-2", children: [_jsx(Clock, { className: "w-4 h-4 text-blue-500" }), " Mentoring Rounds"] }), _jsxs(Link, { to: "/mentor/schedule", className: "text-xs text-indigo-600 hover:underline flex items-center gap-1", children: ["View all ", _jsx(ChevronRight, { className: "w-3 h-3" })] })] }), _jsxs("div", { className: "space-y-3 max-h-72 overflow-y-auto", children: [activeRounds.length > 0 && (_jsxs("div", { children: [_jsxs("p", { className: "text-xs font-medium text-gray-500 mb-2 flex items-center gap-1", children: [_jsx("span", { className: "w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block" }), " Active Now"] }), activeRounds.map((r) => (_jsxs("div", { className: "p-3 bg-green-50 border-l-4 border-green-500 rounded-xl mb-2", children: [_jsx("p", { className: "font-medium text-gray-900 text-sm", children: r.round_name }), _jsxs("p", { className: "text-xs text-gray-500 mt-0.5", children: ["Ends: ", new Date(r.end_time).toLocaleString(), " \u00B7 Max: ", r.max_score, " pts"] })] }, r.id)))] })), upcomingRounds.length > 0 && (_jsxs("div", { children: [_jsxs("p", { className: "text-xs font-medium text-gray-500 mb-2 flex items-center gap-1", children: [_jsx("span", { className: "w-2 h-2 bg-blue-500 rounded-full inline-block" }), " Upcoming"] }), upcomingRounds.map((r) => (_jsxs("div", { className: "p-3 bg-blue-50 border-l-4 border-blue-500 rounded-xl mb-2", children: [_jsx("p", { className: "font-medium text-gray-900 text-sm", children: r.round_name }), _jsxs("p", { className: "text-xs text-gray-500 mt-0.5", children: ["Starts: ", new Date(r.start_time).toLocaleString(), " \u00B7 Max: ", r.max_score, " pts"] })] }, r.id)))] })), activeRounds.length === 0 && upcomingRounds.length === 0 && (_jsxs("div", { className: "py-8 text-center text-gray-400", children: [_jsx(Calendar, { className: "w-8 h-8 mx-auto mb-2 opacity-40" }), _jsx("p", { className: "text-sm", children: "No rounds scheduled" })] }))] })] })] })] }));
}

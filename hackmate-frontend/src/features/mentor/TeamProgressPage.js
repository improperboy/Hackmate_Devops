import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { mentorApi } from '@/api/mentor';
import { ArrowLeft, TrendingUp } from 'lucide-react';
export default function TeamProgressPage() {
    const { id } = useParams();
    const teamId = Number(id);
    const { data: progress, isLoading } = useQuery({
        queryKey: ['team-progress', teamId],
        queryFn: () => mentorApi.getTeamProgress(teamId),
        enabled: !!teamId,
    });
    const { data: teamsData } = useQuery({
        queryKey: ['mentor-assigned-teams'],
        queryFn: () => mentorApi.getAssignedTeams(),
    });
    const team = teamsData?.teams.find((t) => t.id === teamId);
    return (_jsxs("div", { className: "space-y-5", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Link, { to: "/mentor/teams", className: "p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors", children: _jsx(ArrowLeft, { className: "w-4 h-4 text-gray-600" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Team Progress" }), _jsx("p", { className: "text-gray-500 text-sm mt-0.5", children: team?.name ?? `Team #${teamId}` })] })] }), isLoading ? (_jsx("div", { className: "py-16 text-center text-gray-400", children: "Loading progress\u2026" })) : !progress || progress.rounds.length === 0 ? (_jsxs("div", { className: "bg-white rounded-2xl border border-gray-200 p-16 text-center", children: [_jsx(TrendingUp, { className: "w-12 h-12 text-gray-300 mx-auto mb-4" }), _jsx("p", { className: "text-gray-500", children: "No scoring data available for this team yet" })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-5 text-white", children: [_jsx("p", { className: "text-green-100 text-sm mb-1", children: "Overall Average Score" }), _jsx("p", { className: "text-4xl font-bold", children: progress.overall_avg }), _jsxs("p", { className: "text-green-100 text-sm mt-1", children: ["across ", progress.rounds.length, " round", progress.rounds.length !== 1 ? 's' : ''] })] }), _jsxs("div", { className: "bg-white rounded-2xl border border-gray-200 overflow-hidden", children: [_jsx("div", { className: "px-5 py-4 border-b border-gray-100", children: _jsx("h3", { className: "font-semibold text-gray-900", children: "Round Breakdown" }) }), _jsx("div", { className: "divide-y divide-gray-100", children: progress.rounds.map((r) => (_jsxs("div", { className: "px-5 py-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900 text-sm", children: r.round_name }), _jsxs("p", { className: "text-xs text-gray-500", children: [r.mentor_count, " mentor", r.mentor_count !== 1 ? 's' : '', " scored"] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: "font-bold text-gray-900", children: [r.avg_score, " ", _jsxs("span", { className: "text-xs text-gray-400 font-normal", children: ["/ ", r.max_score] })] }), _jsxs("span", { className: `text-xs px-2 py-0.5 rounded-full font-medium ${r.percentage >= 80 ? 'bg-green-100 text-green-700'
                                                                : r.percentage >= 60 ? 'bg-yellow-100 text-yellow-700'
                                                                    : 'bg-red-100 text-red-700'}`, children: [r.percentage, "%"] })] })] }), _jsx("div", { className: "w-full bg-gray-100 rounded-full h-2", children: _jsx("div", { className: `h-2 rounded-full transition-all ${r.percentage >= 80 ? 'bg-green-500'
                                                    : r.percentage >= 60 ? 'bg-yellow-500'
                                                        : 'bg-red-500'}`, style: { width: `${r.percentage}%` } }) })] }, r.round_id))) })] })] }))] }));
}

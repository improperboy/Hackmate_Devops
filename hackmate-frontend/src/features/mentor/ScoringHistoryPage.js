import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { mentorApi } from '@/api/mentor';
import { Star, Clock } from 'lucide-react';
export default function ScoringHistoryPage() {
    const { data: scores = [], isLoading } = useQuery({
        queryKey: ['mentor-my-scores'],
        queryFn: mentorApi.getMyScores,
    });
    const { data: allRounds = [] } = useQuery({
        queryKey: ['mentor-all-rounds'],
        queryFn: mentorApi.getAllRounds,
    });
    const { data: teamsData } = useQuery({
        queryKey: ['mentor-assigned-teams'],
        queryFn: () => mentorApi.getAssignedTeams(),
    });
    const roundMap = Object.fromEntries(allRounds.map((r) => [r.id, r]));
    const teamMap = Object.fromEntries((teamsData?.teams ?? []).map((t) => [t.id, t]));
    const timeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60)
            return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24)
            return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    };
    return (_jsxs("div", { className: "space-y-5", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Scoring History" }), _jsx("p", { className: "text-gray-500 text-sm mt-0.5", children: "All scores you have submitted" })] }), _jsx("div", { className: "grid grid-cols-3 gap-4", children: [
                    { label: 'Total Scores', value: scores.length, icon: '📋', gradient: 'from-blue-500 to-indigo-600' },
                    { label: 'Teams Scored', value: new Set(scores.map((s) => s.team_id)).size, icon: '👥', gradient: 'from-green-500 to-teal-600' },
                    { label: 'Rounds Participated', value: new Set(scores.map((s) => s.round_id)).size, icon: '🏆', gradient: 'from-purple-500 to-pink-600' },
                ].map((s) => (_jsxs("div", { className: "bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3", children: [_jsx("div", { className: `w-11 h-11 bg-gradient-to-br ${s.gradient} rounded-xl flex items-center justify-center text-lg`, children: s.icon }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold text-gray-900", children: s.value }), _jsx("div", { className: "text-xs text-gray-500", children: s.label })] })] }, s.label))) }), _jsxs("div", { className: "bg-white rounded-2xl border border-gray-200 overflow-hidden", children: [_jsx("div", { className: "px-5 py-4 border-b border-gray-100", children: _jsx("h3", { className: "font-semibold text-gray-900", children: "Score History" }) }), isLoading ? (_jsx("div", { className: "py-12 text-center text-gray-400", children: "Loading\u2026" })) : scores.length === 0 ? (_jsxs("div", { className: "py-16 text-center", children: [_jsx(Star, { className: "w-10 h-10 text-gray-300 mx-auto mb-3" }), _jsx("p", { className: "text-gray-500", children: "No scores submitted yet" })] })) : (_jsx("div", { className: "divide-y divide-gray-100", children: scores.map((s) => {
                            const round = roundMap[s.round_id];
                            const team = teamMap[s.team_id];
                            const pct = round ? Math.round((s.score / round.max_score) * 100) : null;
                            return (_jsx("div", { className: "px-5 py-4 hover:bg-gray-50 transition-colors", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shrink-0", children: _jsx(Star, { className: "text-white w-4 h-4" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between gap-2 mb-1", children: [_jsx("p", { className: "font-semibold text-gray-900 text-sm", children: team?.name ?? `Team #${s.team_id}` }), _jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [_jsx("span", { className: "text-lg font-bold text-gray-900", children: s.score }), round && _jsxs("span", { className: "text-xs text-gray-400", children: ["/ ", round.max_score] }), pct !== null && (_jsxs("span", { className: `text-xs px-2 py-0.5 rounded-full font-medium ${pct >= 80 ? 'bg-green-100 text-green-700'
                                                                        : pct >= 60 ? 'bg-yellow-100 text-yellow-700'
                                                                            : 'bg-red-100 text-red-700'}`, children: [pct, "%"] }))] })] }), _jsxs("p", { className: "text-xs text-gray-500 mb-1", children: ["Round: ", round?.round_name ?? `#${s.round_id}`] }), s.comment && (_jsxs("p", { className: "text-xs text-gray-600 bg-gray-50 rounded-lg px-2 py-1 mt-1 line-clamp-2", children: ["\uD83D\uDCAC ", s.comment] })), s.created_at && (_jsxs("p", { className: "text-xs text-gray-400 mt-1 flex items-center gap-1", children: [_jsx(Clock, { className: "w-3 h-3" }), " ", timeAgo(s.created_at)] }))] })] }) }, s.id));
                        }) }))] })] }));
}

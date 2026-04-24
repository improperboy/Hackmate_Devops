import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import client from '@/api/client';
import { teamsApi } from '@/api/teams';
import { Trophy, Users, Clock } from 'lucide-react';
export default function RankingsPage() {
    const { data: rankings = [], isLoading, error: rankingsError } = useQuery({
        queryKey: ['participant-rankings'],
        queryFn: () => client.get('/rankings/').then((r) => r.data.rankings ?? []),
        retry: false,
    });
    const { data: myTeam } = useQuery({
        queryKey: ['my-team'],
        queryFn: teamsApi.getMyTeam,
        retry: false,
    });
    const { data: settingsRaw } = useQuery({
        queryKey: ['public-settings'],
        queryFn: () => client.get('/admin/settings/public').then((r) => r.data),
        retry: false,
    });
    const settings = Array.isArray(settingsRaw) ? settingsRaw : [];
    const rankingsVisible = settings.find((s) => s.setting_key === 'rankings_visible')?.setting_value;
    // Also treat a 403 from the rankings endpoint as "not visible"
    const rankingsBlocked = rankingsError?.response?.status === 403;
    const isVisible = !rankingsBlocked && (rankingsVisible === '1' || rankingsVisible === 'true');
    const myTeamRanking = myTeam ? rankings.find((r) => r.team_id === myTeam.id) : null;
    const medalColor = (rank) => {
        if (rank === 1)
            return 'from-yellow-400 to-yellow-600';
        if (rank === 2)
            return 'from-gray-300 to-gray-500';
        if (rank === 3)
            return 'from-amber-600 to-orange-700';
        return 'from-gray-100 to-gray-200';
    };
    if (isLoading) {
        return _jsx("div", { className: "flex items-center justify-center h-64 text-gray-400", children: "Loading rankings\u2026" });
    }
    if (!isVisible) {
        return (_jsxs("div", { className: "space-y-5", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Team Rankings" }), _jsx("p", { className: "text-gray-500 text-sm mt-0.5", children: "See how teams are performing in the hackathon" })] }), _jsxs("div", { className: "bg-white rounded-2xl border border-gray-200 p-16 text-center", children: [_jsx("div", { className: "w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6", children: _jsx("span", { className: "text-4xl", children: "\uD83D\uDE48" }) }), _jsx("h2", { className: "text-xl font-bold text-gray-900 mb-2", children: "Rankings Not Available Yet" }), _jsx("p", { className: "text-gray-500 max-w-sm mx-auto", children: "Team rankings are currently hidden. The admin will make them visible when ready." })] })] }));
    }
    return (_jsxs("div", { className: "space-y-5", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Team Rankings" }), _jsx("p", { className: "text-gray-500 text-sm mt-0.5", children: "See how teams are performing in the hackathon" })] }), myTeam && (_jsxs("div", { className: "bg-white rounded-2xl border border-gray-200 p-5", children: [_jsxs("h3", { className: "font-semibold text-gray-900 mb-4 flex items-center gap-2", children: [_jsx(Users, { className: "w-4 h-4 text-blue-500" }), " Your Team Status"] }), _jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [_jsx(StatBox, { label: "Your Team", value: myTeam.name, gradient: "from-blue-500 to-purple-600" }), _jsx(StatBox, { label: "Leader", value: myTeam.leader_name ?? '—', gradient: "from-green-500 to-emerald-600" }), _jsx(StatBox, { label: "Current Rank", value: myTeamRanking ? `#${myTeamRanking.rank}` : 'Not Ranked', gradient: "from-yellow-500 to-orange-600" }), _jsx(StatBox, { label: "Total Teams", value: String(rankings.length), gradient: "from-purple-500 to-pink-600" })] }), !myTeamRanking && (_jsx("div", { className: "mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-800", children: "Your team hasn't received any scores yet. Rankings will appear once mentors start scoring your team." }))] })), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3", children: [_jsx("div", { className: "w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center", children: _jsx(Users, { className: "text-white w-5 h-5" }) }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold text-gray-900", children: rankings.length }), _jsx("div", { className: "text-xs text-gray-500", children: "Teams Ranked" })] })] }), _jsxs("div", { className: "bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3", children: [_jsx("div", { className: "w-11 h-11 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center", children: _jsx(Clock, { className: "text-white w-5 h-5" }) }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold text-gray-900", children: rankings.reduce((sum, t) => sum + t.rounds_participated, 0) }), _jsx("div", { className: "text-xs text-gray-500", children: "Total Round Participations" })] })] })] }), _jsxs("div", { className: "bg-white rounded-2xl border border-gray-200 overflow-hidden", children: [_jsxs("div", { className: "px-5 py-4 border-b border-gray-100", children: [_jsxs("h3", { className: "font-semibold text-gray-900", children: ["All Teams (", rankings.length, ")"] }), _jsx("p", { className: "text-xs text-gray-500 mt-0.5", children: "Sorted by average score across all mentoring rounds" })] }), rankings.length === 0 ? (_jsxs("div", { className: "py-16 text-center", children: [_jsx(Trophy, { className: "w-12 h-12 text-gray-300 mx-auto mb-4" }), _jsx("p", { className: "text-gray-500", children: "No rankings available yet" }), _jsx("p", { className: "text-gray-400 text-sm mt-1", children: "Rankings appear once teams receive scores from mentors" })] })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-gray-50 text-xs text-gray-500 uppercase tracking-wide", children: _jsxs("tr", { children: [_jsx("th", { className: "px-5 py-3 text-left", children: "Rank" }), _jsx("th", { className: "px-5 py-3 text-left", children: "Team" }), _jsx("th", { className: "px-5 py-3 text-left", children: "Leader" }), _jsx("th", { className: "px-5 py-3 text-left", children: "Location" }), _jsx("th", { className: "px-5 py-3 text-left", children: "Rounds" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-100", children: rankings.map((team) => {
                                        const isMyTeam = myTeam?.id === team.team_id;
                                        return (_jsxs("tr", { className: `transition-colors ${isMyTeam ? 'bg-indigo-50 border-l-4 border-indigo-500' : 'hover:bg-gray-50'}`, children: [_jsx("td", { className: "px-5 py-4", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: `w-9 h-9 bg-gradient-to-br ${medalColor(team.rank)} rounded-full flex items-center justify-center`, children: team.rank <= 3 ? (_jsx("span", { className: "text-white text-sm", children: "\uD83C\uDFC5" })) : (_jsx("span", { className: "text-xs font-bold text-gray-600", children: team.rank })) }), _jsxs("span", { className: "font-bold text-gray-900", children: ["#", team.rank] }), isMyTeam && (_jsx("span", { className: "text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full", children: "You" }))] }) }), _jsx("td", { className: "px-5 py-4 font-medium text-gray-900", children: team.team_name }), _jsx("td", { className: "px-5 py-4 text-gray-600", children: team.leader_name }), _jsx("td", { className: "px-5 py-4 text-gray-500 text-xs", children: team.floor_number ? `Floor ${team.floor_number} - Room ${team.room_number}` : '—' }), _jsxs("td", { className: "px-5 py-4 text-gray-600", children: [team.rounds_participated, _jsxs("span", { className: "text-xs text-gray-400 ml-1", children: ["(", team.scores_count, " scores)"] })] })] }, team.team_id));
                                    }) })] }) }))] })] }));
}
function StatBox({ label, value, gradient }) {
    return (_jsxs("div", { className: `bg-gradient-to-br ${gradient} rounded-xl p-4 text-center text-white`, children: [_jsx("div", { className: "text-lg font-bold truncate", children: value }), _jsx("div", { className: "text-xs opacity-80 mt-0.5", children: label })] }));
}

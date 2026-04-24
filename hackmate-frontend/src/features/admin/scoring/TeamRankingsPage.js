import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import client from '@/api/client';
import { adminApi } from '@/api/admin';
export default function TeamRankingsPage() {
    const [rankingsVisible, setRankingsVisible] = useState(null);
    const [msg, setMsg] = useState('');
    const { data: rankings = [], isLoading } = useQuery({
        queryKey: ['admin-rankings'],
        queryFn: () => client.get('/rankings/').then((r) => r.data.rankings ?? []),
    });
    const { data: settings = [] } = useQuery({
        queryKey: ['admin-settings'],
        queryFn: adminApi.getSettings,
    });
    const rankingsVisibleSetting = settings.find((s) => s.setting_key === 'rankings_visible');
    const computedVisible = rankingsVisibleSetting
        ? rankingsVisibleSetting.setting_value === 'true' || rankingsVisibleSetting.setting_value === '1'
        : false;
    // Sync local state with fetched setting (only when not mid-toggle)
    useEffect(() => {
        if (rankingsVisibleSetting !== undefined && rankingsVisible === null) {
            setRankingsVisible(computedVisible);
        }
    }, [rankingsVisibleSetting]);
    const toggleVisibility = useMutation({
        mutationFn: (visible) => adminApi.updateSetting('rankings_visible', visible ? 'true' : 'false'),
        onSuccess: (_, visible) => { setRankingsVisible(visible); setMsg(visible ? 'Rankings are now visible to participants!' : 'Rankings hidden from participants'); },
    });
    const medalColor = (rank) => {
        if (rank === 1)
            return 'text-yellow-500';
        if (rank === 2)
            return 'text-gray-400';
        if (rank === 3)
            return 'text-amber-600';
        return 'text-gray-400';
    };
    const topScore = rankings[0]?.average_score ?? 0;
    const totalScores = rankings.reduce((sum, t) => sum + t.scores_count, 0);
    return (_jsxs("div", { className: "space-y-5", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Team Rankings" }), _jsx("p", { className: "text-gray-500 text-sm mt-0.5", children: "View and manage team performance rankings" })] }), msg && _jsx("div", { className: "bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm", children: msg }), _jsxs("div", { className: "bg-white rounded-xl border border-gray-200 p-5", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-3", children: "Ranking Visibility" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: rankingsVisible ?? false, onChange: (e) => toggleVisibility.mutate(e.target.checked), className: "w-4 h-4 text-indigo-600 rounded" }), _jsx("span", { className: "text-sm text-gray-700", children: "Make rankings visible to participants" })] }), _jsx("span", { className: `text-xs font-semibold px-2 py-0.5 rounded-full ${rankingsVisible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`, children: rankingsVisible ? 'VISIBLE' : 'HIDDEN' })] })] }), _jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
                    { label: 'Teams with Scores', value: rankings.length, icon: '🏆' },
                    { label: 'Highest Avg Score', value: topScore.toFixed(2), icon: '⭐' },
                    { label: 'Total Scores Given', value: totalScores, icon: '📊' },
                    { label: 'Ranked Teams', value: rankings.length, icon: '📋' },
                ].map((s) => (_jsxs("div", { className: "bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3", children: [_jsx("span", { className: "text-2xl", children: s.icon }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold text-gray-900", children: s.value }), _jsx("div", { className: "text-xs text-gray-500", children: s.label })] })] }, s.label))) }), _jsxs("div", { className: "bg-white rounded-xl border border-gray-200 overflow-hidden", children: [_jsxs("div", { className: "px-5 py-3 border-b border-gray-100", children: [_jsxs("h3", { className: "font-semibold text-gray-900", children: ["Team Rankings (", rankings.length, " teams)"] }), _jsx("p", { className: "text-xs text-gray-500 mt-0.5", children: "Sorted by average score across all mentoring rounds" })] }), isLoading ? (_jsx("div", { className: "py-12 text-center text-gray-400", children: "Loading\u2026" })) : rankings.length === 0 ? (_jsxs("div", { className: "py-12 text-center", children: [_jsx("div", { className: "text-4xl mb-3", children: "\uD83C\uDFC6" }), _jsx("p", { className: "text-gray-500", children: "No rankings yet" }), _jsx("p", { className: "text-gray-400 text-sm mt-1", children: "Teams will appear here once they receive scores from mentors" })] })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-gray-50 text-xs text-gray-500 uppercase tracking-wide", children: _jsxs("tr", { children: [_jsx("th", { className: "px-5 py-3 text-left", children: "Rank" }), _jsx("th", { className: "px-5 py-3 text-left", children: "Team" }), _jsx("th", { className: "px-5 py-3 text-left", children: "Leader" }), _jsx("th", { className: "px-5 py-3 text-left", children: "Location" }), _jsx("th", { className: "px-5 py-3 text-left", children: "Rounds" }), _jsx("th", { className: "px-5 py-3 text-left", children: "Avg Score" }), _jsx("th", { className: "px-5 py-3 text-left", children: "Total" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-100", children: rankings.map((team) => (_jsxs("tr", { className: "hover:bg-gray-50 transition-colors", children: [_jsx("td", { className: "px-5 py-3", children: _jsxs("div", { className: "flex items-center gap-1", children: [team.rank <= 3 && _jsx("span", { className: `text-lg ${medalColor(team.rank)}`, children: "\uD83C\uDFC5" }), _jsxs("span", { className: "font-bold text-gray-900", children: ["#", team.rank] })] }) }), _jsx("td", { className: "px-5 py-3", children: _jsx("div", { className: "font-medium text-gray-900", children: team.team_name }) }), _jsx("td", { className: "px-5 py-3 text-gray-600", children: team.leader_name }), _jsx("td", { className: "px-5 py-3 text-gray-500 text-xs", children: team.floor_number ? `${team.floor_number} - ${team.room_number}` : '—' }), _jsxs("td", { className: "px-5 py-3 text-gray-600", children: [team.rounds_participated, _jsxs("span", { className: "text-xs text-gray-400 ml-1", children: ["(", team.scores_count, " scores)"] })] }), _jsx("td", { className: "px-5 py-3", children: _jsx("span", { className: "text-lg font-bold text-indigo-600", children: team.average_score.toFixed(2) }) }), _jsx("td", { className: "px-5 py-3 text-gray-700 font-medium", children: team.total_score })] }, team.team_id))) })] }) }))] })] }));
}

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { volunteerApi } from '@/api/volunteer';
import { Trophy, MapPin } from 'lucide-react';
import client from '@/api/client';
export default function VolunteerRankingsPage() {
    const { data, isLoading, error: rankingsError } = useQuery({
        queryKey: ['volunteer-rankings'],
        queryFn: volunteerApi.getRankings,
        retry: false,
    });
    const { data: settingsRaw } = useQuery({
        queryKey: ['public-settings'],
        queryFn: () => client.get('/admin/settings/public').then((r) => r.data),
        retry: false,
    });
    const settings = Array.isArray(settingsRaw) ? settingsRaw : [];
    const rankingsVisible = settings.find((s) => s.setting_key === 'rankings_visible')?.setting_value;
    const rankingsBlocked = rankingsError?.response?.status === 403;
    const isVisible = !rankingsBlocked && (rankingsVisible === '1' || rankingsVisible === 'true');
    const rankings = data?.rankings ?? [];
    const medalEmoji = (rank) => {
        if (rank === 1)
            return '🥇';
        if (rank === 2)
            return '🥈';
        if (rank === 3)
            return '🥉';
        return null;
    };
    if (isLoading) {
        return _jsx("div", { className: "py-16 text-center text-gray-400", children: "Loading rankings\u2026" });
    }
    if (!isVisible) {
        return (_jsxs("div", { className: "space-y-5", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Rankings" }), _jsx("p", { className: "text-gray-500 text-sm mt-0.5", children: "Team standings based on average scores" })] }), _jsxs("div", { className: "bg-white rounded-2xl border border-gray-200 p-16 text-center", children: [_jsx("div", { className: "w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6", children: _jsx("span", { className: "text-4xl", children: "\uD83D\uDE48" }) }), _jsx("h2", { className: "text-xl font-bold text-gray-900 mb-2", children: "Rankings Not Available Yet" }), _jsx("p", { className: "text-gray-500 max-w-sm mx-auto", children: "Team rankings are currently hidden. The admin will make them visible when ready." })] })] }));
    }
    return (_jsxs("div", { className: "space-y-5", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Rankings" }), _jsx("p", { className: "text-gray-500 text-sm mt-0.5", children: "Team standings based on average scores" })] }), rankings.length === 0 ? (_jsxs("div", { className: "bg-white rounded-2xl border border-gray-200 p-16 text-center", children: [_jsx(Trophy, { className: "w-12 h-12 text-gray-300 mx-auto mb-4" }), _jsx("p", { className: "text-gray-500", children: "No rankings available yet" }), _jsx("p", { className: "text-gray-400 text-sm mt-1", children: "Rankings appear once teams have been scored" })] })) : (_jsxs("div", { className: "bg-white rounded-2xl border border-gray-200 overflow-hidden", children: [_jsxs("div", { className: "px-5 py-4 border-b border-gray-100 flex items-center justify-between", children: [_jsx("h3", { className: "font-semibold text-gray-900", children: "Team Rankings" }), _jsxs("span", { className: "text-xs text-gray-500", children: [rankings.length, " teams"] })] }), _jsx("div", { className: "divide-y divide-gray-100", children: rankings.map((r) => (_jsxs("div", { className: `px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors ${r.rank <= 3 ? 'bg-gradient-to-r from-yellow-50/50 to-transparent' : ''}`, children: [_jsx("div", { className: `w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 ${r.rank === 1 ? 'bg-yellow-100' : r.rank === 2 ? 'bg-gray-100' : r.rank === 3 ? 'bg-amber-100' : 'bg-gray-50'}`, children: medalEmoji(r.rank) ?? _jsxs("span", { className: "text-sm text-gray-500", children: ["#", r.rank] }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "font-semibold text-gray-900", children: r.team_name }), _jsxs("div", { className: "flex items-center gap-3 mt-0.5 text-xs text-gray-500 flex-wrap", children: [_jsxs("span", { children: ["\uD83D\uDC64 ", r.leader_name] }), r.floor_number && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(MapPin, { className: "w-3 h-3" }), " ", r.floor_number, "-", r.room_number] })), _jsxs("span", { children: [r.rounds_participated, " round", r.rounds_participated !== 1 ? 's' : ''] })] })] })] }, r.team_id))) })] }))] }));
}

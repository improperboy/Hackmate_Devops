import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { mentorApi } from '@/api/mentor';
import { Trophy, MapPin } from 'lucide-react';
export default function MentorRankingsPage() {
    const { data, isLoading } = useQuery({
        queryKey: ['mentor-rankings'],
        queryFn: mentorApi.getRankings,
    });
    const rankings = data?.rankings ?? [];
    const medalColor = (rank) => {
        if (rank === 1)
            return 'text-yellow-500';
        if (rank === 2)
            return 'text-gray-400';
        if (rank === 3)
            return 'text-amber-600';
        return 'text-gray-400';
    };
    return (_jsxs("div", { className: "space-y-5", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Rankings" }), _jsx("p", { className: "text-gray-500 text-sm mt-0.5", children: "Team standings based on average scores" })] }), isLoading ? (_jsx("div", { className: "py-16 text-center text-gray-400", children: "Loading rankings\u2026" })) : rankings.length === 0 ? (_jsxs("div", { className: "bg-white rounded-2xl border border-gray-200 p-16 text-center", children: [_jsx(Trophy, { className: "w-12 h-12 text-gray-300 mx-auto mb-4" }), _jsx("p", { className: "text-gray-500", children: "No rankings available yet" }), _jsx("p", { className: "text-gray-400 text-sm mt-1", children: "Rankings will appear once teams have been scored" })] })) : (_jsxs("div", { className: "bg-white rounded-2xl border border-gray-200 overflow-hidden", children: [_jsxs("div", { className: "px-5 py-4 border-b border-gray-100 flex items-center justify-between", children: [_jsx("h3", { className: "font-semibold text-gray-900", children: "Team Rankings" }), _jsxs("span", { className: "text-xs text-gray-500", children: [rankings.length, " teams"] })] }), _jsx("div", { className: "divide-y divide-gray-100", children: rankings.map((r) => (_jsxs("div", { className: `px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors ${r.rank <= 3 ? 'bg-gradient-to-r from-yellow-50/50 to-transparent' : ''}`, children: [_jsx("div", { className: `w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 ${r.rank === 1 ? 'bg-yellow-100' : r.rank === 2 ? 'bg-gray-100' : r.rank === 3 ? 'bg-amber-100' : 'bg-gray-50'}`, children: _jsx("span", { className: medalColor(r.rank), children: r.rank <= 3 ? ['🥇', '🥈', '🥉'][r.rank - 1] : `#${r.rank}` }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "font-semibold text-gray-900", children: r.team_name }), _jsxs("div", { className: "flex items-center gap-3 mt-0.5 text-xs text-gray-500 flex-wrap", children: [_jsxs("span", { children: ["\uD83D\uDC64 ", r.leader_name] }), r.floor_number && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(MapPin, { className: "w-3 h-3" }), " ", r.floor_number, "-", r.room_number] })), _jsxs("span", { children: [r.rounds_participated, " round", r.rounds_participated !== 1 ? 's' : ''] })] })] }), _jsx("div", { className: "text-right shrink-0", children: _jsxs("p", { className: "text-xs text-gray-400", children: ["#", r.rank] }) })] }, r.team_id))) })] }))] }));
}

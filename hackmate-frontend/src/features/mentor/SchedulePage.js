import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { mentorApi, classifyRound } from '@/api/mentor';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
export default function SchedulePage() {
    const { data: rounds = [], isLoading } = useQuery({
        queryKey: ['mentor-all-rounds'],
        queryFn: mentorApi.getAllRounds,
    });
    const active = rounds.filter((r) => classifyRound(r) === 'active');
    const upcoming = rounds.filter((r) => classifyRound(r) === 'upcoming');
    const past = rounds.filter((r) => classifyRound(r) === 'past' || classifyRound(r) === 'inactive');
    const fmt = (d) => new Date(d).toLocaleString();
    const RoundCard = ({ r, variant }) => {
        const colors = {
            active: 'border-green-500 bg-green-50',
            upcoming: 'border-blue-500 bg-blue-50',
            past: 'border-gray-300 bg-gray-50',
        };
        const badges = {
            active: 'bg-green-100 text-green-700',
            upcoming: 'bg-blue-100 text-blue-700',
            past: 'bg-gray-100 text-gray-600',
        };
        return (_jsx("div", { className: `p-4 border-l-4 rounded-xl ${colors[variant]}`, children: _jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsxs("div", { children: [_jsx("p", { className: "font-semibold text-gray-900", children: r.round_name }), r.description && _jsx("p", { className: "text-sm text-gray-600 mt-0.5", children: r.description }), _jsxs("div", { className: "flex items-center gap-3 mt-2 text-xs text-gray-500", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { className: "w-3 h-3" }), " ", fmt(r.start_time)] }), _jsx("span", { children: "\u2192" }), _jsx("span", { children: fmt(r.end_time) })] })] }), _jsxs("div", { className: "shrink-0 text-right", children: [_jsx("span", { className: `text-xs px-2 py-0.5 rounded-full font-medium ${badges[variant]}`, children: variant === 'active' ? '🟢 Active' : variant === 'upcoming' ? '🔵 Upcoming' : '⚫ Past' }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: ["Max: ", r.max_score, " pts"] })] })] }) }));
    };
    return (_jsxs("div", { className: "space-y-5", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Schedule" }), _jsx("p", { className: "text-gray-500 text-sm mt-0.5", children: "All mentoring rounds and their timings" })] }), _jsx("div", { className: "grid grid-cols-3 gap-4", children: [
                    { label: 'Active', value: active.length, icon: '🟢', gradient: 'from-green-500 to-emerald-600' },
                    { label: 'Upcoming', value: upcoming.length, icon: '🔵', gradient: 'from-blue-500 to-indigo-600' },
                    { label: 'Completed', value: past.length, icon: '⚫', gradient: 'from-gray-400 to-gray-600' },
                ].map((s) => (_jsxs("div", { className: "bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3", children: [_jsx("div", { className: `w-11 h-11 bg-gradient-to-br ${s.gradient} rounded-xl flex items-center justify-center text-lg`, children: s.icon }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold text-gray-900", children: s.value }), _jsx("div", { className: "text-xs text-gray-500", children: s.label })] })] }, s.label))) }), isLoading ? (_jsx("div", { className: "py-16 text-center text-gray-400", children: "Loading rounds\u2026" })) : rounds.length === 0 ? (_jsxs("div", { className: "bg-white rounded-2xl border border-gray-200 p-16 text-center", children: [_jsx(Calendar, { className: "w-12 h-12 text-gray-300 mx-auto mb-4" }), _jsx("p", { className: "text-gray-500", children: "No mentoring rounds scheduled yet" })] })) : (_jsxs("div", { className: "space-y-6", children: [active.length > 0 && (_jsxs("div", { children: [_jsxs("h3", { className: "font-semibold text-gray-700 mb-3 flex items-center gap-2", children: [_jsx("span", { className: "w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block" }), " Active Rounds"] }), _jsx("div", { className: "space-y-3", children: active.map((r) => _jsx(RoundCard, { r: r, variant: "active" }, r.id)) })] })), upcoming.length > 0 && (_jsxs("div", { children: [_jsxs("h3", { className: "font-semibold text-gray-700 mb-3 flex items-center gap-2", children: [_jsx(Clock, { className: "w-4 h-4 text-blue-500" }), " Upcoming Rounds"] }), _jsx("div", { className: "space-y-3", children: upcoming.map((r) => _jsx(RoundCard, { r: r, variant: "upcoming" }, r.id)) })] })), past.length > 0 && (_jsxs("div", { children: [_jsxs("h3", { className: "font-semibold text-gray-700 mb-3 flex items-center gap-2", children: [_jsx(CheckCircle, { className: "w-4 h-4 text-gray-400" }), " Completed Rounds"] }), _jsx("div", { className: "space-y-3", children: past.map((r) => _jsx(RoundCard, { r: r, variant: "past" }, r.id)) })] }))] }))] }));
}

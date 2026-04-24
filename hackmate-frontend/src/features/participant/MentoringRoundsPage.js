import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { teamsApi } from '@/api/teams';
import { scoresApi } from '@/api/scores';
import { Clock, User, MessageSquare, Trophy, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
export default function MentoringRoundsPage() {
    const user = useAuthStore((s) => s.user);
    const { data: myTeam, isLoading: teamLoading } = useQuery({
        queryKey: ['my-team'],
        queryFn: teamsApi.getMyTeam,
        retry: false,
    });
    const { data: rounds = [], isLoading: roundsLoading } = useQuery({
        queryKey: ['mentoring-summary', myTeam?.id],
        queryFn: () => scoresApi.getTeamMentoringSummary(myTeam.id),
        enabled: !!myTeam?.id,
    });
    if (teamLoading || roundsLoading) {
        return _jsx("div", { className: "flex items-center justify-center h-64 text-gray-400", children: "Loading\u2026" });
    }
    if (!myTeam || myTeam.status !== 'approved') {
        return (_jsxs("div", { className: "flex flex-col items-center justify-center h-64 gap-3 text-center", children: [_jsx(AlertCircle, { className: "w-12 h-12 text-yellow-400" }), _jsx("p", { className: "text-gray-600 font-medium", children: "You need an approved team to view mentoring rounds." })] }));
    }
    const isActive = (r) => !!r.is_active && new Date() >= new Date(r.start_time) && new Date() <= new Date(r.end_time);
    const ongoing = rounds.filter((r) => isActive(r));
    const upcoming = rounds.filter((r) => !isActive(r) && new Date(r.start_time) > new Date());
    const past = rounds.filter((r) => !isActive(r) && new Date(r.end_time) < new Date());
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Mentoring Rounds" }), _jsxs("p", { className: "text-gray-500 mt-1", children: ["Hi ", user?.name, ", here are all the mentoring sessions for your team."] })] }), _jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: [_jsx(StatCard, { label: "Total Rounds", value: rounds.length, gradient: "from-blue-500 to-indigo-600", icon: _jsx(Calendar, { className: "w-5 h-5 text-white" }) }), _jsx(StatCard, { label: "Ongoing", value: ongoing.length, gradient: "from-green-500 to-emerald-600", icon: _jsx(CheckCircle, { className: "w-5 h-5 text-white" }) }), _jsx(StatCard, { label: "Upcoming", value: upcoming.length, gradient: "from-orange-500 to-amber-600", icon: _jsx(Clock, { className: "w-5 h-5 text-white" }) }), _jsx(StatCard, { label: "Completed", value: past.length, gradient: "from-purple-500 to-pink-600", icon: _jsx(Trophy, { className: "w-5 h-5 text-white" }) })] }), rounds.length === 0 && (_jsx("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center text-gray-400", children: "No mentoring rounds have been scheduled yet." })), ongoing.length > 0 && _jsx(Section, { title: "\uD83D\uDFE2 Ongoing", rounds: ongoing }), upcoming.length > 0 && _jsx(Section, { title: "\uD83D\uDD50 Upcoming", rounds: upcoming }), past.length > 0 && _jsx(Section, { title: "\u2705 Completed", rounds: past })] }));
}
function StatCard({ label, value, gradient, icon }) {
    return (_jsxs("div", { className: "bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3", children: [_jsx("div", { className: `w-10 h-10 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shrink-0`, children: icon }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500", children: label }), _jsx("p", { className: "text-xl font-bold text-gray-900", children: value })] })] }));
}
function Section({ title, rounds }) {
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-base font-semibold text-gray-700", children: title }), rounds.map((r) => _jsx(RoundCard, { round: r }, r.id))] }));
}
function RoundCard({ round }) {
    const now = new Date();
    const isOngoing = !!round.is_active && now >= new Date(round.start_time) && now <= new Date(round.end_time);
    const isCompleted = !isOngoing && new Date(round.end_time) < now;
    const isUpcoming = !isOngoing && new Date(round.start_time) > now;
    const statusBadge = isOngoing
        ? _jsx("span", { className: "text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium", children: "Ongoing" })
        : isUpcoming
            ? _jsx("span", { className: "text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium", children: "Upcoming" })
            : _jsx("span", { className: "text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium", children: "Completed" });
    const scoredFeedback = round.feedback.filter((f) => f.score !== undefined);
    const avgScore = scoredFeedback.length > 0
        ? scoredFeedback.reduce((sum, f) => sum + (f.score ?? 0), 0) / scoredFeedback.length
        : null;
    return (_jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [_jsx("div", { className: "p-5 border-b border-gray-50", children: _jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx("h3", { className: "font-bold text-gray-900", children: round.round_name }), statusBadge] }), round.description && (_jsx("p", { className: "text-sm text-gray-500 mt-1", children: round.description })), _jsxs("div", { className: "flex items-center gap-4 mt-2 text-xs text-gray-400 flex-wrap", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { className: "w-3.5 h-3.5" }), fmtDate(round.start_time), " \u2192 ", fmtDate(round.end_time)] }), _jsxs("span", { children: ["Max score: ", round.max_score] })] })] }), round.scores_visible && avgScore !== null && (_jsxs("div", { className: "shrink-0 text-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl px-4 py-2", children: [_jsx("div", { className: "text-xl font-bold", children: avgScore.toFixed(1) }), _jsxs("div", { className: "text-xs opacity-80", children: ["/ ", round.max_score] })] }))] }) }), _jsxs("div", { className: "px-5 py-4 border-b border-gray-50", children: [_jsxs("p", { className: "text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2", children: ["Assigned Mentor", round.assigned_mentors.length !== 1 ? 's' : ''] }), round.assigned_mentors.length === 0 ? (_jsx("p", { className: "text-sm text-gray-400 italic", children: "No mentor assigned to your location yet." })) : (_jsx("div", { className: "flex flex-wrap gap-2", children: round.assigned_mentors.map((m) => (_jsxs("div", { className: "flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5", children: [_jsx("div", { className: "w-7 h-7 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0", children: m.name.slice(0, 2).toUpperCase() }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-800", children: m.name }), _jsx("p", { className: "text-xs text-gray-400", children: m.email })] })] }, m.id))) }))] }), _jsxs("div", { className: "px-5 py-4", children: [_jsxs("p", { className: "text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2", children: ["Mentor Feedback ", round.feedback.length > 0 ? `(${round.feedback.length})` : ''] }), round.feedback.length === 0 ? (_jsx("p", { className: "text-sm text-gray-400 italic", children: isCompleted
                            ? 'No feedback was given for this round.'
                            : 'Feedback will appear here after the mentor scores your team.' })) : (_jsx("div", { className: "space-y-3", children: round.feedback.map((f) => (_jsx(FeedbackCard, { feedback: f, scoresVisible: round.scores_visible }, f.id))) }))] })] }));
}
function FeedbackCard({ feedback, scoresVisible }) {
    return (_jsxs("div", { className: "bg-gray-50 rounded-xl p-4", children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0", children: feedback.mentor_name.slice(0, 2).toUpperCase() }), _jsxs("div", { children: [_jsxs("p", { className: "text-sm font-medium text-gray-800 flex items-center gap-1", children: [_jsx(User, { className: "w-3.5 h-3.5 text-gray-400" }), feedback.mentor_name] }), feedback.created_at && (_jsx("p", { className: "text-xs text-gray-400", children: fmtDate(feedback.created_at) }))] })] }), scoresVisible && feedback.score !== undefined && (_jsxs("div", { className: "shrink-0 text-right", children: [_jsx("span", { className: "text-lg font-bold text-indigo-600", children: feedback.score }), feedback.max_score !== undefined && (_jsxs("span", { className: "text-xs text-gray-400", children: [" / ", feedback.max_score] }))] }))] }), feedback.comment ? (_jsxs("div", { className: "mt-3 flex items-start gap-2", children: [_jsx(MessageSquare, { className: "w-4 h-4 text-gray-400 mt-0.5 shrink-0" }), _jsx("p", { className: "text-sm text-gray-700", children: feedback.comment })] })) : (_jsx("p", { className: "mt-2 text-xs text-gray-400 italic", children: "No written feedback provided." }))] }));
}
function fmtDate(iso) {
    return new Date(iso).toLocaleString(undefined, {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
}

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/api/admin';
import client from '@/api/client';
export default function MentorRecommendationsPage() {
    const qc = useQueryClient();
    const { data: recs = [], isLoading } = useQuery({
        queryKey: ['mentor-recommendations'],
        queryFn: adminApi.getRecommendations,
    });
    const { data: users = [] } = useQuery({
        queryKey: ['all-users'],
        queryFn: () => client.get('/users/').then((r) => r.data),
    });
    const generate = useMutation({
        mutationFn: adminApi.generateRecommendations,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['mentor-recommendations'] }),
    });
    const deleteRec = useMutation({
        mutationFn: adminApi.deleteRecommendation,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['mentor-recommendations'] }),
    });
    const getName = (id) => users.find((u) => u.id === id)?.name ?? `User #${id}`;
    const getEmail = (id) => users.find((u) => u.id === id)?.email ?? '';
    const highMatches = recs.filter((r) => parseFloat(r.match_score) >= 70).length;
    return (_jsxs("div", { className: "space-y-5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Mentor Recommendations" }), _jsx("p", { className: "text-gray-500 text-sm mt-0.5", children: "AI-powered mentor-participant skill matching" })] }), _jsx("button", { onClick: () => generate.mutate(), disabled: generate.isPending, className: "bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2", children: generate.isPending ? '⏳ Generating…' : '✨ Generate Recommendations' })] }), generate.isSuccess && (_jsx("div", { className: "bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm", children: "Recommendations generated successfully!" })), _jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
                    { label: 'Total Recommendations', value: recs.length, icon: '💡' },
                    { label: 'High Matches (70%+)', value: highMatches, icon: '⭐' },
                    { label: 'Participants', value: new Set(recs.map((r) => r.participant_id)).size, icon: '👤' },
                    { label: 'Mentors Matched', value: new Set(recs.map((r) => r.mentor_id)).size, icon: '🎓' },
                ].map((s) => (_jsxs("div", { className: "bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3", children: [_jsx("span", { className: "text-2xl", children: s.icon }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold text-gray-900", children: s.value }), _jsx("div", { className: "text-xs text-gray-500", children: s.label })] })] }, s.label))) }), _jsxs("div", { className: "bg-white rounded-xl border border-gray-200 overflow-hidden", children: [_jsxs("div", { className: "px-5 py-3 border-b border-gray-100", children: [_jsxs("h3", { className: "font-semibold text-gray-900", children: ["Recommendations (", recs.length, ")"] }), _jsx("p", { className: "text-xs text-gray-500 mt-0.5", children: "Sorted by match score \u2014 top 3 per participant" })] }), isLoading ? (_jsx("div", { className: "py-12 text-center text-gray-400", children: "Loading\u2026" })) : recs.length === 0 ? (_jsxs("div", { className: "py-12 text-center", children: [_jsx("div", { className: "text-4xl mb-3", children: "\uD83E\uDD16" }), _jsx("p", { className: "text-gray-500 font-medium", children: "No recommendations yet" }), _jsx("p", { className: "text-gray-400 text-sm mt-1", children: "Click \"Generate Recommendations\" to start" })] })) : (_jsx("div", { className: "divide-y divide-gray-100", children: recs.map((rec) => {
                            const score = parseFloat(rec.match_score);
                            const scoreColor = score >= 70 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-gray-400';
                            let sharedSkills = [];
                            try {
                                const parsed = JSON.parse(rec.skill_match_details ?? '{}');
                                sharedSkills = parsed.shared_skills ?? [];
                            }
                            catch { /* ignore */ }
                            return (_jsxs("div", { className: "p-5 hover:bg-gray-50 transition-colors", children: [_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-4 flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [_jsx("div", { className: "w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-semibold shrink-0", children: getName(rec.participant_id).slice(0, 2).toUpperCase() }), _jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "font-medium text-gray-900 text-sm truncate", children: getName(rec.participant_id) }), _jsx("div", { className: "text-xs text-gray-500 truncate", children: getEmail(rec.participant_id) })] })] }), _jsx("span", { className: "text-gray-400 shrink-0", children: "\u2192" }), _jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [_jsx("div", { className: "w-9 h-9 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs font-semibold shrink-0", children: getName(rec.mentor_id).slice(0, 2).toUpperCase() }), _jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "font-medium text-gray-900 text-sm truncate", children: getName(rec.mentor_id) }), _jsx("div", { className: "text-xs text-gray-500 truncate", children: getEmail(rec.mentor_id) })] })] })] }), _jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [_jsxs("span", { className: `${scoreColor} text-white text-xs font-semibold px-2.5 py-1 rounded-full`, children: [score.toFixed(0), "% match"] }), _jsx("button", { onClick: () => deleteRec.mutate(rec.id), className: "text-gray-400 hover:text-red-500 text-xs transition-colors", children: "\u2715" })] })] }), sharedSkills.length > 0 && (_jsx("div", { className: "mt-2 flex flex-wrap gap-1 ml-11", children: sharedSkills.map((s) => (_jsx("span", { className: "px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs", children: s }, s))) }))] }, rec.id));
                        }) }))] })] }));
}

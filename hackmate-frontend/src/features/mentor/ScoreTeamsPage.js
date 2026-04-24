import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { mentorApi, classifyRound } from '@/api/mentor';
import { Star, Users, MapPin, Lightbulb, CheckCircle, AlertCircle, Search } from 'lucide-react';
export default function ScoreTeamsPage() {
    const [searchParams] = useSearchParams();
    const qc = useQueryClient();
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [selectedRound, setSelectedRound] = useState(null);
    const [score, setScore] = useState('');
    const [comment, setComment] = useState('');
    const [search, setSearch] = useState('');
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');
    const { data: teamsData, isLoading: teamsLoading } = useQuery({
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
    const activeRounds = allRounds.filter((r) => classifyRound(r) === 'active');
    const teams = teamsData?.teams ?? [];
    const filtered = search
        ? teams.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))
        : teams;
    // Pre-select team from URL param
    useEffect(() => {
        const tid = searchParams.get('team_id');
        if (tid && teams.length) {
            const t = teams.find((t) => t.id === Number(tid));
            if (t)
                setSelectedTeam(t);
        }
    }, [searchParams, teams]);
    const existingScore = selectedTeam && selectedRound
        ? myScores.find((s) => s.team_id === selectedTeam.id && s.round_id === selectedRound.id)
        : null;
    const submit = useMutation({
        mutationFn: () => {
            if (!selectedTeam || !selectedRound)
                throw new Error('Select team and round');
            const s = Number(score);
            if (existingScore) {
                return mentorApi.updateScore(existingScore.id, s, comment || undefined);
            }
            return mentorApi.submitScore({ team_id: selectedTeam.id, round_id: selectedRound.id, score: s, comment: comment || undefined });
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['mentor-my-scores'] });
            setMsg(existingScore ? 'Score updated successfully!' : 'Score submitted successfully!');
            setErr('');
            setScore('');
            setComment('');
        },
        onError: (e) => {
            const detail = e?.response?.data?.detail;
            setErr(typeof detail === 'string' ? detail : 'Failed to submit score.');
            setMsg('');
        },
    });
    const handleSelectTeam = (team) => {
        setSelectedTeam(team);
        setSelectedRound(null);
        setScore('');
        setComment('');
        setMsg('');
        setErr('');
    };
    const handleSelectRound = (round) => {
        setSelectedRound(round);
        setScore('');
        setComment('');
        setMsg('');
        setErr('');
        // Pre-fill existing score
        const existing = myScores.find((s) => s.team_id === selectedTeam?.id && s.round_id === round.id);
        if (existing) {
            setScore(String(existing.score));
            setComment(existing.comment ?? '');
        }
    };
    return (_jsxs("div", { className: "space-y-5", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Score Teams" }), _jsx("p", { className: "text-gray-500 text-sm mt-0.5", children: "Evaluate and score team performance" })] }), _jsx("div", { className: "bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 text-white", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold mb-1", children: "Score Teams" }), _jsx("p", { className: "text-blue-100 text-sm", children: "Evaluate team performance and provide feedback" }), activeRounds.length > 0 && (_jsxs("p", { className: "text-blue-100 text-xs mt-1", children: ["\u23F1 ", activeRounds.length, " active round", activeRounds.length !== 1 ? 's' : '', " available"] }))] }), _jsx("div", { className: "w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-3xl", children: "\u2B50" })] }) }), activeRounds.length === 0 && (_jsxs("div", { className: "bg-yellow-50 border-l-4 border-yellow-400 rounded-xl p-4 flex items-start gap-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-yellow-500 shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-yellow-800", children: "No Active Rounds" }), _jsx("p", { className: "text-yellow-700 text-sm mt-0.5", children: "No mentoring rounds are currently active for scoring." })] })] })), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-5", children: [_jsxs("div", { className: "bg-white rounded-2xl border border-gray-200 p-4", children: [_jsxs("h3", { className: "font-semibold text-gray-900 mb-3 flex items-center gap-2", children: [_jsx(Users, { className: "w-4 h-4 text-blue-500" }), " Select Team (", filtered.length, ")"] }), _jsxs("div", { className: "relative mb-3", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" }), _jsx("input", { type: "text", value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search teams\u2026", className: "w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), teamsLoading ? (_jsx("p", { className: "text-sm text-gray-400 py-4 text-center", children: "Loading\u2026" })) : filtered.length === 0 ? (_jsxs("div", { className: "py-8 text-center text-gray-400", children: [_jsx(Users, { className: "w-8 h-8 mx-auto mb-2 opacity-40" }), _jsx("p", { className: "text-sm", children: "No teams found" })] })) : (_jsx("div", { className: "space-y-2 max-h-96 overflow-y-auto", children: filtered.map((team) => (_jsx("button", { onClick: () => handleSelectTeam(team), className: `w-full text-left p-3 border rounded-xl transition-all ${selectedTeam?.id === team.id
                                        ? 'bg-blue-50 border-blue-400'
                                        : 'border-gray-200 hover:bg-gray-50'}`, children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-semibold text-gray-900 text-sm", children: team.name }), _jsx("p", { className: "text-xs text-gray-500 mt-0.5", children: team.leader_name }), _jsxs("div", { className: "flex items-center gap-2 mt-1 text-xs text-gray-400", children: [_jsxs("span", { children: [team.member_count ?? 0, " members"] }), team.floor_number && _jsxs("span", { children: ["\u00B7 ", team.floor_number, "-", team.room_number] })] })] }), selectedTeam?.id === team.id && (_jsx(CheckCircle, { className: "w-4 h-4 text-blue-500 shrink-0" }))] }) }, team.id))) }))] }), _jsx("div", { className: "lg:col-span-2 space-y-4", children: selectedTeam ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "bg-white rounded-2xl border border-gray-200 p-5", children: [_jsxs("h3", { className: "font-semibold text-gray-900 mb-4 flex items-center gap-2", children: ["\u2139\uFE0F Team: ", selectedTeam.name] }), _jsxs("div", { className: "grid grid-cols-2 gap-3 mb-4", children: [_jsxs("div", { className: "bg-blue-50 rounded-xl p-3", children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Leader" }), _jsx("p", { className: "font-semibold text-gray-900 text-sm", children: selectedTeam.leader_name ?? '—' })] }), _jsxs("div", { className: "bg-green-50 rounded-xl p-3", children: [_jsxs("div", { className: "flex items-center gap-1 mb-1", children: [_jsx(MapPin, { className: "w-3 h-3 text-green-500" }), _jsx("p", { className: "text-xs text-gray-500", children: "Location" })] }), _jsx("p", { className: "font-semibold text-gray-900 text-sm", children: selectedTeam.floor_number && selectedTeam.room_number
                                                                ? `${selectedTeam.floor_number} - ${selectedTeam.room_number}`
                                                                : '—' })] })] }), selectedTeam.idea && (_jsxs("div", { className: "bg-yellow-50 rounded-xl p-3", children: [_jsxs("div", { className: "flex items-center gap-1 mb-1", children: [_jsx(Lightbulb, { className: "w-3.5 h-3.5 text-yellow-500" }), _jsx("p", { className: "text-xs text-gray-500", children: "Project Idea" })] }), _jsx("p", { className: "text-sm text-gray-700", children: selectedTeam.idea })] }))] }), activeRounds.length > 0 ? (_jsxs("div", { className: "bg-white rounded-2xl border border-gray-200 p-5", children: [_jsxs("h3", { className: "font-semibold text-gray-900 mb-4 flex items-center gap-2", children: [_jsx(Star, { className: "w-4 h-4 text-orange-500" }), " Submit Score"] }), msg && (_jsxs("div", { className: "bg-green-50 border border-green-200 rounded-xl p-3 mb-4 flex items-center gap-2 text-sm text-green-700", children: [_jsx(CheckCircle, { className: "w-4 h-4" }), " ", msg] })), err && (_jsx("div", { className: "bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-700", children: err })), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Mentoring Round" }), _jsx("div", { className: "space-y-2", children: activeRounds.map((r) => {
                                                                const hasScore = myScores.some((s) => s.team_id === selectedTeam.id && s.round_id === r.id);
                                                                return (_jsx("button", { onClick: () => handleSelectRound(r), className: `w-full text-left p-3 border rounded-xl transition-all ${selectedRound?.id === r.id
                                                                        ? 'bg-blue-50 border-blue-400'
                                                                        : 'border-gray-200 hover:bg-gray-50'}`, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900 text-sm", children: r.round_name }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Max: ", r.max_score, " pts"] })] }), hasScore && (_jsx("span", { className: "text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full", children: "Scored" }))] }) }, r.id));
                                                            }) })] }), selectedRound && (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Score (0 \u2013 ", selectedRound.max_score, ")"] }), _jsx("input", { type: "number", min: 0, max: selectedRound.max_score, value: score, onChange: (e) => setScore(e.target.value), placeholder: `Enter score (max ${selectedRound.max_score})`, className: "w-full px-4 py-3 border border-gray-300 rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Comments & Feedback" }), _jsx("textarea", { rows: 4, value: comment, onChange: (e) => setComment(e.target.value), placeholder: "Provide constructive feedback for the team\u2026", className: "w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" })] }), _jsxs("button", { onClick: () => submit.mutate(), disabled: !score || submit.isPending, className: "w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2", children: [_jsx(Star, { className: "w-4 h-4" }), submit.isPending ? 'Submitting…' : existingScore ? 'Update Score' : 'Submit Score'] })] }))] })] })) : (_jsx("div", { className: "bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-400", children: _jsx("p", { className: "text-sm", children: "No active rounds available for scoring." }) }))] })) : (_jsxs("div", { className: "bg-white rounded-2xl border border-gray-200 p-16 text-center text-gray-400", children: [_jsx(Star, { className: "w-12 h-12 mx-auto mb-4 opacity-30" }), _jsx("p", { className: "font-medium text-gray-600", children: "Select a team to score" }), _jsx("p", { className: "text-sm mt-1", children: "Choose a team from the list on the left" })] })) })] })] }));
}

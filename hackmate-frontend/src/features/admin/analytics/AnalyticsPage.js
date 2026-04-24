import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/api/admin';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, } from 'recharts';
const COLORS = ['#3B82F6', '#10B981', '#6366F1', '#F97316', '#EC4899', '#14B8A6'];
export default function AnalyticsPage() {
    const { data, isLoading } = useQuery({
        queryKey: ['admin-analytics'],
        queryFn: adminApi.getAnalytics,
    });
    if (isLoading)
        return _jsx("div", { className: "text-center py-20 text-gray-400", children: "Loading analytics\u2026" });
    if (!data)
        return null;
    const { stats, daily_activity, role_distribution, team_status_distribution, avg_scores_per_round, top_tech_stacks, teams_per_location } = data;
    const roleData = Object.entries(role_distribution).map(([role, count]) => ({ name: role.charAt(0).toUpperCase() + role.slice(1), value: count }));
    const statusData = Object.entries(team_status_distribution).map(([status, count]) => ({ name: status.charAt(0).toUpperCase() + status.slice(1), value: count }));
    const locationData = teams_per_location.map((l) => ({ name: `${l.floor}-${l.room}`, teams: l.team_count }));
    const approvalRate = stats.total_teams > 0 ? Math.round((stats.approved_teams / stats.total_teams) * 100) : 0;
    const completionRate = stats.approved_teams > 0 ? Math.round((stats.total_submissions / stats.approved_teams) * 100) : 0;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Analytics Dashboard" }), _jsx("p", { className: "text-gray-500 text-sm mt-0.5", children: "Comprehensive hackathon analytics and insights" })] }), _jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
                    { label: 'Total Users', value: stats.total_users, icon: '👤', sub: 'All roles', color: 'blue' },
                    { label: 'Approved Teams', value: stats.approved_teams, icon: '✅', sub: `${approvalRate}% approval rate`, color: 'green' },
                    { label: 'Submissions', value: stats.total_submissions, icon: '📤', sub: `${completionRate}% completion`, color: 'purple' },
                    { label: 'Support Staff', value: stats.total_mentors + stats.total_volunteers, icon: '🤝', sub: `${stats.total_mentors} mentors · ${stats.total_volunteers} volunteers`, color: 'indigo' },
                ].map((c) => (_jsxs("div", { className: "bg-white rounded-xl border border-gray-200 p-5", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("p", { className: "text-xs font-medium text-gray-500 uppercase tracking-wide", children: c.label }), _jsx("span", { className: "text-xl", children: c.icon })] }), _jsx("p", { className: "text-3xl font-bold text-gray-900", children: c.value }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: c.sub })] }, c.label))) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [_jsx(ChartCard, { title: "User Role Distribution", badge: "Live Data", children: _jsx(ResponsiveContainer, { width: "100%", height: 260, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: roleData, cx: "50%", cy: "50%", outerRadius: 90, dataKey: "value", label: ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`, labelLine: false, children: roleData.map((_, i) => _jsx(Cell, { fill: COLORS[i % COLORS.length] }, i)) }), _jsx(Tooltip, {}), _jsx(Legend, {})] }) }) }), _jsx(ChartCard, { title: "Team Status Distribution", badge: "Real Time", children: _jsx(ResponsiveContainer, { width: "100%", height: 260, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: statusData, cx: "50%", cy: "50%", innerRadius: 60, outerRadius: 90, dataKey: "value", label: ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`, labelLine: false, children: statusData.map((_, i) => _jsx(Cell, { fill: ['#22C55E', '#F59E0B', '#EF4444'][i % 3] }, i)) }), _jsx(Tooltip, {}), _jsx(Legend, {})] }) }) }), _jsx(ChartCard, { title: "Daily Activity (Last 7 Days)", badge: "Trending", children: _jsx(ResponsiveContainer, { width: "100%", height: 260, children: _jsxs(LineChart, { data: daily_activity, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f0f0f0" }), _jsx(XAxis, { dataKey: "label", tick: { fontSize: 11 } }), _jsx(YAxis, { tick: { fontSize: 11 }, allowDecimals: false }), _jsx(Tooltip, {}), _jsx(Legend, { wrapperStyle: { fontSize: 12 } }), _jsx(Line, { type: "monotone", dataKey: "users", stroke: "#8B5CF6", strokeWidth: 2, dot: { r: 3 }, name: "Users" }), _jsx(Line, { type: "monotone", dataKey: "teams", stroke: "#3B82F6", strokeWidth: 2, dot: { r: 3 }, name: "Teams" }), _jsx(Line, { type: "monotone", dataKey: "submissions", stroke: "#10B981", strokeWidth: 2, dot: { r: 3 }, name: "Submissions" })] }) }) }), _jsx(ChartCard, { title: "Average Scores by Round", badge: "Performance", children: avg_scores_per_round.length === 0
                            ? _jsx(EmptyChart, { message: "No scoring data yet" })
                            : _jsx(ResponsiveContainer, { width: "100%", height: 260, children: _jsxs(BarChart, { data: avg_scores_per_round, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f0f0f0" }), _jsx(XAxis, { dataKey: "round_name", tick: { fontSize: 11 } }), _jsx(YAxis, { tick: { fontSize: 11 } }), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "avg_score", fill: "#F97316", name: "Avg Score", radius: [4, 4, 0, 0] })] }) }) }), _jsx(ChartCard, { title: "Teams by Location", badge: "Distribution", children: locationData.length === 0
                            ? _jsx(EmptyChart, { message: "No location data yet" })
                            : _jsx(ResponsiveContainer, { width: "100%", height: 260, children: _jsxs(BarChart, { data: locationData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f0f0f0" }), _jsx(XAxis, { dataKey: "name", tick: { fontSize: 11 } }), _jsx(YAxis, { tick: { fontSize: 11 }, allowDecimals: false }), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "teams", fill: "#06B6D4", name: "Teams", radius: [4, 4, 0, 0] })] }) }) }), _jsx(ChartCard, { title: "Popular Tech Stacks", badge: "Top 10", children: top_tech_stacks.length === 0
                            ? _jsx(EmptyChart, { message: "No tech stack data yet" })
                            : _jsx(ResponsiveContainer, { width: "100%", height: 260, children: _jsxs(BarChart, { data: top_tech_stacks, layout: "vertical", children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f0f0f0" }), _jsx(XAxis, { type: "number", tick: { fontSize: 11 }, allowDecimals: false }), _jsx(YAxis, { type: "category", dataKey: "skill", tick: { fontSize: 11 }, width: 80 }), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "count", fill: "#EC4899", name: "Count", radius: [0, 4, 4, 0] })] }) }) })] })] }));
}
function ChartCard({ title, badge, children }) {
    return (_jsxs("div", { className: "bg-white rounded-xl border border-gray-200 p-5", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "font-semibold text-gray-900", children: title }), _jsx("span", { className: "text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full", children: badge })] }), children] }));
}
function EmptyChart({ message }) {
    return (_jsx("div", { className: "h-[260px] flex items-center justify-center text-gray-400 text-sm", children: message }));
}

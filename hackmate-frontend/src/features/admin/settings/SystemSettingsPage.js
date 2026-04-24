import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/api/admin';
const SETTING_KEYS = [
    'hackathon_name', 'hackathon_description', 'max_team_size', 'min_team_size',
    'registration_open', 'hackathon_start_date', 'hackathon_end_date',
    'contact_email', 'timezone', 'maintenance_mode', 'show_mentoring_scores_to_participants',
];
const TIMEZONES = [
    'UTC', 'America/New_York', 'America/Chicago', 'America/Los_Angeles',
    'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Asia/Kolkata', 'Australia/Sydney',
];
export default function SystemSettingsPage() {
    const qc = useQueryClient();
    const [values, setValues] = useState({});
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');
    const { data: settings = [], isLoading } = useQuery({
        queryKey: ['admin-settings'],
        queryFn: adminApi.getSettings,
    });
    useEffect(() => {
        if (settings.length > 0) {
            const map = {};
            settings.forEach((s) => { map[s.setting_key] = s.setting_value; });
            setValues(map);
        }
    }, [settings]);
    const updateAll = useMutation({
        mutationFn: async () => {
            for (const key of SETTING_KEYS) {
                if (values[key] !== undefined) {
                    await adminApi.updateSetting(key, values[key]);
                }
            }
        },
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-settings'] }); setMsg('Settings saved successfully!'); },
        onError: (e) => setErr(e?.response?.data?.detail ?? 'Failed to save settings'),
    });
    const set = (key, val) => setValues((prev) => ({ ...prev, [key]: val }));
    const isMaintenance = values['maintenance_mode'] === 'true' || values['maintenance_mode'] === '1';
    if (isLoading)
        return _jsx("div", { className: "py-20 text-center text-gray-400", children: "Loading settings\u2026" });
    return (_jsxs("div", { className: "max-w-3xl mx-auto space-y-5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "System Settings" }), _jsx("p", { className: "text-gray-500 text-sm mt-0.5", children: "Configure hackathon system settings" })] }), _jsx("span", { className: "bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-xs font-medium", children: "Admin Only" })] }), msg && _jsx("div", { className: "bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm", children: msg }), err && _jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm", children: err }), isMaintenance && (_jsx("div", { className: "bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-lg text-sm", children: "\u26A0\uFE0F Maintenance mode is currently enabled. Only admins can access the system." })), _jsxs(Section, { title: "Hackathon Information", icon: "\u2139\uFE0F", children: [_jsx(Field, { label: "Hackathon Name *", children: _jsx("input", { type: "text", value: values['hackathon_name'] ?? '', onChange: (e) => set('hackathon_name', e.target.value), className: "input" }) }), _jsx(Field, { label: "Description", children: _jsx("textarea", { rows: 3, value: values['hackathon_description'] ?? '', onChange: (e) => set('hackathon_description', e.target.value), className: "input resize-none" }) }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(Field, { label: "Start Date & Time", children: _jsx("input", { type: "datetime-local", value: (values['hackathon_start_date'] ?? '').replace(' ', 'T'), onChange: (e) => set('hackathon_start_date', e.target.value), className: "input" }) }), _jsx(Field, { label: "End Date & Time", children: _jsx("input", { type: "datetime-local", value: (values['hackathon_end_date'] ?? '').replace(' ', 'T'), onChange: (e) => set('hackathon_end_date', e.target.value), className: "input" }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(Field, { label: "Contact Email *", children: _jsx("input", { type: "email", value: values['contact_email'] ?? '', onChange: (e) => set('contact_email', e.target.value), className: "input" }) }), _jsx(Field, { label: "Timezone", children: _jsx("select", { value: values['timezone'] ?? 'UTC', onChange: (e) => set('timezone', e.target.value), className: "input", children: TIMEZONES.map((tz) => _jsx("option", { value: tz, children: tz }, tz)) }) })] })] }), _jsxs(Section, { title: "Team Configuration", icon: "\uD83D\uDC65", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(Field, { label: "Minimum Team Size *", children: _jsx("input", { type: "number", min: 1, max: 10, value: values['min_team_size'] ?? '1', onChange: (e) => set('min_team_size', e.target.value), className: "input" }) }), _jsx(Field, { label: "Maximum Team Size *", children: _jsx("input", { type: "number", min: 2, max: 20, value: values['max_team_size'] ?? '4', onChange: (e) => set('max_team_size', e.target.value), className: "input" }) })] }), _jsx("p", { className: "text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg", children: "\u2139\uFE0F These settings control team formation. Changes affect new team invitations." })] }), _jsxs(Section, { title: "System Controls", icon: "\u2699\uFE0F", children: [_jsx("p", { className: "text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg mb-3", children: "\u2139\uFE0F These settings control system-wide behavior and participant access." }), [
                        { key: 'registration_open', label: 'Enable User Registration', desc: 'When disabled, new users cannot register (except through admin panel)' },
                        { key: 'show_mentoring_scores_to_participants', label: 'Show Mentoring Scores to Participants', desc: 'When enabled, participants see actual numerical scores. When disabled, they only see feedback status.' },
                        { key: 'maintenance_mode', label: 'Enable Maintenance Mode', desc: '⚠️ Warning: Only admins can access the system when maintenance mode is enabled', warn: true },
                    ].map(({ key, label, desc, warn }) => (_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("input", { type: "checkbox", id: key, checked: values[key] === 'true' || values[key] === '1', onChange: (e) => set(key, e.target.checked ? 'true' : 'false'), className: `mt-0.5 w-4 h-4 rounded ${warn ? 'text-red-600' : 'text-indigo-600'}` }), _jsxs("div", { children: [_jsx("label", { htmlFor: key, className: "text-sm font-medium text-gray-900 cursor-pointer", children: label }), _jsx("p", { className: "text-xs text-gray-500 mt-0.5", children: desc })] })] }, key)))] }), _jsxs("div", { className: "bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between", children: [_jsx("p", { className: "text-sm text-gray-500", children: "Changes take effect immediately after saving" }), _jsx("button", { onClick: () => { setMsg(''); setErr(''); updateAll.mutate(); }, disabled: updateAll.isPending, className: "bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors", children: updateAll.isPending ? 'Saving…' : '💾 Save Settings' })] })] }));
}
function Section({ title, icon, children }) {
    return (_jsxs("div", { className: "bg-white rounded-xl border border-gray-200 p-5 space-y-4", children: [_jsxs("h3", { className: "font-semibold text-gray-900", children: [icon, " ", title] }), children] }));
}
function Field({ label, children }) {
    return (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: label }), children] }));
}

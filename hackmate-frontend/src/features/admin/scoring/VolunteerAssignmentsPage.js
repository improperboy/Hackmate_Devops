import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/api/admin';
import client from '@/api/client';
import { Trash2 } from 'lucide-react';
export default function VolunteerAssignmentsPage() {
    const qc = useQueryClient();
    const [volunteerId, setVolunteerId] = useState('');
    const [floorId, setFloorId] = useState('');
    const [roomId, setRoomId] = useState('');
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');
    const { data: volunteers = [] } = useQuery({
        queryKey: ['volunteers'],
        queryFn: () => client.get('/users/', { params: { role: 'volunteer' } }).then((r) => r.data.users ?? []),
    });
    const { data: floors = [] } = useQuery({ queryKey: ['floors'], queryFn: adminApi.getFloors });
    const { data: rooms = [] } = useQuery({ queryKey: ['rooms'], queryFn: adminApi.getRooms });
    const { data: assignments = [], isLoading } = useQuery({
        queryKey: ['volunteer-assignments'],
        queryFn: adminApi.getVolunteerAssignments,
    });
    const assign = useMutation({
        mutationFn: () => adminApi.assignVolunteer(Number(volunteerId), Number(floorId), Number(roomId)),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['volunteer-assignments'] });
            setMsg('Volunteer assigned successfully!');
            setVolunteerId('');
            setFloorId('');
            setRoomId('');
            setTimeout(() => setMsg(''), 3000);
        },
        onError: (e) => { setErr(e?.response?.data?.detail ?? 'Failed to assign'); setTimeout(() => setErr(''), 4000); },
    });
    const unassign = useMutation({
        mutationFn: (id) => adminApi.removeVolunteerAssignment(id),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['volunteer-assignments'] }); setMsg('Assignment removed.'); setTimeout(() => setMsg(''), 3000); },
        onError: (e) => { setErr(e?.response?.data?.detail ?? 'Failed to remove'); setTimeout(() => setErr(''), 4000); },
    });
    const filteredRooms = floorId ? rooms.filter((r) => r.floor_id === Number(floorId)) : rooms;
    const assignedVolunteerIds = new Set(assignments.map((a) => a.volunteer_id));
    const getVolunteerName = (id) => volunteers.find((v) => v.id === id)?.name ?? `Volunteer #${id}`;
    const getFloorNum = (id) => floors.find((f) => f.id === id)?.floor_number ?? `Floor ${id}`;
    const getRoomNum = (id) => rooms.find((r) => r.id === id)?.room_number ?? `Room ${id}`;
    return (_jsxs("div", { className: "space-y-5", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Volunteer Assignments" }), _jsx("p", { className: "text-gray-500 text-sm mt-0.5", children: "Assign volunteers to floors and rooms \u2014 they can only see teams and mentors in their assigned location" })] }), msg && _jsx("div", { className: "bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm", children: msg }), err && _jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm", children: err }), _jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
                    { label: 'Total Volunteers', value: volunteers.length, icon: '🤝' },
                    { label: 'Assigned', value: assignedVolunteerIds.size, icon: '✅' },
                    { label: 'Unassigned', value: volunteers.length - assignedVolunteerIds.size, icon: '⏳' },
                    { label: 'Total Assignments', value: assignments.length, icon: '📌' },
                ].map((s) => (_jsxs("div", { className: "bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3", children: [_jsx("span", { className: "text-2xl", children: s.icon }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold text-gray-900", children: s.value }), _jsx("div", { className: "text-xs text-gray-500", children: s.label })] })] }, s.label))) }), _jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-sm text-blue-800", children: "\u2139\uFE0F Unassigned volunteers cannot see any teams or mentors. Assign them to a floor and room to grant access." }), _jsxs("div", { className: "bg-white rounded-xl border border-gray-200 p-5", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-4", children: "Assign Volunteer to Location" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Select Volunteer" }), _jsxs("select", { value: volunteerId, onChange: (e) => setVolunteerId(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500", children: [_jsx("option", { value: "", children: "Choose volunteer\u2026" }), volunteers.map((v) => (_jsxs("option", { value: v.id, children: [v.name, assignedVolunteerIds.has(v.id) ? ' (assigned)' : ''] }, v.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Floor" }), _jsxs("select", { value: floorId, onChange: (e) => { setFloorId(e.target.value); setRoomId(''); }, className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500", children: [_jsx("option", { value: "", children: "Select Floor" }), floors.map((f) => _jsx("option", { value: f.id, children: f.floor_number }, f.id))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Room" }), _jsxs("select", { value: roomId, onChange: (e) => setRoomId(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500", children: [_jsx("option", { value: "", children: "Select Room" }), filteredRooms.map((r) => _jsxs("option", { value: r.id, children: [r.room_number, " (Cap: ", r.capacity, ")"] }, r.id))] })] })] }), _jsx("button", { disabled: !volunteerId || !floorId || !roomId || assign.isPending, onClick: () => { setMsg(''); setErr(''); assign.mutate(); }, className: "mt-4 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors", children: assign.isPending ? 'Assigning…' : '+ Assign Volunteer' })] }), _jsxs("div", { className: "bg-white rounded-xl border border-gray-200 overflow-hidden", children: [_jsx("div", { className: "px-5 py-3 border-b border-gray-100", children: _jsxs("h3", { className: "font-semibold text-gray-900", children: ["Current Assignments (", assignments.length, ")"] }) }), isLoading ? (_jsx("div", { className: "py-10 text-center text-gray-400", children: "Loading\u2026" })) : assignments.length === 0 ? (_jsx("div", { className: "py-10 text-center text-gray-400", children: "No assignments yet" })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-gray-50 text-xs text-gray-500 uppercase tracking-wide", children: _jsxs("tr", { children: [_jsx("th", { className: "px-5 py-3 text-left", children: "Volunteer" }), _jsx("th", { className: "px-5 py-3 text-left", children: "Location" }), _jsx("th", { className: "px-5 py-3 text-right", children: "Action" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-100", children: assignments.map((a) => (_jsxs("tr", { className: "hover:bg-gray-50 transition-colors", children: [_jsx("td", { className: "px-5 py-3", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 text-xs font-semibold", children: getVolunteerName(a.volunteer_id).slice(0, 2).toUpperCase() }), _jsx("span", { className: "font-medium text-gray-900", children: getVolunteerName(a.volunteer_id) })] }) }), _jsx("td", { className: "px-5 py-3", children: _jsxs("span", { className: "inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 text-xs font-medium px-2.5 py-1 rounded-full", children: ["\uD83D\uDCCD ", getFloorNum(a.floor_id), " \u2014 ", getRoomNum(a.room_id)] }) }), _jsx("td", { className: "px-5 py-3 text-right", children: _jsx("button", { onClick: () => unassign.mutate(a.id), disabled: unassign.isPending, className: "text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors disabled:opacity-50", title: "Remove assignment", children: _jsx(Trash2, { className: "w-4 h-4" }) }) })] }, a.id))) })] }) }))] }), volunteers.filter((v) => !assignedVolunteerIds.has(v.id)).length > 0 && (_jsxs("div", { className: "bg-white rounded-xl border border-gray-200 overflow-hidden", children: [_jsxs("div", { className: "px-5 py-3 border-b border-gray-100 flex items-center gap-2", children: [_jsx("span", { className: "text-yellow-500", children: "\u26A0\uFE0F" }), _jsx("h3", { className: "font-semibold text-gray-900", children: "Unassigned Volunteers" }), _jsx("span", { className: "text-xs text-gray-400 ml-1", children: "\u2014 cannot see any data until assigned" })] }), _jsx("div", { className: "divide-y divide-gray-100", children: volunteers.filter((v) => !assignedVolunteerIds.has(v.id)).map((v) => (_jsxs("div", { className: "px-5 py-3 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 text-xs font-semibold", children: v.name.slice(0, 2).toUpperCase() }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: v.name }), _jsx("p", { className: "text-xs text-gray-400", children: v.email })] })] }), _jsx("span", { className: "text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full", children: "Not assigned" })] }, v.id))) })] }))] }));
}

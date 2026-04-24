import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/api/admin';
import client from '@/api/client';
export default function MentorAssignmentsPage() {
    const qc = useQueryClient();
    const [mentorId, setMentorId] = useState('');
    const [floorId, setFloorId] = useState('');
    const [roomId, setRoomId] = useState('');
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');
    const { data: mentors = [] } = useQuery({
        queryKey: ['mentors'],
        queryFn: () => client.get('/users/', { params: { role: 'mentor' } }).then((r) => r.data.users ?? []),
    });
    const { data: floors = [] } = useQuery({ queryKey: ['floors'], queryFn: adminApi.getFloors });
    const { data: rooms = [] } = useQuery({ queryKey: ['rooms'], queryFn: adminApi.getRooms });
    const { data: assignments = [], isLoading } = useQuery({ queryKey: ['mentor-assignments'], queryFn: adminApi.getMentorAssignments });
    const assign = useMutation({
        mutationFn: () => adminApi.assignMentor(Number(mentorId), Number(floorId), Number(roomId)),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['mentor-assignments'] }); setMsg('Mentor assigned!'); setMentorId(''); setFloorId(''); setRoomId(''); },
        onError: (e) => setErr(e?.response?.data?.detail ?? 'Failed to assign'),
    });
    const remove = useMutation({
        mutationFn: (id) => adminApi.removeMentorAssignment(id),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['mentor-assignments'] }); setMsg('Assignment removed'); },
        onError: () => setErr('Failed to remove'),
    });
    const filteredRooms = floorId ? rooms.filter((r) => r.floor_id === Number(floorId)) : rooms;
    const getMentorName = (id) => mentors.find((m) => m.id === id)?.name ?? `Mentor #${id}`;
    const getFloorNum = (id) => floors.find((f) => f.id === id)?.floor_number ?? id;
    const getRoomNum = (id) => rooms.find((r) => r.id === id)?.room_number ?? id;
    const stats = {
        total: mentors.length,
        assigned: new Set(assignments.map((a) => a.mentor_id)).size,
        totalAssignments: assignments.length,
        totalRooms: rooms.length,
    };
    return (_jsxs("div", { className: "space-y-5", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Mentor Assignments" }), _jsx("p", { className: "text-gray-500 text-sm mt-0.5", children: "Assign mentors to floors and rooms" })] }), msg && _jsx("div", { className: "bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm", children: msg }), err && _jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm", children: err }), _jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
                    { label: 'Total Mentors', value: stats.total, icon: '🎓' },
                    { label: 'Assigned Mentors', value: stats.assigned, icon: '✅' },
                    { label: 'Total Assignments', value: stats.totalAssignments, icon: '📌' },
                    { label: 'Available Rooms', value: stats.totalRooms, icon: '🚪' },
                ].map((s) => (_jsxs("div", { className: "bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3", children: [_jsx("span", { className: "text-2xl", children: s.icon }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold text-gray-900", children: s.value }), _jsx("div", { className: "text-xs text-gray-500", children: s.label })] })] }, s.label))) }), _jsxs("div", { className: "bg-white rounded-xl border border-gray-200 p-5", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-4", children: "Assign Mentor to Location" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Select Mentor" }), _jsxs("select", { value: mentorId, onChange: (e) => setMentorId(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500", children: [_jsx("option", { value: "", children: "Choose mentor\u2026" }), mentors.map((m) => _jsxs("option", { value: m.id, children: [m.name, " (", m.email, ")"] }, m.id))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Floor" }), _jsxs("select", { value: floorId, onChange: (e) => { setFloorId(e.target.value); setRoomId(''); }, className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500", children: [_jsx("option", { value: "", children: "Select Floor" }), floors.map((f) => _jsxs("option", { value: f.id, children: ["Floor ", f.floor_number] }, f.id))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Room" }), _jsxs("select", { value: roomId, onChange: (e) => setRoomId(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500", children: [_jsx("option", { value: "", children: "Select Room" }), filteredRooms.map((r) => _jsxs("option", { value: r.id, children: ["Room ", r.room_number, " (Cap: ", r.capacity, ")"] }, r.id))] })] })] }), _jsx("button", { disabled: !mentorId || !floorId || !roomId, onClick: () => { setMsg(''); setErr(''); assign.mutate(); }, className: "mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors", children: "+ Assign Mentor" })] }), _jsxs("div", { className: "bg-white rounded-xl border border-gray-200 overflow-hidden", children: [_jsx("div", { className: "px-5 py-3 border-b border-gray-100", children: _jsxs("h3", { className: "font-semibold text-gray-900", children: ["Current Assignments (", assignments.length, ")"] }) }), isLoading ? (_jsx("div", { className: "py-10 text-center text-gray-400", children: "Loading\u2026" })) : assignments.length === 0 ? (_jsx("div", { className: "py-10 text-center text-gray-400", children: "No assignments yet" })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-gray-50 text-xs text-gray-500 uppercase tracking-wide", children: _jsxs("tr", { children: [_jsx("th", { className: "px-5 py-3 text-left", children: "Mentor" }), _jsx("th", { className: "px-5 py-3 text-left", children: "Location" }), _jsx("th", { className: "px-5 py-3 text-left", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-100", children: assignments.map((a) => (_jsxs("tr", { className: "hover:bg-gray-50 transition-colors", children: [_jsx("td", { className: "px-5 py-3", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xs font-semibold", children: getMentorName(a.mentor_id).slice(0, 2).toUpperCase() }), _jsx("span", { className: "font-medium text-gray-900", children: getMentorName(a.mentor_id) })] }) }), _jsxs("td", { className: "px-5 py-3 text-gray-600", children: ["Floor ", getFloorNum(a.floor_id), " \u00B7 Room ", getRoomNum(a.room_id)] }), _jsx("td", { className: "px-5 py-3", children: _jsx("button", { onClick: () => { if (confirm('Remove this assignment?')) {
                                                        setMsg('');
                                                        setErr('');
                                                        remove.mutate(a.id);
                                                    } }, className: "text-red-500 hover:text-red-700 text-xs font-medium transition-colors", children: "Remove" }) })] }, a.id))) })] }) }))] })] }));
}

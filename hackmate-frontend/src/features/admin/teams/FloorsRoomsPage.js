import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/api/admin';
function ReassignModal({ teams, floors, rooms, onConfirm, onCancel, loading }) {
    const [assignments, setAssignments] = useState(Object.fromEntries(teams.map((t) => [t.team_id, { floor_id: '', room_id: '' }])));
    const setFloor = (teamId, floor_id) => setAssignments((prev) => ({ ...prev, [teamId]: { floor_id, room_id: '' } }));
    const setRoom = (teamId, room_id) => setAssignments((prev) => ({ ...prev, [teamId]: { ...prev[teamId], room_id } }));
    const allAssigned = teams.every((t) => assignments[t.team_id]?.floor_id && assignments[t.team_id]?.room_id);
    const handleConfirm = () => {
        const reassignments = teams.map((t) => ({
            team_id: t.team_id,
            new_floor_id: Number(assignments[t.team_id].floor_id),
            new_room_id: Number(assignments[t.team_id].room_id),
        }));
        onConfirm(reassignments);
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40", children: _jsxs("div", { className: "bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 space-y-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Reassign Teams Before Deleting" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "The following teams are assigned to this location. Reassign each one to proceed with deletion." })] }), _jsx("div", { className: "space-y-4 max-h-72 overflow-y-auto pr-1", children: teams.map((team) => {
                        const selectedFloor = assignments[team.team_id]?.floor_id;
                        const availableRooms = rooms.filter((r) => String(r.floor_id) === selectedFloor);
                        return (_jsxs("div", { className: "border border-gray-200 rounded-lg p-3 space-y-2", children: [_jsx("p", { className: "text-sm font-medium text-gray-800", children: team.team_name }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsxs("select", { value: selectedFloor, onChange: (e) => setFloor(team.team_id, e.target.value), className: "px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500", children: [_jsx("option", { value: "", children: "New Floor" }), floors.map((f) => (_jsxs("option", { value: f.id, children: ["Floor ", f.floor_number] }, f.id)))] }), _jsxs("select", { value: assignments[team.team_id]?.room_id, onChange: (e) => setRoom(team.team_id, e.target.value), disabled: !selectedFloor, className: "px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50", children: [_jsx("option", { value: "", children: "New Room" }), availableRooms.map((r) => (_jsxs("option", { value: r.id, children: ["Room ", r.room_number] }, r.id)))] })] })] }, team.team_id));
                    }) }), _jsxs("div", { className: "flex gap-3 pt-2", children: [_jsx("button", { onClick: onCancel, className: "flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors", children: "Cancel" }), _jsx("button", { onClick: handleConfirm, disabled: !allAssigned || loading, className: "flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors", children: loading ? 'Reassigning...' : 'Reassign & Delete' })] })] }) }));
}
export default function FloorsRoomsPage() {
    const qc = useQueryClient();
    const [floorNum, setFloorNum] = useState('');
    const [floorDesc, setFloorDesc] = useState('');
    const [roomFloor, setRoomFloor] = useState('');
    const [roomNum, setRoomNum] = useState('');
    const [roomCap, setRoomCap] = useState('');
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');
    const [pendingDelete, setPendingDelete] = useState(null);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);
    const { data: floors = [] } = useQuery({ queryKey: ['floors'], queryFn: adminApi.getFloors });
    const { data: rooms = [] } = useQuery({ queryKey: ['rooms'], queryFn: adminApi.getRooms });
    const invalidate = () => {
        qc.invalidateQueries({ queryKey: ['floors'] });
        qc.invalidateQueries({ queryKey: ['rooms'] });
    };
    const addFloor = useMutation({
        mutationFn: () => adminApi.createFloor(floorNum, floorDesc || undefined),
        onSuccess: () => { invalidate(); setMsg('Floor added!'); setFloorNum(''); setFloorDesc(''); },
        onError: (e) => setErr(e?.response?.data?.detail ?? 'Failed to add floor'),
    });
    const addRoom = useMutation({
        mutationFn: () => adminApi.createRoom(Number(roomFloor), roomNum, Number(roomCap)),
        onSuccess: () => { invalidate(); setMsg('Room added!'); setRoomFloor(''); setRoomNum(''); setRoomCap(''); },
        onError: (e) => setErr(e?.response?.data?.detail ?? 'Failed to add room'),
    });
    const deleteFloor = useMutation({
        mutationFn: adminApi.deleteFloor,
        onSuccess: () => { invalidate(); setMsg('Floor deleted'); setPendingDelete(null); },
        onError: (e) => {
            const detail = e?.response?.data?.detail;
            if (e?.response?.status === 409 && detail?.teams) {
                setPendingDelete({ type: 'floor', id: pendingDeleteId, teams: detail.teams });
                setErr(detail.message ?? 'Teams are assigned to this floor.');
            }
            else {
                setErr(typeof detail === 'string' ? detail : 'Failed to delete floor');
            }
        },
    });
    const deleteRoom = useMutation({
        mutationFn: adminApi.deleteRoom,
        onSuccess: () => { invalidate(); setMsg('Room deleted'); setPendingDelete(null); },
        onError: (e) => {
            const detail = e?.response?.data?.detail;
            if (e?.response?.status === 409 && detail?.teams) {
                setPendingDelete({ type: 'room', id: pendingDeleteId, teams: detail.teams });
                setErr(detail.message ?? 'Teams are assigned to this room.');
            }
            else {
                setErr(typeof detail === 'string' ? detail : 'Failed to delete room');
            }
        },
    });
    const reassignAndDelete = useMutation({
        mutationFn: async ({ reassignments, deleteType, deleteId }) => {
            await adminApi.bulkReassignTeams(reassignments);
            if (deleteType === 'floor')
                await adminApi.deleteFloor(deleteId);
            else
                await adminApi.deleteRoom(deleteId);
        },
        onSuccess: () => {
            invalidate();
            setMsg('Teams reassigned and location deleted.');
            setPendingDelete(null);
            setErr('');
        },
        onError: (e) => setErr(e?.response?.data?.detail?.message ?? 'Reassignment failed'),
    });
    const handleDeleteFloor = (id) => {
        setMsg('');
        setErr('');
        setPendingDeleteId(id);
        deleteFloor.mutate(id);
    };
    const handleDeleteRoom = (id) => {
        setMsg('');
        setErr('');
        setPendingDeleteId(id);
        deleteRoom.mutate(id);
    };
    const handleReassignConfirm = (reassignments) => {
        if (!pendingDelete)
            return;
        reassignAndDelete.mutate({
            reassignments,
            deleteType: pendingDelete.type,
            deleteId: pendingDelete.id,
        });
    };
    const getFloorNum = (id) => floors.find((f) => f.id === id)?.floor_number ?? id;
    return (_jsxs("div", { className: "space-y-5", children: [pendingDelete && (_jsx(ReassignModal, { teams: pendingDelete.teams, floors: floors, rooms: rooms, onConfirm: handleReassignConfirm, onCancel: () => { setPendingDelete(null); setErr(''); }, loading: reassignAndDelete.isPending })), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Floors & Rooms" }), _jsx("p", { className: "text-gray-500 text-sm mt-0.5", children: "Manage venue floors and rooms" })] }), msg && _jsx("div", { className: "bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm", children: msg }), err && _jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm", children: err }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "bg-white rounded-xl border border-gray-200 p-5", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-4", children: "Add Floor" }), _jsxs("div", { className: "space-y-3", children: [_jsx("input", { type: "text", placeholder: "Floor number (e.g., 1, 2, Ground)", value: floorNum, onChange: (e) => setFloorNum(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" }), _jsx("input", { type: "text", placeholder: "Description (optional)", value: floorDesc, onChange: (e) => setFloorDesc(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" }), _jsx("button", { disabled: !floorNum, onClick: () => { setMsg(''); setErr(''); addFloor.mutate(); }, className: "w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-2 rounded-lg text-sm font-medium transition-colors", children: "+ Add Floor" })] })] }), _jsxs("div", { className: "bg-white rounded-xl border border-gray-200 overflow-hidden", children: [_jsx("div", { className: "px-5 py-3 border-b border-gray-100", children: _jsxs("h3", { className: "font-semibold text-gray-900", children: ["Floors (", floors.length, ")"] }) }), floors.length === 0 ? (_jsx("div", { className: "py-8 text-center text-gray-400 text-sm", children: "No floors yet" })) : (_jsx("div", { className: "divide-y divide-gray-100", children: floors.map((f) => (_jsxs("div", { className: "px-5 py-3 flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("span", { className: "font-medium text-gray-900", children: ["Floor ", f.floor_number] }), f.description && _jsx("span", { className: "text-xs text-gray-500 ml-2", children: f.description })] }), _jsx("button", { onClick: () => { if (confirm('Delete this floor and all its rooms?'))
                                                        handleDeleteFloor(f.id); }, className: "text-red-500 hover:text-red-700 text-xs transition-colors", children: "Delete" })] }, f.id))) }))] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "bg-white rounded-xl border border-gray-200 p-5", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-4", children: "Add Room" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("select", { value: roomFloor, onChange: (e) => setRoomFloor(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500", children: [_jsx("option", { value: "", children: "Select Floor" }), floors.map((f) => _jsxs("option", { value: f.id, children: ["Floor ", f.floor_number] }, f.id))] }), _jsx("input", { type: "text", placeholder: "Room number (e.g., 101, A1)", value: roomNum, onChange: (e) => setRoomNum(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" }), _jsx("input", { type: "number", placeholder: "Capacity", min: 1, value: roomCap, onChange: (e) => setRoomCap(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" }), _jsx("button", { disabled: !roomFloor || !roomNum || !roomCap, onClick: () => { setMsg(''); setErr(''); addRoom.mutate(); }, className: "w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white py-2 rounded-lg text-sm font-medium transition-colors", children: "+ Add Room" })] })] }), _jsxs("div", { className: "bg-white rounded-xl border border-gray-200 overflow-hidden", children: [_jsx("div", { className: "px-5 py-3 border-b border-gray-100", children: _jsxs("h3", { className: "font-semibold text-gray-900", children: ["Rooms (", rooms.length, ")"] }) }), rooms.length === 0 ? (_jsx("div", { className: "py-8 text-center text-gray-400 text-sm", children: "No rooms yet" })) : (_jsx("div", { className: "divide-y divide-gray-100", children: rooms.map((r) => (_jsxs("div", { className: "px-5 py-3 flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("span", { className: "font-medium text-gray-900", children: ["Room ", r.room_number] }), _jsxs("span", { className: "text-xs text-gray-500 ml-2", children: ["Floor ", getFloorNum(r.floor_id), " \u00B7 Cap: ", r.capacity] })] }), _jsx("button", { onClick: () => { if (confirm('Delete this room?'))
                                                        handleDeleteRoom(r.id); }, className: "text-red-500 hover:text-red-700 text-xs transition-colors", children: "Delete" })] }, r.id))) }))] })] })] })] }));
}

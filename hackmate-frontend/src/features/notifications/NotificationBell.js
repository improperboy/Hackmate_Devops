import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '@/api/notifications';
export default function NotificationBell() {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const qc = useQueryClient();
    const { data: countData } = useQuery({
        queryKey: ['notifications', 'unread-count'],
        queryFn: notificationsApi.getUnreadCount,
        refetchInterval: 30000,
    });
    const { data: notifications = [] } = useQuery({
        queryKey: ['notifications', 'mine'],
        queryFn: notificationsApi.getMine,
        enabled: open,
    });
    const markRead = useMutation({
        mutationFn: notificationsApi.markRead,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target))
                setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);
    const unread = countData?.unread ?? 0;
    return (_jsxs("div", { className: "relative", ref: ref, children: [_jsxs("button", { onClick: () => setOpen((o) => !o), className: "relative p-1.5 rounded-md text-gray-500 hover:bg-gray-100", "aria-label": "Notifications", children: [_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" }) }), unread > 0 && (_jsx("span", { className: "absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white", children: unread > 9 ? '9+' : unread }))] }), open && (_jsxs("div", { className: "absolute right-0 top-10 z-50 w-80 rounded-lg border border-gray-200 bg-white shadow-lg", children: [_jsxs("div", { className: "flex items-center justify-between border-b px-4 py-2.5", children: [_jsx("span", { className: "text-sm font-semibold text-gray-800", children: "Notifications" }), unread > 0 && (_jsxs("span", { className: "text-xs text-indigo-600", children: [unread, " unread"] }))] }), _jsx("ul", { className: "max-h-72 overflow-y-auto divide-y divide-gray-100", children: notifications.length === 0 ? (_jsx("li", { className: "px-4 py-6 text-center text-sm text-gray-400", children: "No notifications" })) : (notifications.map((n) => (_jsxs("li", { className: `px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${!n.read_at ? 'bg-indigo-50' : ''}`, onClick: () => {
                                if (!n.read_at)
                                    markRead.mutate(n.notification_id);
                            }, children: [_jsx("p", { className: "text-xs text-gray-500", children: n.created_at ? new Date(n.created_at).toLocaleString() : '' }), !n.read_at && (_jsx("span", { className: "inline-block mt-0.5 text-[10px] font-semibold text-indigo-600 uppercase tracking-wide", children: "New" }))] }, n.id)))) })] }))] }));
}

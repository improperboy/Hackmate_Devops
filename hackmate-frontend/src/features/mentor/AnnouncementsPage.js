import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import client from '@/api/client';
import { Megaphone, Clock, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
const PER_PAGE = 10;
export default function MentorAnnouncementsPage() {
    const [page, setPage] = useState(1);
    const [expanded, setExpanded] = useState(null);
    const { data, isLoading } = useQuery({
        queryKey: ['mentor-announcements', page],
        queryFn: () => client.get(`/announcements/?page=${page}&per_page=${PER_PAGE}`).then((r) => r.data),
    });
    const posts = Array.isArray(data) ? data : (data?.items ?? []);
    const total = Array.isArray(data) ? data.length : (data?.total ?? posts.length);
    const totalPages = Math.ceil(total / PER_PAGE);
    const timeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60)
            return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24)
            return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    };
    return (_jsxs("div", { className: "space-y-5 max-w-3xl", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Announcements" }), _jsx("p", { className: "text-gray-500 text-sm mt-0.5", children: "Stay updated with important hackathon information" })] }), isLoading ? (_jsx("div", { className: "py-16 text-center text-gray-400", children: "Loading announcements\u2026" })) : posts.length === 0 ? (_jsxs("div", { className: "bg-white rounded-2xl border border-gray-200 p-16 text-center", children: [_jsx(Megaphone, { className: "w-12 h-12 text-gray-300 mx-auto mb-4" }), _jsx("p", { className: "text-gray-500", children: "No announcements yet" })] })) : (_jsx("div", { className: "space-y-4", children: posts.map((post) => {
                    const isExpanded = expanded === post.id;
                    const isLong = post.content.length > 300;
                    const displayContent = isExpanded || !isLong ? post.content : post.content.slice(0, 300) + '…';
                    return (_jsxs("div", { className: "bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-green-200 hover:shadow-sm transition-all", children: [_jsx("div", { className: "bg-gradient-to-r from-green-50 to-emerald-50 px-5 py-4 border-b border-gray-100", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shrink-0", children: _jsx(Megaphone, { className: "text-white w-4 h-4" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h3", { className: "font-bold text-gray-900", children: post.title }), _jsxs("div", { className: "flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap", children: [post.author_name && _jsxs("span", { children: ["\uD83D\uDC64 ", post.author_name] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { className: "w-3 h-3" }), new Date(post.created_at).toLocaleDateString(), " \u00B7 ", timeAgo(post.created_at)] })] })] })] }) }), _jsxs("div", { className: "px-5 py-4", children: [_jsx("p", { className: "text-gray-800 text-sm leading-relaxed whitespace-pre-line", children: displayContent }), isLong && (_jsx("button", { onClick: () => setExpanded(isExpanded ? null : post.id), className: "mt-2 text-green-600 text-xs font-medium hover:underline", children: isExpanded ? 'Show less' : 'Read more' })), post.link_url && post.link_text && (_jsxs("div", { className: "mt-3 bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shrink-0", children: _jsx(ExternalLink, { className: "text-white w-3.5 h-3.5" }) }), _jsx("a", { href: post.link_url, target: "_blank", rel: "noreferrer", className: "text-sm text-blue-800 font-semibold hover:underline", children: post.link_text })] }))] })] }, post.id));
                }) })), totalPages > 1 && (_jsxs("div", { className: "flex items-center justify-center gap-2 pt-2", children: [_jsx("button", { onClick: () => setPage((p) => Math.max(1, p - 1)), disabled: page === 1, className: "p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed", children: _jsx(ChevronLeft, { className: "w-4 h-4" }) }), Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (_jsx("button", { onClick: () => setPage(p), className: `w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-green-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`, children: p }, p))), _jsx("button", { onClick: () => setPage((p) => Math.min(totalPages, p + 1)), disabled: page === totalPages, className: "p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed", children: _jsx(ChevronRight, { className: "w-4 h-4" }) })] }))] }));
}

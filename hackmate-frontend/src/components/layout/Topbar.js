import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { authApi } from '@/api/auth';
export default function Topbar({ onMenuClick }) {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const handleLogout = async () => {
        try {
            await authApi.logout();
        }
        catch { /* ignore */ }
        logout();
        navigate('/login');
    };
    return (_jsxs("header", { className: "h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0", children: [_jsx("button", { onClick: onMenuClick, className: "p-1.5 rounded-md text-gray-500 hover:bg-gray-100 lg:hidden", "aria-label": "Toggle menu", children: _jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 12h16M4 18h16" }) }) }), _jsx("span", { className: "text-sm font-semibold text-indigo-600 lg:hidden", children: "HackMate" }), _jsxs("div", { className: "ml-auto flex items-center gap-3", children: [_jsxs("span", { className: "text-sm text-gray-600 hidden sm:block", children: [user?.name, _jsxs("span", { className: "ml-1.5 text-xs text-gray-400 capitalize", children: ["(", user?.role, ")"] })] }), _jsx("button", { onClick: () => navigate(`/${user?.role}/change-password`), className: "text-xs text-gray-500 hover:text-gray-700 hidden sm:block", children: "Change password" }), _jsx("button", { onClick: handleLogout, className: "text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md transition-colors", children: "Sign out" })] })] }));
}

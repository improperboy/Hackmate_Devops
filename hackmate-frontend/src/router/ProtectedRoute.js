import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/useAuthStore';
export default function ProtectedRoute({ role, children }) {
    const user = useAuthStore((s) => s.user);
    const token = useAuthStore((s) => s.token);
    if (!token || !user)
        return _jsx(Navigate, { to: "/login", replace: true });
    if (role && user.role !== role)
        return _jsx(Navigate, { to: `/${user.role}`, replace: true });
    return _jsx(_Fragment, { children: children });
}

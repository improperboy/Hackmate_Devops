import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '@/api/auth';
import { useAuthStore } from './useAuthStore';
import { loginSchema } from '@/validators/auth';
export default function LoginPage() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((s) => s.setAuth);
    const { register, handleSubmit, formState: { errors }, } = useForm({ resolver: zodResolver(loginSchema) });
    const { mutate, isPending, error } = useMutation({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            setAuth(data.access_token, data.refresh_token, {
                id: data.user_id,
                name: data.name,
                role: data.role,
            });
            navigate(`/${data.role}`);
        },
    });
    const onSubmit = (data) => mutate(data);
    const apiError = error && 'response' in error
        ? error.response?.data
            ?.detail
        : null;
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 px-4", children: _jsxs("div", { className: "w-full max-w-md bg-white rounded-2xl shadow-md p-8", children: [_jsxs("div", { className: "mb-8 text-center", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "HackMate" }), _jsx("p", { className: "mt-2 text-gray-500", children: "Sign in to your account" })] }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-5", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email" }), _jsx("input", { type: "email", autoComplete: "email", ...register('email'), className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500", placeholder: "you@example.com" }), errors.email && (_jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.email.message }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Password" }), _jsx("input", { type: "password", autoComplete: "current-password", ...register('password'), className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }), errors.password && (_jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.password.message }))] }), apiError && (_jsx("p", { className: "text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2", children: apiError })), _jsx("button", { type: "submit", disabled: isPending, className: "w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors", children: isPending ? 'Signing in…' : 'Sign in' })] }), _jsxs("p", { className: "mt-6 text-center text-sm text-gray-500", children: ["Don't have an account?", ' ', _jsx(Link, { to: "/register", className: "text-indigo-600 font-medium hover:underline", children: "Register" })] })] }) }));
}

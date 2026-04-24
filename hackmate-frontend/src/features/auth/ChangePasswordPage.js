import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/auth';
import { changePasswordSchema } from '@/validators/auth';
export default function ChangePasswordPage() {
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors }, } = useForm({
        resolver: zodResolver(changePasswordSchema),
    });
    const { mutate, isPending, error, isSuccess } = useMutation({
        mutationFn: (data) => authApi.changePassword({
            current_password: data.current_password,
            new_password: data.new_password,
        }),
        onSuccess: () => {
            reset();
        },
    });
    const onSubmit = (data) => mutate(data);
    const apiError = error && 'response' in error
        ? error.response?.data
            ?.detail
        : null;
    return (_jsxs("div", { className: "max-w-md mx-auto mt-10 bg-white rounded-2xl shadow-md p-8", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Change Password" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Update your account password" })] }), isSuccess && (_jsx("div", { className: "mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700", children: "Password updated successfully." })), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-5", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Current Password" }), _jsx("input", { type: "password", ...register('current_password'), className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" }), errors.current_password && (_jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.current_password.message }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "New Password" }), _jsx("input", { type: "password", ...register('new_password'), className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" }), errors.new_password && (_jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.new_password.message }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Confirm New Password" }), _jsx("input", { type: "password", ...register('confirm_password'), className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" }), errors.confirm_password && (_jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.confirm_password.message }))] }), apiError && (_jsx("p", { className: "text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2", children: apiError })), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { type: "button", onClick: () => navigate(-1), className: "flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors", children: "Cancel" }), _jsx("button", { type: "submit", disabled: isPending, className: "flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors", children: isPending ? 'Updating…' : 'Update Password' })] })] })] }));
}

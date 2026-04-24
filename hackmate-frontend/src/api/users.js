import client from './client';
export const usersApi = {
    search: (params) => client.get('/users/search', { params }).then((r) => r.data.users),
    getMe: () => client.get('/users/me').then((r) => r.data),
};

import client from './client';
export const submissionsApi = {
    getSettings: () => client.get('/submissions/settings').then((r) => r.data),
    updateSettings: (data) => client.put('/submissions/settings', data).then((r) => r.data),
    getByTeam: (teamId) => client.get(`/submissions/team/${teamId}`).then((r) => r.data),
    submit: (data) => client.post('/submissions/', data).then((r) => r.data),
    update: (submissionId, data) => client.put(`/submissions/${submissionId}`, data).then((r) => r.data),
};

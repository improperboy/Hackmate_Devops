import client from './client';
export const scoringApi = {
    getRounds: () => client.get('/rounds/').then((r) => r.data),
    createRound: (data) => client.post('/rounds/', data).then((r) => r.data),
    updateRound: (id, data) => client.put(`/rounds/${id}`, data).then((r) => r.data),
    deleteRound: (id) => client.delete(`/rounds/${id}`),
};

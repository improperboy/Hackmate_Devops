import client from './client';
export const volunteerApi = {
    // My location assignments
    getMyAssignments: () => client.get('/admin/venue/volunteer-assignments/mine').then((r) => r.data),
    // Teams in my assigned locations
    getAssignedTeams: (search) => client.get('/teams/volunteer/assigned', {
        params: search ? { search } : undefined,
    }).then((r) => r.data),
    // Mentors in my assigned locations
    getAssignedMentors: () => client.get('/teams/volunteer/mentors').then((r) => r.data),
    // Support messages directed to volunteer role (filtered by location on backend)
    getSupportMessages: (params) => client.get('/support/', { params }).then((r) => r.data),
    resolveSupportMessage: (id, notes) => client.put(`/support/${id}/status`, { resolution_notes: notes }, {
        params: { new_status: 'closed' },
    }).then((r) => r.data),
    // Rankings (public)
    getRankings: () => client.get('/rankings/').then((r) => r.data),
};

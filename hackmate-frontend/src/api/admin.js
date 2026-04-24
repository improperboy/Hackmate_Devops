import client from './client';
// ── Admin API ──────────────────────────────────────────────────────────────
export const adminApi = {
    // Analytics
    getAnalytics: () => client.get('/admin/analytics/').then((r) => r.data),
    // Settings
    getSettings: () => client.get('/admin/settings/').then((r) => r.data),
    updateSetting: (key, value) => client.put(`/admin/settings/${key}`, { setting_value: value }).then((r) => r.data),
    // Venue - Floors
    getFloors: () => client.get('/admin/venue/floors').then((r) => r.data),
    createFloor: (floor_number, description) => client.post('/admin/venue/floors', { floor_number, description }).then((r) => r.data),
    deleteFloor: (id) => client.delete(`/admin/venue/floors/${id}`),
    // Venue - Rooms
    getRooms: () => client.get('/admin/venue/rooms').then((r) => r.data),
    createRoom: (floor_id, room_number, capacity) => client.post('/admin/venue/rooms', { floor_id, room_number, capacity }).then((r) => r.data),
    deleteRoom: (id) => client.delete(`/admin/venue/rooms/${id}`),
    // Venue - Team location helpers
    getTeamsOnFloor: (floor_id) => client.get(`/admin/venue/floors/${floor_id}/teams`).then((r) => r.data),
    getTeamsInRoom: (room_id) => client.get(`/admin/venue/rooms/${room_id}/teams`).then((r) => r.data),
    bulkReassignTeams: (reassignments) => client.post('/admin/venue/teams/reassign-location', { reassignments }).then((r) => r.data),
    getMentorAssignments: () => client.get('/admin/venue/mentor-assignments').then((r) => r.data),
    assignMentor: (mentor_id, floor_id, room_id) => client.post('/admin/venue/mentor-assignments', { mentor_id, floor_id, room_id }).then((r) => r.data),
    removeMentorAssignment: (id) => client.delete(`/admin/venue/mentor-assignments/${id}`),
    // Volunteer assignments
    getVolunteerAssignments: () => client.get('/admin/venue/volunteer-assignments').then((r) => r.data),
    assignVolunteer: (volunteer_id, floor_id, room_id) => client.post('/admin/venue/volunteer-assignments', { volunteer_id, floor_id, room_id }).then((r) => r.data),
    removeVolunteerAssignment: (id) => client.delete(`/admin/venue/volunteer-assignments/${id}`),
    // Support messages
    getSupportMessages: (params) => client.get('/support/', { params }).then((r) => r.data),
    updateSupportStatus: (id, status, resolution_notes) => client.put(`/support/${id}/status`, { resolution_notes }, { params: { new_status: status } }).then((r) => r.data),
    deleteSupportMessage: (id) => client.delete(`/support/${id}`),
    // Activity logs
    getActivityLogs: (params) => client.get('/admin/activity-logs/', { params }).then((r) => r.data),
    // Recommendations
    getRecommendations: () => client.get('/admin/recommendations/').then((r) => r.data),
    generateRecommendations: () => client.post('/admin/recommendations/generate').then((r) => r.data),
    deleteRecommendation: (id) => client.delete(`/admin/recommendations/${id}`),
    // Submissions (admin)
    listSubmissions: (params) => client.get('/submissions/', { params }).then((r) => r.data),
    deleteSubmission: (id) => client.delete(`/submissions/${id}`),
    // Themes
    getThemes: () => client.get('/admin/themes/').then((r) => r.data),
    createTheme: (data) => client.post('/admin/themes/', data).then((r) => r.data),
    updateTheme: (id, data) => client.put(`/admin/themes/${id}`, data).then((r) => r.data),
    deleteTheme: (id) => client.delete(`/admin/themes/${id}`),
    // Exports
    exportUsers: () => client.get('/admin/export/users', { responseType: 'blob' }).then((r) => r.data),
    exportTeams: () => client.get('/admin/export/teams', { responseType: 'blob' }).then((r) => r.data),
    exportSubmissions: () => client.get('/admin/export/submissions', { responseType: 'blob' }).then((r) => r.data),
    exportScores: () => client.get('/admin/export/scores', { responseType: 'blob' }).then((r) => r.data),
    exportTeamPdf: (teamId) => client.get(`/admin/export/teams/${teamId}/pdf`, { responseType: 'blob' }).then((r) => r.data),
};

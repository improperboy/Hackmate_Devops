import client from './client';
export const teamsApi = {
    // Themes
    getThemes: () => client.get('/teams/themes').then((r) => r.data),
    // My team
    getMyTeam: () => client.get('/teams/my').then((r) => r.data),
    // List approved teams (for join page)
    listTeams: (params) => client.get('/teams/', { params }).then((r) => r.data),
    // Get team by id
    getTeam: (id) => client.get(`/teams/${id}`).then((r) => r.data),
    // Create team
    createTeam: (data) => client.post('/teams/', data).then((r) => r.data),
    // Update team (leader only)
    updateTeam: (id, data) => client.put(`/teams/${id}`, data).then((r) => r.data),
    // Delete team (leader only — remove all members then delete)
    deleteTeam: (id) => client.delete(`/teams/${id}`).then((r) => r.data),
    // Members
    getMembers: (teamId) => client.get(`/teams/${teamId}/members`).then((r) => r.data),
    removeMember: (teamId, userId) => client.delete(`/teams/${teamId}/members/${userId}`).then((r) => r.data),
    // Leave team (remove self)
    leaveTeam: (teamId, userId) => client.delete(`/teams/${teamId}/members/${userId}`).then((r) => r.data),
    // Join requests — send
    sendJoinRequest: (data) => client.post('/teams/join-requests', data).then((r) => r.data),
    // Join requests — my sent requests
    getMyJoinRequests: () => client.get('/teams/join-requests/mine').then((r) => r.data),
    // Join requests — incoming (leader sees requests to their team)
    getTeamJoinRequests: (teamId) => client.get(`/teams/${teamId}/join-requests`).then((r) => r.data),
    // Join requests — respond (approve/reject)
    respondJoinRequest: (requestId, status) => client.put(`/teams/join-requests/${requestId}`, { status }).then((r) => r.data),
    // Invitations — send (leader invites user)
    sendInvitation: (teamId, data) => client.post(`/teams/${teamId}/invitations`, data).then((r) => r.data),
    // Invitations — mine (received)
    getMyInvitations: () => client.get('/teams/invitations/mine').then((r) => r.data),
    // Invitations — respond
    respondInvitation: (invitationId, status) => client.put(`/teams/invitations/${invitationId}`, { status }).then((r) => r.data),
    // Cancel my join request
    cancelJoinRequest: (requestId) => client.delete(`/teams/join-requests/${requestId}`).then((r) => r.data),
    // Sent invitations (leader only)
    getSentInvitations: (teamId) => client.get(`/teams/${teamId}/invitations/sent`).then((r) => r.data),
    // Cancel an invitation
    cancelInvitation: (invitationId) => client.delete(`/teams/invitations/${invitationId}`).then((r) => r.data),
};

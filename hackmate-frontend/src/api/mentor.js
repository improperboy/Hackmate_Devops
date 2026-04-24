import client from './client';
// ── Round classification (mirrors admin panel logic) ───────────────────────
export function classifyRound(r) {
    if (!r.is_active)
        return 'inactive';
    const now = new Date();
    const start = new Date(r.start_time);
    const end = new Date(r.end_time);
    if (now < start)
        return 'upcoming';
    if (now > end)
        return 'past';
    return 'active';
}
// ── Mentor API ─────────────────────────────────────────────────────────────
export const mentorApi = {
    // Assigned teams
    getAssignedTeams: (search) => client.get('/teams/mentor/assigned', {
        params: search ? { search } : undefined,
    }).then((r) => r.data),
    // Rounds — fetch all, classify on frontend (mirrors admin panel logic)
    getAllRounds: () => client.get('/rounds/').then((r) => r.data),
    // Scores
    submitScore: (data) => client.post('/scores/', data).then((r) => r.data),
    updateScore: (id, score, comment) => client.put(`/scores/${id}`, { score, comment }).then((r) => r.data),
    getMyScores: () => client.get('/scores/mine').then((r) => r.data),
    getTeamScores: (teamId) => client.get(`/scores/team/${teamId}`).then((r) => r.data),
    // Team progress
    getTeamProgress: (teamId) => client.get(`/scores/team/${teamId}/progress`).then((r) => r.data),
    // Rankings
    getRankings: () => client.get('/scores/rankings/all').then((r) => r.data),
    // Support messages (mentor sees messages directed to them)
    getSupportMessages: (params) => client.get('/support/', { params }).then((r) => r.data),
    resolveSupportMessage: (id, notes) => client.put(`/support/${id}/status`, { resolution_notes: notes }, {
        params: { new_status: 'closed' },
    }).then((r) => r.data),
};

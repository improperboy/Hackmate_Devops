import client from './client';
export const scoresApi = {
    getTeamMentoringSummary: (teamId) => client.get(`/scores/team/${teamId}/mentoring-summary`).then((r) => r.data),
};

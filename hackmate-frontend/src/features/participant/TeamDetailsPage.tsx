import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/features/auth/useAuthStore'
import { teamsApi } from '@/api/teams'
import { submissionsApi } from '@/api/submissions'

export default function TeamDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const teamId = Number(id)
  const navigate = useNavigate()
  const qc = useQueryClient()
  const user = useAuthStore((s) => s.user)

  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ idea: '', problem_statement: '' })
  const [toast, setToast] = useState('')
  const [error, setError] = useState('')

  const { data: team, isLoading } = useQuery({
    queryKey: ['team', teamId],
    queryFn: () => teamsApi.getTeam(teamId),
    enabled: !!teamId,
  })

  const { data: members = [] } = useQuery({
    queryKey: ['team-members', teamId],
    queryFn: () => teamsApi.getMembers(teamId),
    enabled: !!teamId,
  })

  const { data: submission } = useQuery({
    queryKey: ['submission', teamId],
    queryFn: () => submissionsApi.getByTeam(teamId),
    enabled: !!teamId,
    retry: false,
  })

  const isLeader = team?.leader_id === user?.id

  const { mutate: updateTeam, isPending: updating } = useMutation({
    mutationFn: () => teamsApi.updateTeam(teamId, editForm),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['team', teamId] })
      setEditing(false)
      showToast('Team details updated!')
    },
    onError: (err: any) => showError(err?.response?.data?.detail ?? 'Update failed.'),
  })

  const { mutate: removeMember } = useMutation({
    mutationFn: (userId: number) => teamsApi.removeMember(teamId, userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['team-members', teamId] })
      showToast('Member removed.')
    },
    onError: (err: any) => showError(err?.response?.data?.detail ?? 'Failed to remove member.'),
  })

  const { mutate: leaveTeam } = useMutation({
    mutationFn: () => teamsApi.leaveTeam(teamId, user!.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-team'] })
      navigate('/participant/dashboard')
    },
    onError: (err: any) => showError(err?.response?.data?.detail ?? 'Failed to leave team.'),
  })

  const { mutate: deleteTeam } = useMutation({
    mutationFn: () => teamsApi.deleteTeam(teamId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-team'] })
      navigate('/participant/dashboard')
    },
    onError: (err: any) => showError(err?.response?.data?.detail ?? 'Failed to delete team.'),
  })

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }
  const showError = (msg: string) => { setError(msg); setTimeout(() => setError(''), 4000) }

  const startEdit = () => {
    setEditForm({ idea: team?.idea ?? '', problem_statement: team?.problem_statement ?? '' })
    setEditing(true)
  }

  if (isLoading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading…</div>
  if (!team) return <div className="text-center text-gray-500 mt-20">Team not found.</div>

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Details</h1>
          <p className="text-gray-500 text-sm">Manage your team information and members</p>
        </div>
        <span className="text-sm text-gray-500">Team: <span className="font-semibold">{team.name}</span></span>
      </div>

      {toast && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">{toast}</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Team Info + Submission */}
        <div className="lg:col-span-2 space-y-5">
          {/* Team Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-900">Team Information</h3>
              {isLeader && !editing && (
                <button onClick={startEdit} className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg transition-colors">
                  ✏️ Edit Details
                </button>
              )}
            </div>

            {!editing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-gray-500">Team Name</p><p className="font-semibold text-gray-900">{team.name}</p></div>
                  <div><p className="text-gray-500">Status</p><StatusBadge status={team.status} /></div>
                  {team.theme_name && (
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="text-gray-500">Theme</p>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: team.theme_color }} />
                          <span className="font-medium text-gray-900">{team.theme_name}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {team.floor_number && team.room_number && (
                    <div><p className="text-gray-500">Location</p><p className="font-medium text-gray-900">Floor {team.floor_number}, Room {team.room_number}</p></div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Project Idea</p>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg text-sm">{team.idea || 'Not provided yet'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Problem Statement</p>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg text-sm">{team.problem_statement || 'Not provided yet'}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); updateTeam() }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">💡 Project Idea *</label>
                  <textarea
                    value={editForm.idea}
                    onChange={(e) => setEditForm({ ...editForm, idea: e.target.value })}
                    rows={4}
                    className="input resize-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">❓ Problem Statement *</label>
                  <textarea
                    value={editForm.problem_statement}
                    onChange={(e) => setEditForm({ ...editForm, problem_statement: e.target.value })}
                    rows={4}
                    className="input resize-none"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={updating} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors disabled:opacity-60">
                    {updating ? 'Saving…' : '💾 Save Changes'}
                  </button>
                  <button type="button" onClick={() => setEditing(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-5 rounded-lg transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Submission */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">📤 Project Submission</h3>
            {submission ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="font-medium text-green-800 mb-3">✅ Project Submitted Successfully!</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">GitHub Repository</p>
                    <a href={submission.github_link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all">{submission.github_link}</a>
                  </div>
                  {submission.live_link && (
                    <div>
                      <p className="text-gray-500">Live Demo</p>
                      <a href={submission.live_link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all">{submission.live_link}</a>
                    </div>
                  )}
                  <div><p className="text-gray-500">Tech Stack</p><p className="text-gray-800">{submission.tech_stack}</p></div>
                  <div><p className="text-gray-500">Submitted</p><p className="text-gray-800">{submission.submitted_at ? new Date(submission.submitted_at).toLocaleString() : '—'}</p></div>
                </div>
                {isLeader && (
                  <Link to="/participant/submit" className="inline-block mt-3 bg-orange-600 hover:bg-orange-700 text-white px-4 py-1.5 rounded-lg text-sm transition-colors">
                    ✏️ Update Submission
                  </Link>
                )}
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="font-medium text-yellow-800 mb-1">⚠️ No Submission Yet</p>
                <p className="text-yellow-700 text-sm mb-3">Your team hasn't submitted the project yet.</p>
                {isLeader ? (
                  <Link to="/participant/submit" className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-1.5 rounded-lg text-sm transition-colors">
                    📤 Submit Project
                  </Link>
                ) : (
                  <p className="text-yellow-600 text-sm">Only the team leader can submit the project.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Members + Actions */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">👥 Team Members ({members.length}/4)</h3>
            <div className="space-y-3">
              {members.map((m) => (
                <div key={m.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0">
                    {(m.name ?? 'U').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium text-gray-900 truncate">{m.name ?? `User #${m.user_id}`}</p>
                      {m.user_id === team.leader_id && <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full">Leader</span>}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{m.email ?? ''}</p>
                  </div>
                  {isLeader && m.user_id !== team.leader_id && (
                    <button
                      onClick={() => {
                        if (confirm(`Remove ${m.name ?? 'this member'} from the team?`)) removeMember(m.user_id)
                      }}
                      className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                      title="Remove member"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            {members.length < 4 && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
                ℹ️ Your team can have up to {4 - members.length} more member(s).
              </div>
            )}

            {/* Team Actions */}
            <div className="mt-5 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Team Actions</h4>
              {isLeader ? (
                <div>
                  <button
                    onClick={() => {
                      if (confirm(`Delete team "${team.name}"? This will remove all members and cannot be undone.`)) {
                        if (confirm('FINAL WARNING: This permanently deletes the team and all data. Are you sure?')) {
                          deleteTeam()
                        }
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    🗑️ Delete Team
                  </button>
                  <p className="text-xs text-gray-500 mt-2">Deleting removes all members and cannot be undone.</p>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => {
                      if (confirm('Leave this team? You will lose access to all team activities.')) leaveTeam()
                    }}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    🚪 Leave Team
                  </button>
                  <p className="text-xs text-gray-500 mt-2">Leaving removes you from all team activities.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    approved: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    rejected: 'bg-red-100 text-red-800',
  }
  return (
    <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${colors[status] ?? 'bg-gray-100 text-gray-800'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

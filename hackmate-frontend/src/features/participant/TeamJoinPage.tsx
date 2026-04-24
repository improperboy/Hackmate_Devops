import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { teamsApi } from '@/api/teams'
import type { Team } from '@/types/team'

export default function TeamJoinPage() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState<Record<number, string>>({})
  const [toast, setToast] = useState('')
  const [error, setError] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['teams-list', search],
    queryFn: () => teamsApi.listTeams({ search: search || undefined }),
  })

  const { data: myRequests = [] } = useQuery({
    queryKey: ['my-join-requests'],
    queryFn: teamsApi.getMyJoinRequests,
  })

  const pendingTeamIds = new Set(
    myRequests.filter((r) => r.status === 'pending').map((r) => r.team_id)
  )

  const { mutate: sendRequest, isPending } = useMutation({
    mutationFn: ({ teamId, msg }: { teamId: number; msg: string }) =>
      teamsApi.sendJoinRequest({ team_id: teamId, message: msg }),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['my-join-requests'] })
      setToast('Join request sent successfully!')
      setMessage((prev) => ({ ...prev, [vars.teamId]: '' }))
      setTimeout(() => setToast(''), 3000)
    },
    onError: (err: any) => {
      setError(err?.response?.data?.detail ?? 'Failed to send request.')
      setTimeout(() => setError(''), 4000)
    },
  })

  const availableTeams = (data?.teams ?? []).filter((t) => (t.member_count ?? 0) < 4)

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center text-white text-lg">+</div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Join Team</h1>
          <p className="text-gray-500 text-sm">Find and join existing teams that match your interests</p>
        </div>
      </div>

      {toast && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">{toast}</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Search Teams</h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by team name, idea, or leader..."
            className="input flex-1"
          />
          <button onClick={() => setSearch('')} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl border border-gray-300 text-sm font-medium transition-colors">
            Clear
          </button>
        </div>
      </div>

      {/* Teams List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Available Teams ({availableTeams.length})</h3>
          <p className="text-xs text-gray-500 mt-1">
            You can send requests to multiple teams. When any team accepts, all other pending requests are automatically cancelled.
          </p>
        </div>

        {isLoading ? (
          <div className="p-10 text-center text-gray-400">Loading teams…</div>
        ) : availableTeams.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-gray-500 mb-4">No teams available to join at the moment.</p>
            <Link to="/participant/team/create" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
              Create Your Own Team
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 p-5">
            {availableTeams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                hasPendingRequest={pendingTeamIds.has(team.id)}
                message={message[team.id] ?? ''}
                onMessageChange={(v) => setMessage((prev) => ({ ...prev, [team.id]: v }))}
                onSend={() => sendRequest({ teamId: team.id, msg: message[team.id] ?? '' })}
                isPending={isPending}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-gray-700">
        <p className="font-semibold text-gray-900 mb-1">Important Information</p>
        You can send join requests to multiple teams simultaneously (up to 3 per team).
        When any team leader accepts your request, all other pending requests will be automatically cancelled.
        Can't find a suitable team?{' '}
        <Link to="/participant/team/create" className="text-purple-600 font-semibold hover:underline">Create your own team</Link>.
      </div>
    </div>
  )
}

function TeamCard({ team, hasPendingRequest, message, onMessageChange, onSend, isPending }: {
  team: Team
  hasPendingRequest: boolean
  message: string
  onMessageChange: (v: string) => void
  onSend: () => void
  isPending: boolean
}) {
  return (
    <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-purple-200 transition-all bg-gradient-to-br from-white to-gray-50">
      <div className="flex justify-between items-start mb-4 gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-lg font-bold text-gray-900">{team.name}</h4>
          {team.status === 'pending' && (
            <span className="text-[10px] uppercase tracking-wider font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-md">
              Pending Approval
            </span>
          )}
        </div>
        <span className="text-xs font-bold bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-1 rounded-full shrink-0">
          {team.member_count ?? 0}/4 members
        </span>
      </div>

      {team.leader_name && (
        <div className="flex items-center gap-2 mb-3 bg-white rounded-lg p-3 border border-gray-100">
          <span className="text-yellow-500">👑</span>
          <div>
            <p className="text-xs text-gray-500">Team Leader</p>
            <p className="text-sm font-medium text-gray-900">{team.leader_name}</p>
          </div>
        </div>
      )}

      {team.floor_number && team.room_number && (
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
          <span>📍</span> Floor {team.floor_number}, Room {team.room_number}
        </div>
      )}

      {team.idea && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-500 mb-1">💡 Project Idea</p>
          <p className="text-sm text-gray-700 bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
            {team.idea.length > 150 ? team.idea.slice(0, 150) + '…' : team.idea}
          </p>
        </div>
      )}

      {team.problem_statement && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 mb-1">❓ Problem Statement</p>
          <p className="text-sm text-gray-700 bg-blue-50 border border-blue-200 p-3 rounded-lg">
            {team.problem_statement.length > 150 ? team.problem_statement.slice(0, 150) + '…' : team.problem_statement}
          </p>
        </div>
      )}

      {hasPendingRequest ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-center gap-2">
          <span>⏳</span>
          <div>
            <p className="text-sm font-semibold text-yellow-800">Request Already Sent</p>
            <p className="text-xs text-yellow-700">Waiting for team leader to respond.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <textarea
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Introduce yourself and explain why you want to join... (optional)"
            rows={2}
            className="input resize-none text-sm"
          />
          <button
            onClick={onSend}
            disabled={isPending}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-2.5 rounded-xl transition-all disabled:opacity-60 text-sm"
          >
            ✉️ Send Join Request
          </button>
        </div>
      )}
    </div>
  )
}

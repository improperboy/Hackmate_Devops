import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/api/admin'
import client from '@/api/client'
import type { User } from '@/types/user'

export default function MentorRecommendationsPage() {
  const qc = useQueryClient()

  const { data: recs = [], isLoading } = useQuery({
    queryKey: ['mentor-recommendations'],
    queryFn: adminApi.getRecommendations,
  })

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ['all-users'],
    queryFn: () => client.get<User[]>('/users/').then((r) => r.data),
  })

  const generate = useMutation({
    mutationFn: adminApi.generateRecommendations,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mentor-recommendations'] }),
  })

  const deleteRec = useMutation({
    mutationFn: adminApi.deleteRecommendation,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mentor-recommendations'] }),
  })

  const getName = (id: number) => users.find((u) => u.id === id)?.name ?? `User #${id}`
  const getEmail = (id: number) => users.find((u) => u.id === id)?.email ?? ''

  const highMatches = recs.filter((r) => parseFloat(r.match_score) >= 70).length

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mentor Recommendations</h1>
          <p className="text-gray-500 text-sm mt-0.5">AI-powered mentor-participant skill matching</p>
        </div>
        <button
          onClick={() => generate.mutate()}
          disabled={generate.isPending}
          className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
          {generate.isPending ? '⏳ Generating…' : '✨ Generate Recommendations'}
        </button>
      </div>

      {generate.isSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
          Recommendations generated successfully!
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Recommendations', value: recs.length, icon: '💡' },
          { label: 'High Matches (70%+)', value: highMatches, icon: '⭐' },
          { label: 'Participants', value: new Set(recs.map((r) => r.participant_id)).size, icon: '👤' },
          { label: 'Mentors Matched', value: new Set(recs.map((r) => r.mentor_id)).size, icon: '🎓' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <span className="text-2xl">{s.icon}</span>
            <div>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Recommendations ({recs.length})</h3>
          <p className="text-xs text-gray-500 mt-0.5">Sorted by match score — top 3 per participant</p>
        </div>
        {isLoading ? (
          <div className="py-12 text-center text-gray-400">Loading…</div>
        ) : recs.length === 0 ? (
          <div className="py-12 text-center">
            <div className="text-4xl mb-3">🤖</div>
            <p className="text-gray-500 font-medium">No recommendations yet</p>
            <p className="text-gray-400 text-sm mt-1">Click "Generate Recommendations" to start</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recs.map((rec) => {
              const score = parseFloat(rec.match_score)
              const scoreColor = score >= 70 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-gray-400'
              let sharedSkills: string[] = []
              try {
                const parsed = JSON.parse(rec.skill_match_details ?? '{}')
                sharedSkills = parsed.shared_skills ?? []
              } catch { /* ignore */ }

              return (
                <div key={rec.id} className="p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Participant */}
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-semibold shrink-0">
                          {getName(rec.participant_id).slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 text-sm truncate">{getName(rec.participant_id)}</div>
                          <div className="text-xs text-gray-500 truncate">{getEmail(rec.participant_id)}</div>
                        </div>
                      </div>

                      <span className="text-gray-400 shrink-0">→</span>

                      {/* Mentor */}
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs font-semibold shrink-0">
                          {getName(rec.mentor_id).slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 text-sm truncate">{getName(rec.mentor_id)}</div>
                          <div className="text-xs text-gray-500 truncate">{getEmail(rec.mentor_id)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`${scoreColor} text-white text-xs font-semibold px-2.5 py-1 rounded-full`}>
                        {score.toFixed(0)}% match
                      </span>
                      <button onClick={() => deleteRec.mutate(rec.id)}
                        className="text-gray-400 hover:text-red-500 text-xs transition-colors">✕</button>
                    </div>
                  </div>

                  {sharedSkills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1 ml-11">
                      {sharedSkills.map((s) => (
                        <span key={s} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { teamsApi } from '@/api/teams'

export default function TeamCreatePage() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [form, setForm] = useState({ name: '', idea: '', problem_statement: '', tech_skills: '', theme_id: '' })
  const [error, setError] = useState('')

  const { data: themes = [] } = useQuery({ queryKey: ['themes'], queryFn: teamsApi.getThemes })

  const { mutate: createTeam, isPending } = useMutation({
    mutationFn: () => teamsApi.createTeam({
      name: form.name,
      idea: form.idea,
      problem_statement: form.problem_statement,
      tech_skills: form.tech_skills,
      theme_id: form.theme_id ? Number(form.theme_id) : undefined,
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-team'] })
      navigate('/participant/dashboard')
    },
    onError: (err: any) => {
      setError(err?.response?.data?.detail ?? 'Failed to create team. Please try again.')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.idea || !form.problem_statement || !form.tech_skills || !form.theme_id) {
      setError('All fields are required.')
      return
    }
    createTeam()
  }

  const selectedTheme = themes.find((t) => t.id === Number(form.theme_id))

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white text-lg">+</div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Team</h1>
          <p className="text-gray-500 text-sm">Start your hackathon journey by creating a new team</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Team Name *" icon="👥">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Innovators, CodeMasters"
              className="input"
              required
            />
          </Field>

          <Field label="Project Idea *" icon="💡">
            <textarea
              value={form.idea}
              onChange={(e) => setForm({ ...form, idea: e.target.value })}
              placeholder="Briefly describe your project idea..."
              rows={4}
              className="input resize-none"
              required
            />
          </Field>

          <Field label="Problem Statement *" icon="❓">
            <textarea
              value={form.problem_statement}
              onChange={(e) => setForm({ ...form, problem_statement: e.target.value })}
              placeholder="What problem does your project aim to solve?"
              rows={4}
              className="input resize-none"
              required
            />
          </Field>

          <Field label="Required Tech Skills *" icon="💻">
            <textarea
              value={form.tech_skills}
              onChange={(e) => setForm({ ...form, tech_skills: e.target.value })}
              placeholder="e.g., React, Node.js, Python, MongoDB..."
              rows={3}
              className="input resize-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">List technologies needed — helps match you with the right mentor.</p>
          </Field>

          <Field label="Theme Category *" icon="🏷️">
            <select
              value={form.theme_id}
              onChange={(e) => setForm({ ...form, theme_id: e.target.value })}
              className="input"
              required
              style={selectedTheme ? { borderLeftColor: selectedTheme.color_code, borderLeftWidth: 4 } : {}}
            >
              <option value="">Select a theme for your project</option>
              {themes.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            {selectedTheme?.description && (
              <p className="text-xs text-gray-600 mt-1 font-medium">{selectedTheme.description}</p>
            )}
          </Field>

          {/* Info box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-gray-700">
            <p className="font-semibold text-gray-900 mb-1">Important Information</p>
            After creating your team, it will be sent to the admin for approval. Once approved, you'll be assigned a floor and room, and can invite other participants.
            <br /><strong>Note:</strong> Theme selection cannot be changed once created.
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all disabled:opacity-60"
            >
              {isPending ? 'Creating…' : 'Create Team'}
            </button>
            <Link to="/participant/dashboard" className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-6 rounded-xl transition-all border border-gray-300">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, icon, children }: { label: string; icon: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        <span className="mr-1">{icon}</span>{label}
      </label>
      {children}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/api/admin'

const SETTING_KEYS = [
  'hackathon_name', 'hackathon_description', 'max_team_size', 'min_team_size',
  'registration_open', 'hackathon_start_date', 'hackathon_end_date',
  'contact_email', 'timezone', 'maintenance_mode', 'show_mentoring_scores_to_participants',
]

const TIMEZONES = [
  'UTC', 'America/New_York', 'America/Chicago', 'America/Los_Angeles',
  'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Asia/Kolkata', 'Australia/Sydney',
]

export default function SystemSettingsPage() {
  const qc = useQueryClient()
  const [values, setValues] = useState<Record<string, string>>({})
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const { data: settings = [], isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: adminApi.getSettings,
  })

  useEffect(() => {
    if (settings.length > 0) {
      const map: Record<string, string> = {}
      settings.forEach((s) => { map[s.setting_key] = s.setting_value })
      setValues(map)
    }
  }, [settings])

  const updateAll = useMutation({
    mutationFn: async () => {
      for (const key of SETTING_KEYS) {
        if (values[key] !== undefined) {
          await adminApi.updateSetting(key, values[key])
        }
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-settings'] }); setMsg('Settings saved successfully!') },
    onError: (e: any) => setErr(e?.response?.data?.detail ?? 'Failed to save settings'),
  })

  const set = (key: string, val: string) => setValues((prev) => ({ ...prev, [key]: val }))
  const isMaintenance = values['maintenance_mode'] === 'true' || values['maintenance_mode'] === '1'

  if (isLoading) return <div className="py-20 text-center text-gray-400">Loading settings…</div>

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-500 text-sm mt-0.5">Configure hackathon system settings</p>
        </div>
        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-xs font-medium">Admin Only</span>
      </div>

      {msg && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">{msg}</div>}
      {err && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">{err}</div>}
      {isMaintenance && (
        <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-lg text-sm">
          ⚠️ Maintenance mode is currently enabled. Only admins can access the system.
        </div>
      )}

      {/* Hackathon Info */}
      <Section title="Hackathon Information" icon="ℹ️">
        <Field label="Hackathon Name *">
          <input type="text" value={values['hackathon_name'] ?? ''} onChange={(e) => set('hackathon_name', e.target.value)}
            className="input" />
        </Field>
        <Field label="Description">
          <textarea rows={3} value={values['hackathon_description'] ?? ''} onChange={(e) => set('hackathon_description', e.target.value)}
            className="input resize-none" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Start Date & Time">
            <input type="datetime-local" value={(values['hackathon_start_date'] ?? '').replace(' ', 'T')} onChange={(e) => set('hackathon_start_date', e.target.value)}
              className="input" />
          </Field>
          <Field label="End Date & Time">
            <input type="datetime-local" value={(values['hackathon_end_date'] ?? '').replace(' ', 'T')} onChange={(e) => set('hackathon_end_date', e.target.value)}
              className="input" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Contact Email *">
            <input type="email" value={values['contact_email'] ?? ''} onChange={(e) => set('contact_email', e.target.value)}
              className="input" />
          </Field>
          <Field label="Timezone">
            <select value={values['timezone'] ?? 'UTC'} onChange={(e) => set('timezone', e.target.value)} className="input">
              {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
            </select>
          </Field>
        </div>
      </Section>

      {/* Team Config */}
      <Section title="Team Configuration" icon="👥">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Minimum Team Size *">
            <input type="number" min={1} max={10} value={values['min_team_size'] ?? '1'} onChange={(e) => set('min_team_size', e.target.value)}
              className="input" />
          </Field>
          <Field label="Maximum Team Size *">
            <input type="number" min={2} max={20} value={values['max_team_size'] ?? '4'} onChange={(e) => set('max_team_size', e.target.value)}
              className="input" />
          </Field>
        </div>
        <p className="text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
          ℹ️ These settings control team formation. Changes affect new team invitations.
        </p>
      </Section>

      {/* System Controls */}
      <Section title="System Controls" icon="⚙️">
        <p className="text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg mb-3">
          ℹ️ These settings control system-wide behavior and participant access.
        </p>
        {[
          { key: 'registration_open', label: 'Enable User Registration', desc: 'When disabled, new users cannot register (except through admin panel)' },
          { key: 'show_mentoring_scores_to_participants', label: 'Show Mentoring Scores to Participants', desc: 'When enabled, participants see actual numerical scores. When disabled, they only see feedback status.' },
          { key: 'maintenance_mode', label: 'Enable Maintenance Mode', desc: '⚠️ Warning: Only admins can access the system when maintenance mode is enabled', warn: true },
        ].map(({ key, label, desc, warn }) => (
          <div key={key} className="flex items-start gap-3">
            <input type="checkbox" id={key}
              checked={values[key] === 'true' || values[key] === '1'}
              onChange={(e) => set(key, e.target.checked ? 'true' : 'false')}
              className={`mt-0.5 w-4 h-4 rounded ${warn ? 'text-red-600' : 'text-indigo-600'}`} />
            <div>
              <label htmlFor={key} className="text-sm font-medium text-gray-900 cursor-pointer">{label}</label>
              <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </Section>

      {/* Save */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
        <p className="text-sm text-gray-500">Changes take effect immediately after saving</p>
        <button onClick={() => { setMsg(''); setErr(''); updateAll.mutate() }} disabled={updateAll.isPending}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
          {updateAll.isPending ? 'Saving…' : '💾 Save Settings'}
        </button>
      </div>
    </div>
  )
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <h3 className="font-semibold text-gray-900">{icon} {title}</h3>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  )
}

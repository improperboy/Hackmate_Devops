import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/useAuthStore'
import { teamsApi } from '@/api/teams'
import { submissionsApi } from '@/api/submissions'
import { Users, Upload, Trophy, Clock, CheckCircle, AlertTriangle, Send } from 'lucide-react'
import type { Team } from '@/types/team'
import type { Submission, SubmissionSettings } from '@/types/submission'
import type { JoinRequest } from '@/types/team'

export default function ParticipantDashboard() {
  const user = useAuthStore((s) => s.user)

  const { data: myTeam, isLoading: teamLoading } = useQuery({
    queryKey: ['my-team'],
    queryFn: teamsApi.getMyTeam,
    retry: false,
  })

  const { data: myJoinRequests } = useQuery({
    queryKey: ['my-join-requests'],
    queryFn: teamsApi.getMyJoinRequests,
    enabled: !myTeam,
  })

  const { data: submission } = useQuery({
    queryKey: ['submission', myTeam?.id],
    queryFn: () => submissionsApi.getByTeam(myTeam!.id),
    enabled: !!myTeam?.id,
    retry: false,
  })

  const { data: submissionSettings } = useQuery({
    queryKey: ['submission-settings'],
    queryFn: submissionsApi.getSettings,
    retry: false,
  })

  const pendingRequests = (myJoinRequests ?? []).filter((r) => r.status === 'pending')
  const isLeader = myTeam?.leader_id === user?.id
  const submissionStatus = submission ? 'Submitted' : submissionSettings ? 'Pending' : 'Not Available'

  if (teamLoading) {
    return <div className="flex items-center justify-center h-64 text-gray-400">Loading dashboard…</div>
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
        <p className="text-gray-500 mt-1">Hi {user?.name}, ready to build something amazing?</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Team Status"
          value={myTeam ? 'Active' : 'No Team'}
          sub={myTeam ? `Team: ${myTeam.name}` : undefined}
          subColor="text-green-600"
          icon={<Users className="text-white w-5 h-5" />}
          gradient="from-blue-500 to-purple-600"
        />

        {myTeam ? (
          <>
            <StatCard
              label="Team Members"
              value={`${myTeam.member_count ?? '—'}/4`}
              sub={(myTeam.member_count ?? 0) < 4 ? 'Can add more members' : 'Team is full'}
              icon={<Users className="text-white w-5 h-5" />}
              gradient="from-orange-500 to-red-600"
            />
            <StatCard
              label="Submission"
              value={submissionStatus}
              sub={submission ? 'Project submitted' : submissionSettings ? 'Submission pending' : 'Submissions closed'}
              icon={submission ? <CheckCircle className="text-white w-5 h-5" /> : <Upload className="text-white w-5 h-5" />}
              gradient="from-purple-500 to-pink-600"
            />
            <StatCard
              label="Location"
              value={myTeam.floor_number && myTeam.room_number ? `F${myTeam.floor_number} R${myTeam.room_number}` : 'Not Assigned'}
              icon={<Trophy className="text-white w-5 h-5" />}
              gradient="from-green-500 to-teal-600"
            />
          </>
        ) : (
          <StatCard
            label="Your Requests"
            value={String(pendingRequests.length)}
            sub={pendingRequests.length > 0 ? 'Pending responses' : 'No active requests'}
            icon={<Send className="text-white w-5 h-5" />}
            gradient="from-purple-500 to-pink-600"
          />
        )}
      </div>

      {/* Status Banner */}
      <StatusBanner myTeam={myTeam} pendingRequests={pendingRequests} />

      {/* Countdown */}
      {submissionSettings && myTeam?.status === 'approved' && (
        <Countdown endTime={submissionSettings.end_time} />
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <QuickActions myTeam={myTeam} isLeader={isLeader} pendingRequests={pendingRequests} submission={submission} submissionSettings={submissionSettings} />
          {myTeam && <TeamMembersCard teamId={myTeam.id} leaderId={myTeam.leader_id} />}
          {myTeam && submission && <SubmissionCard submission={submission} />}
        </div>
        <div>
          <QuickLinks myTeam={myTeam} isLeader={isLeader} />
        </div>
      </div>
    </div>
  )
}

// ── Sub-components ──────────────────────────────────────────────────────────

function StatCard({ label, value, sub, subColor, icon, gradient }: {
  label: string; value: string; sub?: string; subColor?: string; icon: React.ReactNode; gradient: string
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`w-11 h-11 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      {sub && <p className={`text-sm mt-3 ${subColor ?? 'text-gray-500'} truncate`}>{sub}</p>}
    </div>
  )
}

function StatusBanner({ myTeam, pendingRequests }: { myTeam: Team | undefined | null; pendingRequests: JoinRequest[] }) {
  if (myTeam) {
    return (
      <div className={`${myTeam.status === 'pending' ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'} border rounded-2xl p-5 flex items-start gap-4`}>
        <div className={`w-10 h-10 ${myTeam.status === 'pending' ? 'bg-orange-500' : 'bg-green-500'} rounded-xl flex items-center justify-center shrink-0`}>
          {myTeam.status === 'pending' ? <Clock className="text-white w-5 h-5" /> : <CheckCircle className="text-white w-5 h-5" />}
        </div>
        <div>
          <h3 className={`font-semibold ${myTeam.status === 'pending' ? 'text-orange-900' : 'text-green-900'}`}>
            You're part of team: {myTeam.name} {myTeam.status === 'pending' && '(Pending Approval)'}
          </h3>
          {myTeam.leader_name && <p className={`${myTeam.status === 'pending' ? 'text-orange-700' : 'text-green-700'} text-sm mt-0.5`}>Leader: {myTeam.leader_name}</p>}
          {myTeam.theme_name && (
            <div className="flex items-center gap-2 mt-1">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: myTeam.theme_color }} />
              <span className={`${myTeam.status === 'pending' ? 'text-orange-700' : 'text-green-700'} text-sm`}>Theme: {myTeam.theme_name}</span>
            </div>
          )}
          {myTeam.floor_number && myTeam.room_number && (
            <p className={`${myTeam.status === 'pending' ? 'text-orange-700' : 'text-green-700'} text-sm mt-1`}>📍 Floor {myTeam.floor_number}, Room {myTeam.room_number}</p>
          )}
        </div>
      </div>
    )
  }

  if (pendingRequests.length > 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shrink-0">
          <Send className="text-white w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-blue-900">
              {pendingRequests.length} Pending Join Request{pendingRequests.length > 1 ? 's' : ''}
            </h3>
            <Link to="/participant/join-requests" className="text-blue-600 text-sm hover:underline">View Details →</Link>
          </div>
          <p className="text-blue-700 text-sm mt-1">
            When a team accepts, all other pending requests are automatically cancelled.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 flex items-start gap-4">
      <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shrink-0">
        <AlertTriangle className="text-white w-5 h-5" />
      </div>
      <div>
        <h3 className="font-semibold text-yellow-900">Ready to Join the Action?</h3>
        <p className="text-yellow-700 text-sm mt-1">Create a new team or join an existing one to participate.</p>
        <div className="flex gap-3 mt-3">
          <Link to="/participant/team/create" className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors">
            Create Team
          </Link>
          <Link to="/participant/team/join" className="bg-white text-yellow-700 px-4 py-2 rounded-lg text-sm font-medium border border-yellow-300 hover:bg-yellow-50 transition-colors">
            Join Team
          </Link>
        </div>
      </div>
    </div>
  )
}

function QuickActions({ myTeam, isLeader, pendingRequests, submission, submissionSettings }: {
  myTeam: Team | undefined | null
  isLeader: boolean
  pendingRequests: JoinRequest[]
  submission: Submission | undefined
  submissionSettings: SubmissionSettings | undefined
}) {
  if (!myTeam) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-bold text-gray-900 mb-4">{pendingRequests.length > 0 ? 'Actions' : 'Get Started'}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ActionCard to="/participant/team/create" gradient="from-blue-500 to-indigo-600" icon="➕" title="Create Team" desc="Start your own team and invite others." />
          <ActionCard to="/participant/team/join" gradient="from-green-500 to-emerald-600" icon="🤝" title="Join Team" desc="Find and join an existing team." />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h3 className="font-bold text-gray-900 mb-4">Team Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <ActionCard to={`/participant/team/${myTeam.id}`} gradient="from-purple-500 to-pink-600" icon="👥" title="Team Details" small />
        {isLeader && (
          <>
            <ActionCard to="/participant/manage-requests" gradient="from-indigo-500 to-blue-600" icon="✅" title="Join Requests" small />
            <ActionCard to="/participant/search-users" gradient="from-cyan-500 to-teal-600" icon="🔍" title="Find Members" small />
            {submissionSettings && myTeam.status === 'approved' && (
              <ActionCard to="/participant/submit" gradient="from-orange-500 to-red-600" icon="📤" title={submission ? 'Update Project' : 'Submit Project'} small />
            )}
          </>
        )}
        {myTeam.status === 'approved' && (
          <ActionCard to="/participant/mentoring-rounds" gradient="from-teal-500 to-green-600" icon="🎓" title="Mentoring" small />
        )}
        <ActionCard to="/participant/rankings" gradient="from-yellow-500 to-orange-600" icon="🏆" title="Rankings" small />
      </div>
    </div>
  )
}

function ActionCard({ to, gradient, icon, title, desc, small }: {
  to: string; gradient: string; icon: string; title: string; desc?: string; small?: boolean
}) {
  return (
    <Link to={to} className="group bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 rounded-xl p-4 transition-all">
      <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform text-lg`}>
        {icon}
      </div>
      <p className={`font-medium text-gray-900 ${small ? 'text-sm' : ''}`}>{title}</p>
      {desc && <p className="text-xs text-gray-500 mt-0.5">{desc}</p>}
    </Link>
  )
}

function TeamMembersCard({ teamId, leaderId }: { teamId: number; leaderId?: number }) {
  const { data: members = [] } = useQuery({
    queryKey: ['team-members', teamId],
    queryFn: () => teamsApi.getMembers(teamId),
  })

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-blue-500" /> Team Members ({members.length}/4)
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {members.map((m) => (
          <div key={m.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0">
              {(m.name ?? 'U').slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-900 truncate">{m.name ?? `User #${m.user_id}`}</p>
                {m.user_id === leaderId && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full shrink-0">Leader</span>
                )}
              </div>
              <p className="text-xs text-gray-500 truncate">{m.email ?? ''}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SubmissionCard({ submission }: { submission: Submission }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <CheckCircle className="w-5 h-5 text-green-500" /> Your Submission
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500 mb-1">GitHub Repository</p>
          <a href={submission.github_link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all">{submission.github_link}</a>
        </div>
        {submission.live_link && (
          <div>
            <p className="text-gray-500 mb-1">Live Demo</p>
            <a href={submission.live_link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all">{submission.live_link}</a>
          </div>
        )}
        <div>
          <p className="text-gray-500 mb-1">Tech Stack</p>
          <p className="text-gray-800">{submission.tech_stack}</p>
        </div>
        <div>
          <p className="text-gray-500 mb-1">Submitted</p>
          <p className="text-gray-800">{submission.submitted_at ? new Date(submission.submitted_at).toLocaleString() : '—'}</p>
        </div>
      </div>
    </div>
  )
}

function Countdown({ endTime }: { endTime: string }) {
  const [timeLeft, setTimeLeft] = useState(calcTimeLeft(endTime))

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(calcTimeLeft(endTime)), 1000)
    return () => clearInterval(t)
  }, [endTime])

  const segments = [
    { label: 'Days', value: timeLeft.days, gradient: 'from-red-500 to-pink-600' },
    { label: 'Hours', value: timeLeft.hours, gradient: 'from-orange-500 to-red-600' },
    { label: 'Minutes', value: timeLeft.minutes, gradient: 'from-yellow-500 to-orange-600' },
    { label: 'Seconds', value: timeLeft.seconds, gradient: 'from-green-500 to-yellow-600' },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-red-500" /> Submission Deadline
        </h3>
        <span className="text-sm text-gray-500">{new Date(endTime).toLocaleString()}</span>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {segments.map(({ label, value, gradient }) => (
          <div key={label} className={`rounded-2xl p-4 text-center text-white bg-gradient-to-br ${gradient}`}>
            <div className="text-3xl font-bold">{String(value).padStart(2, '0')}</div>
            <div className="text-xs opacity-90">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function QuickLinks(_: { myTeam: Team | undefined | null; isLeader: boolean }) {
  const links = [
    { to: '/participant/rankings', label: '🏆 Rankings' },
    { to: '/participant/announcements', label: '📢 Announcements' },
    { to: '/participant/invitations', label: '✉️ Invitations' },
    { to: '/participant/support', label: '💬 Support' },
    { to: '/participant/change-password', label: '🔑 Change Password' },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h3 className="font-bold text-gray-900 mb-3">Quick Links</h3>
      <div className="space-y-1">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

function calcTimeLeft(endTime: string) {
  const diff = Math.max(0, new Date(endTime).getTime() - Date.now())
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

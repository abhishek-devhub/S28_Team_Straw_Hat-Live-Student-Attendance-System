import { useEffect, useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  LogOut, User, CalendarCheck, CalendarX, TrendingUp, Clock, CheckCircle2,
  XCircle, BarChart3, GraduationCap, Calendar, ChevronRight, Award, Activity,
  BookOpen
} from 'lucide-react'
import toast from 'react-hot-toast'
import { getStudentAttendance } from '../api'

const API_BASE = 'http://localhost:5000'

export default function StudentDashboard() {
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [attendance, setAttendance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const stored = localStorage.getItem('student')
    if (!stored) {
      navigate('/student-login')
      return
    }
    const parsed = JSON.parse(stored)
    setStudent(parsed)

    const loadAttendance = async () => {
      try {
        const res = await getStudentAttendance(parsed.id)
        setAttendance(res.data)
      } catch {
        toast.error('Failed to load attendance data')
      } finally {
        setLoading(false)
      }
    }
    loadAttendance()
  }, [navigate])

  const logout = () => {
    localStorage.removeItem('student')
    toast.success('Logged out successfully')
    navigate('/')
  }

  const stats = useMemo(() => {
    if (!attendance) return null
    return {
      total: attendance.total_sessions,
      present: attendance.present_count,
      absent: attendance.absent_count,
      percentage: attendance.attendance_percentage,
    }
  }, [attendance])

  const streakInfo = useMemo(() => {
    if (!attendance?.records?.length) return { current: 0, best: 0 }
    let current = 0
    let best = 0
    let temp = 0
    // records are sorted newest first
    for (const r of attendance.records) {
      if (r.status === 'present') {
        temp++
        if (temp > best) best = temp
      } else {
        temp = 0
      }
    }
    // current streak from most recent
    for (const r of attendance.records) {
      if (r.status === 'present') current++
      else break
    }
    return { current, best }
  }, [attendance])

  const percentageColor = (pct) => {
    if (pct >= 75) return 'text-emerald-400'
    if (pct >= 50) return 'text-amber-400'
    return 'text-red-400'
  }

  const percentageRingColor = (pct) => {
    if (pct >= 75) return 'stroke-emerald-500'
    if (pct >= 50) return 'stroke-amber-500'
    return 'stroke-red-500'
  }

  const percentageBg = (pct) => {
    if (pct >= 75) return 'from-emerald-500/20 to-emerald-500/5'
    if (pct >= 50) return 'from-amber-500/20 to-amber-500/5'
    return 'from-red-500/20 to-red-500/5'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-white/50 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!student) return null

  const registrationDate = student.registered_at
    ? new Date(student.registered_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'N/A'

  const photoUrl = student.photo_path
    ? `${API_BASE}/static/${student.photo_path}`
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950">
      {/* ─── Top Navigation Bar ─── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/70 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <GraduationCap size={20} className="text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-lg hidden sm:block">AttendanceIQ</span>
              <span className="text-white font-bold text-lg sm:hidden">AIQ</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08]">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/60 text-xs">Online</span>
            </div>
            <div className="flex items-center gap-3">
              {photoUrl ? (
                <img src={photoUrl} alt={student.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-white/10" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{student.name?.charAt(0)}</span>
                </div>
              )}
              <span className="text-white/80 text-sm font-medium hidden md:block">{student.name}</span>
            </div>
            <button onClick={logout} className="p-2 rounded-lg hover:bg-white/[0.06] text-white/50 hover:text-white transition-all" title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ─── Welcome Banner ─── */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 border border-white/[0.08] p-6 sm:p-8 mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <p className="text-white/40 text-sm mb-1">Welcome back,</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{student.name} 👋</h1>
            <p className="text-white/50 text-sm max-w-xl">
              Track your attendance, monitor your performance, and stay on top of your academic progress. Keep attending regularly to maintain a great record!
            </p>
          </div>
        </div>

        {/* ─── Quick Stats ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={CalendarCheck}
            label="Total Sessions"
            value={stats?.total ?? 0}
            color="blue"
          />
          <StatCard
            icon={CheckCircle2}
            label="Present"
            value={stats?.present ?? 0}
            color="emerald"
          />
          <StatCard
            icon={CalendarX}
            label="Absent"
            value={stats?.absent ?? 0}
            color="red"
          />
          <StatCard
            icon={Award}
            label="Current Streak"
            value={`${streakInfo.current} days`}
            color="amber"
          />
        </div>

        {/* ─── Tabs ─── */}
        <div className="flex gap-1 mb-6 bg-white/[0.04] p-1 rounded-xl border border-white/[0.06] w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'history', label: 'History', icon: Clock },
            { id: 'profile', label: 'Profile', icon: User },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white/[0.1] text-white shadow-sm'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* ─── Tab Content ─── */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Attendance Ring */}
            <div className="lg:col-span-1">
              <div className="backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6">
                <h3 className="text-white/60 text-sm font-medium mb-6">Attendance Rate</h3>
                <div className="flex flex-col items-center">
                  <div className="relative w-44 h-44">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                      <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="10" className="text-white/[0.06]" />
                      <circle
                        cx="80" cy="80" r="70" fill="none" strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 70}`}
                        strokeDashoffset={`${2 * Math.PI * 70 * (1 - (stats?.percentage ?? 0) / 100)}`}
                        className={`${percentageRingColor(stats?.percentage ?? 0)} transition-all duration-1000`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-4xl font-bold ${percentageColor(stats?.percentage ?? 0)}`}>
                        {stats?.percentage ?? 0}%
                      </span>
                      <span className="text-white/40 text-xs mt-1">attendance</span>
                    </div>
                  </div>

                  <div className="mt-6 w-full space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="text-white/50">Present</span>
                      </div>
                      <span className="text-white font-medium">{stats?.present ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <span className="text-white/50">Absent</span>
                      </div>
                      <span className="text-white font-medium">{stats?.absent ?? 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance & Insights */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Banner */}
              <div className={`rounded-2xl p-5 bg-gradient-to-r ${percentageBg(stats?.percentage ?? 0)} border border-white/[0.08]`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${(stats?.percentage ?? 0) >= 75 ? 'bg-emerald-500/20' : (stats?.percentage ?? 0) >= 50 ? 'bg-amber-500/20' : 'bg-red-500/20'}`}>
                    <TrendingUp size={24} className={percentageColor(stats?.percentage ?? 0)} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">
                      {(stats?.percentage ?? 0) >= 75 ? 'Great Performance! 🎉' : (stats?.percentage ?? 0) >= 50 ? 'Needs Improvement ⚠️' : 'Critical Attendance! 🚨'}
                    </h3>
                    <p className="text-white/50 text-sm">
                      {(stats?.percentage ?? 0) >= 75
                        ? 'You\'re maintaining excellent attendance. Keep up the great work!'
                        : (stats?.percentage ?? 0) >= 50
                        ? 'Your attendance is below the recommended 75%. Try to attend more classes.'
                        : stats?.total === 0
                        ? 'No attendance sessions yet. Your records will appear here once your teacher takes attendance.'
                        : 'Your attendance is critically low. Please attend classes regularly to avoid academic issues.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                <MetricCard
                  icon={Activity}
                  label="Best Streak"
                  value={`${streakInfo.best} sessions`}
                  description="Consecutive days present"
                />
                <MetricCard
                  icon={BookOpen}
                  label="Total Classes"
                  value={stats?.total ?? 0}
                  description="Sessions conducted so far"
                />
              </div>

              {/* Recent Activity */}
              <div className="backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white/60 text-sm font-medium">Recent Activity</h3>
                  <button onClick={() => setActiveTab('history')} className="text-blue-400 text-xs hover:text-blue-300 transition-colors flex items-center gap-1">
                    View All <ChevronRight size={14} />
                  </button>
                </div>
                <div className="space-y-3">
                  {(!attendance?.records?.length) ? (
                    <div className="text-center py-8">
                      <Calendar size={32} className="text-white/20 mx-auto mb-3" />
                      <p className="text-white/30 text-sm">No attendance records yet</p>
                    </div>
                  ) : (
                    attendance.records.slice(0, 5).map((record, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-white/[0.03] transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${record.status === 'present' ? 'bg-emerald-500/15' : 'bg-red-500/15'}`}>
                            {record.status === 'present'
                              ? <CheckCircle2 size={16} className="text-emerald-400" />
                              : <XCircle size={16} className="text-red-400" />
                            }
                          </div>
                          <div>
                            <p className="text-white/80 text-sm font-medium">
                              {new Date(record.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </p>
                            <p className="text-white/30 text-xs">
                              {new Date(record.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          record.status === 'present'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-red-500/15 text-red-400'
                        }`}>
                          {record.status === 'present' ? 'Present' : 'Absent'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/[0.06]">
              <h3 className="text-white font-semibold">Full Attendance History</h3>
              <p className="text-white/40 text-sm mt-1">Your complete attendance record across all sessions</p>
            </div> 

            {(!attendance?.records?.length) ? (
              <div className="text-center py-16">
                <Calendar size={48} className="text-white/15 mx-auto mb-4" />
                <p className="text-white/30 text-sm mb-1">No attendance records yet</p>
                <p className="text-white/20 text-xs">Records will appear once your teacher takes attendance.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-white/[0.06]">
                      <th className="px-6 py-3.5 text-white/40 font-medium text-xs uppercase tracking-wider">#</th>
                      <th className="px-6 py-3.5 text-white/40 font-medium text-xs uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3.5 text-white/40 font-medium text-xs uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3.5 text-white/40 font-medium text-xs uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3.5 text-white/40 font-medium text-xs uppercase tracking-wider">Class Present</th>
                      <th className="px-6 py-3.5 text-white/40 font-medium text-xs uppercase tracking-wider">Class Absent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.records.map((record, idx) => (
                      <tr key={idx} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 text-white/30 font-mono text-xs">{idx + 1}</td>
                        <td className="px-6 py-4 text-white/80 font-medium">
                          {new Date(record.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 text-white/50">
                          {new Date(record.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
                            record.status === 'present'
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : 'bg-red-500/15 text-red-400'
                          }`}>
                            {record.status === 'present'
                              ? <CheckCircle2 size={12} />
                              : <XCircle size={12} />
                            }
                            {record.status === 'present' ? 'Present' : 'Absent'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-white/50">{record.total_present}</td>
                        <td className="px-6 py-4 text-white/50">{record.total_absent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 text-center">
                {photoUrl ? (
                  <img src={photoUrl} alt={student.name} className="w-24 h-24 rounded-2xl object-cover mx-auto ring-4 ring-white/[0.08] shadow-xl" />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mx-auto flex items-center justify-center shadow-xl">
                    <span className="text-white text-3xl font-bold">{student.name?.charAt(0)}</span>
                  </div>
                )}
                <h2 className="text-white text-xl font-bold mt-4">{student.name}</h2>
                <p className="text-white/40 text-sm mt-1">{student.roll_number}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Active Student
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-5">Profile Information</h3>
                <div className="space-y-4">
                  <ProfileRow label="Full Name" value={student.name} />
                  <ProfileRow label="Email Address" value={student.email} />
                  <ProfileRow label="Roll Number" value={student.roll_number} />
                  <ProfileRow label="Registered On" value={registrationDate} />
                  <ProfileRow label="Photos Uploaded" value={`${student.photo_count ?? 1} / 5`} />
                </div>
              </div>

              {/* Registration Photos */}
              {student.registration_photos?.length > 0 && (
                <div className="backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6">
                  <h3 className="text-white font-semibold mb-4">Registration Photos</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {student.registration_photos.map((p, i) => (
                      <img
                        key={i}
                        src={`${API_BASE}/static/${p}`}
                        alt={`Photo ${i + 1}`}
                        className="w-full aspect-square object-cover rounded-xl ring-1 ring-white/[0.08] hover:ring-blue-500/40 transition-all hover:scale-105"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-white/[0.06] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs">© 2026 Live Student Attendance System — Team Straw Hat</p>
          <p className="text-white/20 text-xs">Powered by Face Recognition Technology</p>
        </div>
      </footer>
    </div>
  )
}


/* ─── Sub-Components ─── */

function StatCard({ icon: Icon, label, value, color }) {
  const colorMap = {
    blue: 'from-blue-500/20 to-blue-500/5 text-blue-400 bg-blue-500/15',
    emerald: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400 bg-emerald-500/15',
    red: 'from-red-500/20 to-red-500/5 text-red-400 bg-red-500/15',
    amber: 'from-amber-500/20 to-amber-500/5 text-amber-400 bg-amber-500/15',
  }
  const c = colorMap[color] || colorMap.blue
  const [gradient, text, iconBg] = [
    c.split(' ').slice(0, 2).join(' '),
    c.split(' ')[2],
    c.split(' ').slice(3).join(' '),
  ]

  return (
    <div className={`backdrop-blur-xl bg-gradient-to-br ${gradient} border border-white/[0.08] rounded-2xl p-5`}>
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center mb-3`}>
        <Icon size={20} className={text} />
      </div>
      <p className="text-white/40 text-xs font-medium mb-1">{label}</p>
      <p className="text-white text-xl font-bold">{value}</p>
    </div>
  )
}

function MetricCard({ icon: Icon, label, value, description }) {
  return (
    <div className="backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-blue-500/15 flex items-center justify-center">
          <Icon size={18} className="text-blue-400" />
        </div>
        <p className="text-white/40 text-sm font-medium">{label}</p>
      </div>
      <p className="text-white text-2xl font-bold">{value}</p>
      <p className="text-white/30 text-xs mt-1">{description}</p>
    </div>
  )
}

function ProfileRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-white/[0.05] last:border-0">
      <span className="text-white/40 text-sm">{label}</span>
      <span className="text-white font-medium text-sm mt-1 sm:mt-0">{value}</span>
    </div>
  )
}

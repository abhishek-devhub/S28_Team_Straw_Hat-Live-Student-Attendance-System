import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FileDown, Camera, CheckCircle2, XCircle, Users } from 'lucide-react'
import AttendanceBadge from '../components/AttendanceBadge'
import { exportSessionCsvUrl, getSession } from '../api'

const API_BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000'

export default function Results() {
  const { sessionId } = useParams()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getSession(sessionId)
        setSession(res.data)
      } catch {
        toast.error('Could not load session')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [sessionId])

  const summary = useMemo(() => {
    if (!session) return { present: 0, unknown: 0, absent: 0 }
    return {
      present: (session.results || []).filter((r) => r.status === 'present').length,
      unknown: (session.results || []).filter((r) => r.status === 'unknown').length,
      absent: (session.absent_students || []).length,
    }
  }, [session])

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  )
  if (!session) return (
    <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
      <XCircle size={48} className="mx-auto text-slate-300 mb-4" />
      <p className="text-slate-500 font-medium">No session found on the server.</p>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Attendance Scan Results</h1>
          <p className="text-slate-500 mt-1">Processed on {new Date(session.timestamp).toLocaleString()}</p>
        </div>
        <div className="flex gap-3">
          <a 
            href={exportSessionCsvUrl(sessionId)} 
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          >
            <FileDown size={18} /> Export CSV
          </a>
          <Link 
            to="/take-attendance" 
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <Camera size={18} /> New Scan
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Users size={18} className="text-indigo-600" /> Session Summary
            </h3>
            <div className="space-y-4">
              <SummaryItem label="Present" count={summary.present} color="text-emerald-600 bg-emerald-50" icon={CheckCircle2} />
              <SummaryItem label="Absent" count={summary.absent} color="text-rose-600 bg-rose-50" icon={XCircle} />
              <SummaryItem label="Unknown" count={summary.unknown} color="text-slate-400 bg-slate-50" icon={Users} />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
             <h3 className="font-bold text-slate-800 mb-4 px-2">Processed Image</h3>
             <img 
               src={`${API_BASE}${session.annotated_image_url}`} 
               alt="annotated classroom scan" 
               className="w-full rounded-2xl border border-slate-50 hover:scale-[1.02] transition-transform duration-500 cursor-zoom-in" 
             />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Student Name</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {(session.results || []).map((row, idx) => (
                    <tr key={`res-${idx}`} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800">{row.name}</td>
                      <td className="px-6 py-4"><AttendanceBadge status={row.status} /></td>
                    </tr>
                  ))}
                  {(session.absent_students || []).map((s, idx) => (
                    <tr key={`abs-${s.student_id || idx}`} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800">{s.name}</td>
                      <td className="px-6 py-4"><AttendanceBadge status="absent" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryItem({ label, count, color, icon: Icon }) {
  return (
    <div className={`p-4 rounded-2xl flex items-center justify-between ${color}`}>
      <div className="flex items-center gap-3">
        <Icon size={18} />
        <span className="font-bold">{label}</span>
      </div>
      <span className="text-xl font-extrabold">{count}</span>
    </div>
  )
}

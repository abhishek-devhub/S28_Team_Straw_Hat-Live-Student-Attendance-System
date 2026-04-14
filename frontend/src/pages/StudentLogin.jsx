import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { studentLogin } from '../api'

export default function StudentLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!email.endsWith('@slrtce.in')) {
      return toast.error('Please use your @slrtce.in email')
    }

    try {
      setLoading(true)
      const res = await studentLogin(email)
      if (res.data.success) {
        localStorage.setItem('student', JSON.stringify(res.data.student))
        toast.success(`Welcome back, ${res.data.student.name}!`)
        navigate('/student-dashboard')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Are you registered?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950">
      {/* Animated background orbs */}
      <div className="absolute top-[-120px] left-[-80px] w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-100px] right-[-60px] w-[350px] h-[350px] bg-indigo-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Back link */}
        <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back to Home</span>
        </Link>

        {/* Login card */}
        <div className="backdrop-blur-xl bg-white/[0.07] border border-white/[0.12] rounded-3xl p-8 shadow-2xl shadow-black/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 mb-4">
              <ShieldCheck size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Student Login</h1>
            <p className="text-white/50 text-sm">Access your attendance dashboard</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">College Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  placeholder="yourname@slrtce.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  pattern=".*@slrtce\.in$"
                  title="Please use your @slrtce.in email address"
                  className="w-full pl-12 pr-4 py-3.5 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Access Dashboard
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-white/[0.08] text-center">
            <p className="text-white/40 text-sm">
              Not registered yet?{' '}
              <Link to="/register/student" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* Trust badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-white/30 text-xs">
          <ShieldCheck size={14} />
          <span>Secured by Face Recognition Technology</span>
        </div>
      </div>
    </div>
  )
}

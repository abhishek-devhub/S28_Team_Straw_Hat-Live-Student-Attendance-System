import { useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { 
  CheckCircle2, 
  XCircle, 
  X, 
  Camera, 
  ArrowLeft,
  Info
} from 'lucide-react'
import toast from 'react-hot-toast'
import { registerStudent, validateStudentPhoto } from '../api'

const MAX_PHOTOS = 5

export default function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [rollNumber, setRollNumber] = useState('')
  const [slots, setSlots] = useState(Array.from({ length: MAX_PHOTOS }, () => ({ file: null, preview: '', status: 'idle', error: '' })))
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const selectedCount = useMemo(() => slots.filter((s) => s.file).length, [slots])

  const validatePhoto = async (file, index) => {
    const formData = new FormData()
    formData.append('photo', file)

    setSlots((prev) => prev.map((slot, i) => (i === index ? { ...slot, status: 'validating', error: '' } : slot)))

    try {
      await validateStudentPhoto(formData)
      setSlots((prev) => prev.map((slot, i) => (i === index ? { ...slot, status: 'valid' } : slot)))
    } catch (err) {
      setSlots((prev) => prev.map((slot, i) => (i === index ? { ...slot, status: 'invalid', error: err.response?.data?.message || 'Validation failed' } : slot)))
    }
  }

  const assignPhotoToSlot = async (index, file) => {
    if (!file) return
    const previewUrl = URL.createObjectURL(file)
    setSlots((prev) => prev.map((slot, i) => {
      if (i === index) {
        if (slot.preview) URL.revokeObjectURL(slot.preview)
        return { file, preview: previewUrl, status: 'idle', error: '' }
      }
      return slot
    }))
    await validatePhoto(file, index)
  }

  const removeSlotPhoto = (index) => {
    setSlots((prev) => prev.map((slot, i) => {
      if (i === index) {
        if (slot.preview) URL.revokeObjectURL(slot.preview)
        return { file: null, preview: '', status: 'idle', error: '' }
      }
      return slot
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    const files = slots.filter((s) => s.file).map((s) => s.file)
    if (files.length === 0) return toast.error('Please add at least one photo')

    const invalid = slots.some((s) => s.file && s.status === 'invalid')
    if (invalid) return toast.error('Please fix invalid photos before submitting')

    if (!email.endsWith('@slrtce.in')) {
      return toast.error('Only @slrtce.in emails are allowed')
    }

    const formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    formData.append('roll_number', rollNumber)
    files.forEach((file) => formData.append('photos[]', file))

    let timer;
    try {
      setLoading(true)
      setProgress(15)
      timer = setInterval(() => setProgress((p) => Math.min(p + 10, 90)), 250)
      const res = await registerStudent(formData)
      clearInterval(timer)
      setProgress(100)
      
      const studentData = {
        id: res?.data?.student_id,
        name,
        email,
        roll_number: rollNumber,
        photo_count: res?.data?.photo_count || files.length,
        photo_path: res?.data?.photo_path,
        registration_photos: res?.data?.registration_photos || [],
        registered_at: new Date().toISOString(),
      }
      localStorage.setItem('student', JSON.stringify(studentData))
      toast.success('Registration successful!')
      navigate('/student-dashboard')
    } catch (err) {
      if (timer) clearInterval(timer)
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
      setTimeout(() => setProgress(0), 400)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Home</span>
          </Link>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-slate-900">Student Registration</h1>
            <p className="text-sm text-slate-500">Attendance Portal</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <form onSubmit={onSubmit} className="p-8 space-y-8">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-800 border-b pb-2">Profile Details</h2>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input 
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                    placeholder="Enter your full name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">College Email Address</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                    placeholder="example@slrtce.in" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    pattern=".*@slrtce\.in$" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Roll Number</label>
                  <input 
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                    placeholder="e.g. 21CS045" 
                    value={rollNumber} 
                    onChange={(e) => setRollNumber(e.target.value)} 
                    required 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h2 className="text-lg font-semibold text-slate-800">Face Enrollment</h2>
                <span className="text-xs font-bold text-slate-400">{selectedCount} / {MAX_PHOTOS} Added</span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {slots.map((slot, index) => (
                  <div key={index} className="aspect-square rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center relative overflow-hidden group">
                    {!slot.file ? (
                      <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center gap-1">
                        <Camera size={20} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Add</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => assignPhotoToSlot(index, e.target.files?.[0])}
                        />
                      </label>
                    ) : (
                      <div className="w-full h-full flex flex-col">
                        <img src={slot.preview} alt={`slot-${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeSlotPhoto(index)}
                          className="absolute top-1 right-1 p-1 bg-white shadow-sm border rounded-full text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <X size={12} />
                        </button>
                        <div className={`absolute bottom-0 inset-x-0 h-1 ${slot.status === 'valid' ? 'bg-green-500' : slot.status === 'invalid' ? 'bg-red-500' : 'bg-slate-300'}`} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
              <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-700 leading-relaxed">
                <p className="font-bold mb-1 uppercase tracking-wider text-blue-800">Registration Requirement</p>
                Provide at least one clear photo of your face. For best accuracy under different lighting, we recommend filling all 5 slots from various angles.
              </div>
            </div>

            <div className="pt-4">
              {loading && (
                <div className="mb-6">
                  <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                    <div className="bg-indigo-600 h-1 transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}

              <button 
                disabled={loading} 
                className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 active:bg-indigo-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-100"
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </button>
              
              <p className="text-center mt-6 text-sm text-slate-500">
                Already have an account? <Link to="/student-login" className="text-indigo-600 font-semibold hover:underline">Sign in</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Camera, Upload, XCircle, Scan, CheckCircle2 } from 'lucide-react'
import { takeAttendance } from '../api'

export default function TakeAttendance() {
  const navigate = useNavigate()
  const [photo, setPhoto] = useState(null)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (preview) URL.revokeObjectURL(preview)
      setPhoto(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const submit = async () => {
    if (!photo) return toast.error('Please select a group photo')

    const formData = new FormData()
    formData.append('group_photo', photo)

    try {
      setLoading(true)
      const res = await takeAttendance(formData)
      toast.success('Attendance completed')
      
      if (preview) URL.revokeObjectURL(preview)
      navigate(`/results/${res.data.session_id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Attendance failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Take Daily Attendance</h1>
        <p className="text-slate-500">Upload a group photo or classroom capture to identify all students automatically.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-8 md:p-12">
          {!preview ? (
            <label className="group block relative cursor-pointer">
              <input type="file" className="hidden" accept="image/*" onChange={handleFile} />
              <div className="border-3 border-dashed border-slate-200 rounded-3xl p-16 flex flex-col items-center justify-center gap-4 bg-slate-50 group-hover:bg-indigo-50/50 group-hover:border-indigo-200 transition-all duration-300">
                <div className="p-5 bg-white rounded-2xl shadow-sm text-indigo-600 group-hover:scale-110 transition-transform duration-300">
                  <Camera size={40} />
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-slate-800">Choose Group Photo</p>
                  <p className="text-slate-500 mt-1">Drag and drop or click to browse files</p>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  <Scan size={14} /> AI Face Detection Enabled
                </div>
              </div>
            </label>
          ) : (
            <div className="space-y-6">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video max-h-[500px] flex items-center justify-center">
                <img src={preview} alt="group preview" className="max-h-full object-contain" />
                <button 
                  onClick={() => {
                    URL.revokeObjectURL(preview);
                    setPreview('');
                    setPhoto(null);
                  }} 
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur shadow-sm p-2 rounded-xl text-slate-600 hover:text-red-600 transition-colors"
                  title="Remove Photo"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{photo.name}</p>
                    <p className="text-xs text-slate-500">{(photo.size / 1024 / 1024).toFixed(2)} MB • Ready for scan</p>
                  </div>
                </div>
                <button 
                  onClick={submit} 
                  disabled={loading} 
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      Scanning Classroom...
                    </>
                  ) : (
                    <>
                      <Upload size={20} />
                      Verify Attendance
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        <FeatureItem 
          title="Fast Detection" 
          desc="Identifies entire classroom in less than 5 seconds."
        />
        <FeatureItem 
          title="Multi-Face Scan" 
          desc="Supports detection of 50+ students in one frame."
        />
        <FeatureItem 
          title="Cloud Backup" 
          desc="All sessions are instantly synced and archived."
        />
      </div>
    </div>
  )
}

function FeatureItem({ title, desc }) {
  return (
    <div className="p-4 bg-white/50 backdrop-blur rounded-2xl border border-slate-100 shadow-sm">
      <h3 className="font-bold text-slate-800 text-sm mb-1">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
  )
}

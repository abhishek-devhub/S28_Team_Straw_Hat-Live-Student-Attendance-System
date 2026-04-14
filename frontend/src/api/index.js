import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

export const registerStudent = (formData) => api.post('/students/register', formData)
export const registerTeacher = (data) => api.post('/teachers/register', data)
export const teacherLogin = (data) => api.post('/teachers/login', data)
export const validateStudentPhoto = (formData) => api.post('/students/validate', formData)
export const getStudents = (params = {}) => api.get('/students', { params })
export const getStudent = (id) => api.get(`/students/${id}`)
export const updateStudentProfile = (id, data) => api.put(`/students/${id}`, data)
export const deleteStudent = (id) => api.delete(`/students/${id}`)
export const addStudentPhotos = (studentId, formData) => api.post(`/students/${studentId}/add-photos`, formData)
export const getStudentAttendanceStats = (params = {}) => api.get(`/students/attendance-stats`, { params })

export const takeAttendance = (formData) => api.post('/attendance/take', formData)
export const getSessions = (params = {}) => api.get('/attendance/sessions', { params })

export const getSchedules = () => api.get('/schedules')
export const createSchedule = (data) => api.post('/schedules', data)
export const updateSchedule = (id, data) => api.put(`/schedules/${id}`, data)
export const deleteSchedule = (id) => api.delete(`/schedules/${id}`)
export const getLeaderboard = () => api.get('/gamification/leaderboard')
export const getStudentGamification = (id) => api.get(`/students/${id}/gamification`)
export const getEscalationAlerts = (params = {}) => api.get('/alerts/escalation', { params })

export const getSession = (sessionId) => api.get(`/attendance/session/${sessionId}`)
export const exportSessionCsvUrl = (sessionId) => `${api.defaults.baseURL}/attendance/export/${sessionId}`

export const studentLogin = (email) => api.post('/students/login', { email })
export const getStudentAttendance = (studentId) => api.get(`/students/${studentId}/attendance`)

export default api

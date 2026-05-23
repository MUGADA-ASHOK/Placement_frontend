import api from './axiosInstance'

// ─────────────────────────────────────────────────────────────────
// Auth — /api/auth/*
// ─────────────────────────────────────────────────────────────────
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),

  registerStudent: (data) => api.post('/auth/register/student', data),
  registerAdmin: (data) => api.post('/auth/register/admin', data),
  registerCompany: (data) => api.post('/auth/register/company', data),
}

// ─────────────────────────────────────────────────────────────────
// Admin — /api/admin/*
// ─────────────────────────────────────────────────────────────────
export const adminApi = {
  // STUDENTS
  getAllStudents: (page = 0, size = 15) =>
    api.get('/admin/allStudents', { params: { page, size } }),

  getAllStudentProfiles: (page = 0, size = 15) =>
    api.get('/admin/allStudentProfiles', { params: { page, size } }),

  getStudentProfile: (rollNo) =>
    api.get(`/admin/student/${rollNo}/profile`),

  // COMPANIES
  getAllCompanies: (page = 0, size = 15) =>
    api.get('/admin/allCompanies', { params: { page, size } }),

  // DRIVES
  getCompanyDrives: (companyId, page = 0, size = 15) =>
    api.get(`/admin/company/${companyId}/drives`, { params: { page, size } }),

  getAllActiveDrives: (page = 0, size = 15) =>
    api.get('/admin/getAllActiveDrives', { params: { page, size } }),

  addDrive: (data) =>
    api.post('/admin/company/addDrive', data),

  publishDrive: (driveId) =>
    api.put(`/admin/publishDrives/${driveId}`),

  isDrivePublished: (driveId) =>
    api.get(`/admin/isDrivePublished/${driveId}`),

  closeDrive: (driveId) =>
    api.put(`/admin/closeDrive/${driveId}`),

  deleteDrive: (driveId) =>
    api.delete(`/admin/deleteDrive/${driveId}`),

  extendDrive: (driveId, date) =>
    api.put(`/admin/extendDrive/${driveId}/${date}`),

  // APPLICATIONS
  getApplications: (driveId, page = 0, size = 15) =>
    api.get(`/admin/getAllApplications/${driveId}`, { params: { page, size } }),

  getStudentApplications: (rollNo, page = 0, size = 15) =>
    api.get(`/admin/student/allApplications/${rollNo}`, { params: { page, size } }),

  // ROUNDS
  getDriveRounds: (driveId, page = 0, size = 15) =>
    api.get(`/admin/getAllDriveRounds/${driveId}`, { params: { page, size } }),

  getApplicantsForRound: (driveId, roundNo, page = 0, size = 15) =>
    api.get(`/admin/getApplicantsForDriveRound/${driveId}/${roundNo}`, { params: { page, size } }),

  // ELIGIBILITY
  addEligibility: (data) =>
    api.post('/admin/company/addDriveEligibility', data),

  updateEligibility: (driveId, data) =>
    api.put(`/admin/updateDriveEligibility/${driveId}`, data),

  // RESUME
  viewStudentResume: (rollNo) =>
    api.get(`/admin/student/${rollNo}/viewResume`, { responseType: 'blob' }),

  // COUNTS
  countStudents: () => api.get('/admin/students/count'),
  countCompanies: () => api.get('/admin/companies/count'),
  countActiveDrives: () => api.get('/admin/activeDrives/count'),
  countAdmins: () => api.get('/admin/admins/count'),
}

// ─────────────────────────────────────────────────────────────────
// Company — /api/company/*
// ─────────────────────────────────────────────────────────────────
export const companyApi = {
  getAllDrives: (page = 0, size = 15) =>
    api.get('/company/getAllDrives', { params: { page, size } }),

  getRounds: (driveId, page = 0, size = 15) =>
    api.get(`/company/getRounds/${driveId}`, { params: { page, size } }),

  getAllApplications: (driveId, page = 0, size = 15) =>
    api.get(`/company/allApplications/${driveId}`, { params: { page, size } }),

  getApplicationsByRound: (driveId, roundNo, page = 0, size = 15) =>
    api.get(`/company/allApplications/${driveId}/${roundNo}`, { params: { page, size } }),

  publishRound: (driveId, data) =>
    api.post(`/company/publishDriveRound/${driveId}`, data),

  publishScore: (driveId, rollNo, roundNo, score) =>
    api.post(`/company/publishScore/${driveId}/${rollNo}/${roundNo}/${score}`),

  publishFeedback: (driveId, rollNo, roundNo, feedback) =>
    api.post(`/company/publishFeedback/${driveId}/${rollNo}/${roundNo}`, { feedback }),

  filterTopK: (driveId, roundNo, topK) =>
    api.post(`/company/filterByTopK/${driveId}/${roundNo}/${topK}`),

  filterByCutoff: (driveId, roundNo, cutoff) =>
    api.post(`/company/filterByCutOff/${driveId}/${roundNo}/${cutoff}`),

  countByCutoff: (driveId, roundNo, cutoff) =>
    api.get(`/company/countFilterByCutOff/${driveId}/${roundNo}/${cutoff}`),

  viewStudentResume: (rollNo) =>
    api.get(`/company/viewResume/${rollNo}`, { responseType: 'blob' }),

  closeDrive: (driveId) =>
    api.put(`/company/closeDrive/${driveId}`),

  // ✅ FIXED (lowercase drives)
  countActiveDrives: () =>
    api.get('/company/activeDrives/count'),

  countDrives: () =>
    api.get('/company/drives/count'),
}

// ─────────────────────────────────────────────────────────────────
// Super Admin — /api/super-admin/*
// ─────────────────────────────────────────────────────────────────
export const superAdminApi = {
  getAllAdmins: (page = 0, size = 15) =>
    api.get('/super-admin/allAdmins', { params: { page, size } }),
  deleteAdmin: (id) => api.delete(`/super-admin/delete-admin/${id}`),
}

// ─────────────────────────────────────────────────────────────────
// Student — /api/student/*
// ─────────────────────────────────────────────────────────────────
export const studentApi = {
  getProfile: () =>
    api.get('/student/profile'),

  addProfile: (data) =>
    api.post('/student/profile/add', data),

  updateProfile: (data) =>
    api.put('/student/profile/update', data),

  getApplications: (page = 0, size = 15) =>
    api.get('/student/profile/allApplications', { params: { page, size } }),

  getEligibleDrives: (page = 0, size = 15) =>
    api.get('/student/profile/allEligibleApplications', { params: { page, size } }),

  applyDrive: (driveId) =>
    api.put(`/student/profile/applyDrive/${driveId}`),

  getRoundsForDrive: (driveId) =>
    api.get(`/student/profile/allRounds/${driveId}`),

  uploadResume: (formData) =>
    api.post('/student/profile/uploadResume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // ✅ FIXED PATH
  viewStudentResume: () =>
    api.get('/student/profile/viewResume', { responseType: 'blob' }),

  // ✅ ADD (for dashboard counts — IMPORTANT)
  getEligibleDrivesCount: () =>
    api.get('/student/profile/getEligibleDrives'),

  getAppliedDrivesCount: () =>
    api.get('/student/profile/getAppliedDrives'),

  getSelectedDrivesCount: () =>
    api.get('/student/profile/getSelectedDrives'),

  getInProcessDrivesCount: () =>
    api.get('/student/profile/getInProcessDrives'),
}
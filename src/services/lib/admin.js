import fileDownload from 'js-file-download';
import axiosInstance from '../axiosInterceptor';

export function createSemester(file, name, course) {
  return axiosInstance.post(
    '/admin/init-semester',
    {
      file,
      name,
      course,
    },
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
}

export function addUser(name, email, bilkentId, role, semesterId) {
  return axiosInstance.post('/admin/add-user-to-semester/' + semesterId, {
    bilkentId,
    email,
    name,
    role,
  });
}

export function getCourses() {
  return axiosInstance.get('/admin/list-courses');
}

export function getActiveSemesters() {
  return axiosInstance.get('/admin/active-semesters');
}

export function getAllSemesters() {
  return axiosInstance.get('/admin/all-semesters');
}

export function getUsers(username) {
  return axiosInstance.get('/user/search?q=' + username);
}

export async function getExportStatistics(semesterId, filename) {
  return await axiosInstance
    .get(`/admin/export-statistics/${semesterId}`, {
      responseType: 'blob',
    })
    .then((res) => {
      fileDownload(res.data, filename);
    });
}

export async function getExportGrades(semesterId, filename) {
  return await axiosInstance
    .get(`/admin/export-grades/${semesterId}`, {
      responseType: 'blob',
    })
    .then((res) => {
      fileDownload(res.data, filename);
    });
}

export async function deactivateSemester(semesterId) {
  return await axiosInstance.post(`/admin/deactivate-semester/${semesterId}`);
}

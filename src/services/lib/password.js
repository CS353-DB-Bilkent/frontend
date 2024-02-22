import axiosInstance from '../axiosInterceptor';

export function emailPasswordChangeCode(email) {
  return axiosInstance.post('/auth/email-password-change-code', {
    email,
  });
}

export function changePasswordCode(code, newPassword) {
  return axiosInstance.post('/auth/change-password-code', {
    code,
    newPassword,
  });
}

export function changePassword(oldPassword, newPassword) {
  return axiosInstance.post('/auth/change-password', {
    oldPassword,
    newPassword,
  });
}

import axiosInstance from '../axiosInterceptor';

export function createAdmin(data) {
  return axiosInstance.post('/super-admin/create-admin', {
    email: data.email,
    password: data.password,
    name: data.name,
    phone: data.phone,
    birthDate: data.birthDate,
    companyName: data.companyName,
    salary: data.salary,
    iban: data.iban,
  });
}

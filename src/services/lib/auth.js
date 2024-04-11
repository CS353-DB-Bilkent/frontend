import axiosInstance from '../axiosInterceptor';

export function loginUser(email, password) {
  return axiosInstance.post('/auth/login', {
    email: email,
    password: password,
  });
}

export function signUpUser(email, name, password,phone,birthDate) {
  return axiosInstance.post('/auth/register/user', {
    email: email,
    name: name,
    phone: phone,
    password: password,
    birthDate: birthDate,
    companyName: "",
    salary: 0,
    iban: "",
  });
}
export function signUpEventOrganizer(email, name, password,phone,birthDate,companyName,salary,iban) {
  return axiosInstance.post('/auth/register/event-organizer', {
    email: email,
    name: name,
    phone: phone,
    password: password,
    birthDate: birthDate,
    companyName: companyName,
    salary: salary,
    iban: iban,
  });
}

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthContainer } from '../components/auth/AuthContainer';
import { UserLoader } from '../components/auth/UserLoader';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';
import Logout from '../components/Logout';
import { PermissionContainer } from '../components/permission/PermissionContainer';
import Login from '../pages/Login';
import RegisterUser from '../pages/RegisterUser';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import ROLES from '../constants/roles';
import NotFound from '../pages/NotFound';
import ChangePassword from '../pages/ChangePassword';
import DashboardNavigator from '../pages/Home';
import ContactPage from '../pages/ContactPage';
import ErrorPage from '../components/ErrorPage';
import Dashboard from '../pages/Dashboard';
import MainEventsPage from '../pages/MainEventsPage';
import { Navigate } from 'react-router-dom';

export function Router() {
  return <RouterProvider router={router} />;
}

const router = createBrowserRouter([
  {
    path: '*',
    element: <NotFound />,
  },
  {
    path: '', // Navigate to /main
    element: <Navigate to="/main" replace />,
  },
  {
    path: 'login',
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'forgot',
    element: <ForgotPassword />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'reset-password/:code',
    element: <ResetPassword />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'register',
    element: <RegisterUser />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'main',
    element: (
      <div>
        <UserLoader>
          <Header />
          <MainEventsPage />
        </UserLoader>
      </div>
    ),
    errorElement: <ErrorPage />,
  },
  {
    paths: ['/', ''],
    element: (
      <UserLoader>
        <AuthContainer>
          <Header />
          <Outlet />
        </AuthContainer>
      </UserLoader>
    ),
    children: [
      {
        path: '',
        element: <DashboardNavigator />,
      },
      {
        path: 'contact',
        element: <ContactPage />,
      },
      {
        path: 'change-password',
        element: <ChangePassword />,
      },
      {
        path: 'user/',
        element: (
          <PermissionContainer roles={[ROLES.USER]}>
            <Outlet />
          </PermissionContainer>
        ),
        children: [
          {
            path: 'dashboard/',
            element: <Dashboard />,
            errorElement: <Dashboard />,
          },
        ],
      },
      {
        path: 'super-admin/',
        element: (
          <PermissionContainer roles={[ROLES.SUPER_ADMIN]}>
            <Outlet />
          </PermissionContainer>
        ),
        children: [],
      },
      {
        path: 'admin/',
        element: (
          <PermissionContainer roles={[ROLES.ADMIN]}>
            <Outlet />
          </PermissionContainer>
        ),
        children: [],
      },
      {
        path: 'logout',
        element: <Logout />,
      },
    ],
  },
]);

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthContainer } from '../components/auth/AuthContainer';
import { UserLoader } from '../components/auth/UserLoader';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';
import Logout from '../components/Logout';
import { PermissionContainer } from '../components/permission/PermissionContainer';
import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import ROLES from '../constants/roles';
import NotFound from '../pages/NotFound';
import ChangePassword from '../pages/ChangePassword';
import DashboardNavigator from '../pages/Home';
import ContactPage from '../pages/ContactPage';
import ErrorPage from '../components/ErrorPage';
import Dashboard from '../pages/Dashboard';

export function Router() {
  return <RouterProvider router={router} />;
}

const router = createBrowserRouter([
  {
    path: '*',
    element: <NotFound />,
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

import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import { AuthContainer } from '../components/auth/AuthContainer';
import { UserLoader } from '../components/auth/UserLoader';
import ErrorPage from '../components/ErrorPage';
import Header from '../components/Header';
import Logout from '../components/Logout';
import { PermissionContainer } from '../components/permission/PermissionContainer';
import ROLES from '../constants/roles';
import ChangePassword from '../pages/ChangePassword';
import ContactPage from '../pages/ContactPage';
import Dashboard from '../pages/Dashboard';
import EventDetailsPage from '../pages/EventDetailsPage';
import ForgotPassword from '../pages/ForgotPassword';
import DashboardNavigator from '../pages/Home';
import Login from '../pages/Login';
import MainEventsPage from '../pages/MainEventsPage';
import NotFound from '../pages/NotFound';
import RegisterUser from '../pages/RegisterUser';
import ResetPassword from '../pages/ResetPassword';
import Wallet from '../pages/Wallet';
import ProfilePage from '../pages/ProfilePage';
import CreateAdmin from '../pages/CreateAdmin';
import EventApprovalPage from '../pages/EventApprovalPage';

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
        <Header />
        <MainEventsPage />
      </div>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: 'event/info/:eventId',
    element: (
      <div>
        <UserLoader>
          <Header />
          <EventDetailsPage />
        </UserLoader>
      </div>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: 'profile',
    element: (
      <UserLoader>
        <ProfilePage />
      </UserLoader>
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
        path: 'wallet',
        element: <Wallet />,
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
        path: 'event-organizer/',
        element: (
          <PermissionContainer roles={[ROLES.EVENT_ORGANIZER]}>
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
        children: [
          {
            path: 'create-admin',
            element: <CreateAdmin />,
            errorElement: <ErrorPage />,
          },
        ],
      },
      {
        path: 'admin/',
        element: (
          <PermissionContainer roles={[ROLES.ADMIN]}>
            <Outlet />
          </PermissionContainer>
        ),
        children: [
          {
            path: 'event-approvals',
            element: <EventApprovalPage />,
            errorElement: <ErrorPage />,
          },
        ],
      },
      {
        path: 'logout',
        element: <Logout />,
      },
    ],
  },
]);

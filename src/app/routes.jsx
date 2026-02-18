import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import Loader from '../components/common/Loader';
import ProtectedRoute from './ProtectedRoute';
import Layout from './Layout';

const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const SavedJobs = lazy(() => import('../pages/SavedJobs'));
const AppliedJobs = lazy(() => import('../pages/AppliedJobs'));
const JobDetailsPage = lazy(() => import('../pages/JobDetailsPage'));
const NotFound = lazy(() => import('../pages/NotFound'));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader size="lg" />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Suspense fallback={<PageLoader />}><Home /></Suspense> },
      { path: 'login', element: <Suspense fallback={<PageLoader />}><Login /></Suspense> },
      { path: 'register', element: <Suspense fallback={<PageLoader />}><Register /></Suspense> },
      {
        path: 'saved',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <SavedJobs />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'applied',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <AppliedJobs />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      { path: 'jobs/:id', element: <Suspense fallback={<PageLoader />}><JobDetailsPage /></Suspense> },
      { path: '404', element: <Suspense fallback={<PageLoader />}><NotFound /></Suspense> },
      { path: '*', element: <Navigate to="/404" replace /> },
    ],
  },
]);

export function Routes() {
  return <RouterProvider router={router} />;
}

export { router };

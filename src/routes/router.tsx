/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy } from 'react';
import { Outlet, createBrowserRouter } from 'react-router-dom';
import paths, { rootPaths } from './paths';
import MainLayout from 'layouts/main-layout';
import AuthLayout from 'layouts/auth-layout';
import Splash from 'components/loading/Splash';
import PageLoader from 'components/loading/PageLoader';
import ProtectedRoute from 'components/ProtectedRoute';

const App = lazy(() => import('App'));
const Dashboard = lazy(() => import('pages/dashboard'));
const Commitments = lazy(() => import('pages/dashboard/commitments'));
const CommitmentsCreate = lazy(() => import('pages/dashboard/commitmentsCreate'));
const CommitmentsEdit = lazy(() => import('pages/dashboard/commitmentsEdit'));
const Login = lazy(() => import('pages/authentication/Login'));
const Signup = lazy(() => import('pages/authentication/Signup'));
const CommitmentHistory = lazy(() => import('pages/dashboard/commitmentHistory'));
const CommitmentHistoryCreate = lazy(() => import('pages/dashboard/commitmentHistoryCreate'));
const CommitmentHistoryEdit = lazy(() => import('pages/dashboard/commitmentHistoryEdit'));
const Savings = lazy(() => import('pages/dashboard/savings'));
const SavingsCreate = lazy(() => import('pages/dashboard/savingsCreate'));
const SavingsEdit = lazy(() => import('pages/dashboard/savingsEdit'));

const router = createBrowserRouter(
  [
    {
      element: (
        <Suspense fallback={<Splash />}>
          <App />
        </Suspense>
      ),
      children: [
        // Protected routes
        {
          element: <ProtectedRoute />, // <--- Wrap all protected routes
          children: [
            {
              path: '/',
              element: (
                <MainLayout>
                  <Suspense fallback={<PageLoader />}>
                    <Outlet />
                  </Suspense>
                </MainLayout>
              ),
              children: [
                { index: true, element: <Dashboard /> },
                { path: 'commitments', element: <Commitments /> },
                { path: 'pages/commitments/create', element: <CommitmentsCreate /> },
                { path: 'pages/commitments/edit/:id', element: <CommitmentsEdit /> },
                { path: 'commitment-history/:id', element: <CommitmentHistory /> },
                { path: 'create-commitment-history/:commitmentId', element: <CommitmentHistoryCreate /> },
                { path: 'edit-commitment-history/:id', element: <CommitmentHistoryEdit /> },
                { path: 'savings', element: <Savings /> },
                { path: 'pages/savings/create', element: <SavingsCreate /> },
                { path: 'pages/savings/edit/:id', element: <SavingsEdit /> },
              ],
            },
          ],
        },
        // Auth routes (not protected)
        {
          path: rootPaths.authRoot,
          element: (
            <AuthLayout>
              <Outlet />
            </AuthLayout>
          ),
          children: [
            { path: paths.login, element: <Login /> },
            { path: paths.signup, element: <Signup /> },
          ],
        },
      ],
    },
  ],
  {
    basename: '/jv-app',
  },
);

export default router;

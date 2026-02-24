import React from 'react';
import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MapView from './pages/MapView';
import BudgetPlanning from './pages/BudgetPlanning';
import Analytics from './pages/Analytics';
import InfrastructureDetail from './pages/InfrastructureDetail';

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
});

const mapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/map',
  component: MapView,
});

const budgetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/budget',
  component: BudgetPlanning,
});

const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/analytics',
  component: Analytics,
});

const infrastructureDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/infrastructure/$id',
  component: InfrastructureDetail,
});

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  mapRoute,
  budgetRoute,
  analyticsRoute,
  infrastructureDetailRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}

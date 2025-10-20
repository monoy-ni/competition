import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import Home from '@/pages/Home';
import ContentGenerate from '@/pages/ContentGenerate';
import ContentEdit from '@/pages/ContentEdit';
import ContentAudit from '@/pages/ContentAudit';
import DataAnalysis from '@/pages/DataAnalysis';
import AssetManagement from '@/pages/AssetManagement';
import UserManagement from '@/pages/UserManagement';
import Login from '@/pages/Login';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'content-generate', element: <ContentGenerate /> },
      { path: 'content-edit', element: <ContentEdit /> },
      { path: 'content-audit', element: <ContentAudit /> },
      { path: 'data-analysis', element: <DataAnalysis /> },
      { path: 'asset-management', element: <AssetManagement /> },
      { path: 'user-management', element: <UserManagement /> },
    ],
  },
]);
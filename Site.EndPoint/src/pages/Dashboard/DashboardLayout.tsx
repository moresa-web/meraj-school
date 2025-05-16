import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <Sidebar
        onAddNews={() => navigate('/dashboard/news/new')}
        onAddClass={() => navigate('/dashboard/classes/new')}
      />
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout; 
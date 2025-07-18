import React from 'react';
import Sidebar from './Sidebar';
import '../../styles/dashboard.css';
import { Outlet, useNavigate } from 'react-router-dom';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  return (
    <div className="dashboard-layout">
      <Sidebar onLogout={handleLogout} />
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout; 
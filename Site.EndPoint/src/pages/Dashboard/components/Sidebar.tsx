import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <div className="dashboard-sidebar">
      <div className="sidebar-header">
        <h1>{t('dashboard.title')}</h1>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink 
          to="/dashboard/news" 
          className={({ isActive }) => 
            `sidebar-nav-item ${isActive ? 'active' : ''}`
          }
        >
          <span className="material-icons">newspaper</span>
          <span>{t('dashboard.menu.news')}</span>
        </NavLink>

        <NavLink 
          to="/dashboard/classes" 
          className={({ isActive }) => 
            `sidebar-nav-item ${isActive ? 'active' : ''}`
          }
        >
          <span className="material-icons">school</span>
          <span>{t('dashboard.menu.classes')}</span>
        </NavLink>

        <NavLink 
          to="/dashboard/newsletter" 
          className={({ isActive }) => 
            `sidebar-nav-item ${isActive ? 'active' : ''}`
          }
        >
          <span className="material-icons">mail</span>
          <span>{t('dashboard.menu.newsletter')}</span>
        </NavLink>

        <NavLink 
          to="/dashboard/seo" 
          className={({ isActive }) => 
            `sidebar-nav-item ${isActive ? 'active' : ''}`
          }
        >
          <span className="material-icons">search</span>
          <span>{t('dashboard.menu.seo')}</span>
        </NavLink>
      </nav>

      <div className="sidebar-actions">
        {location.pathname.includes('/news') && (
          <NavLink 
            to="/dashboard/news/add" 
            className={({ isActive }) => 
              `sidebar-action-button ${isActive ? 'active' : ''}`
            }
          >
            <span className="material-icons">add</span>
            <span>افزودن خبر</span>
          </NavLink>
        )}

        {location.pathname.includes('/classes') && (
          <NavLink 
            to="/dashboard/classes/add" 
            className={({ isActive }) => 
              `sidebar-action-button ${isActive ? 'active' : ''}`
            }
          >
            <span className="material-icons">add</span>
            <span>افزودن کلاس</span>
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Sidebar; 
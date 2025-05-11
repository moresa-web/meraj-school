import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SidebarProps } from '../types';

const Sidebar: React.FC<SidebarProps> = ({ onAddNews, onAddClass }) => {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.split('/').pop() || 'news';

  const handleMenuClick = (menuId: string) => {
    setExpandedMenu(expandedMenu === menuId ? null : menuId);
  };

  const handleAddNews = () => {
    navigate('/dashboard/news/add');
    onAddNews();
  };

  const handleAddClass = () => {
    navigate('/dashboard/classes/add');
    onAddClass();
  };

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-header">
        <h2>پنل مدیریت</h2>
      </div>
      <nav className="sidebar-nav">
        <div className="menu-item">
          <button
            className={`menu-button ${expandedMenu === 'news' ? 'active' : ''}`}
            onClick={() => handleMenuClick('news')}
          >
            <span className="nav-icon">📰</span>
            <span className="nav-text">مدیریت اخبار</span>
            <span className="menu-arrow">{expandedMenu === 'news' ? '▼' : '▶'}</span>
          </button>
          {expandedMenu === 'news' && (
            <div className="submenu">
              <Link
                to="/dashboard/news"
                className={`submenu-button ${path === 'news' ? 'active' : ''}`}
              >
                <span className="nav-icon">📋</span>
                <span className="nav-text">لیست اخبار</span>
              </Link>
              <Link
                to="/dashboard/news/add"
                className={`submenu-button add-button ${path === 'add' ? 'active' : ''}`}
                onClick={onAddNews}
              >
                <span className="nav-icon">📝</span>
                <span className="nav-text">افزودن خبر جدید</span>
              </Link>
            </div>
          )}
        </div>

        <div className="menu-item">
          <button
            className={`menu-button ${expandedMenu === 'classes' ? 'active' : ''}`}
            onClick={() => handleMenuClick('classes')}
          >
            <span className="nav-icon">📚</span>
            <span className="nav-text">مدیریت کلاس‌های تقویتی</span>
            <span className="menu-arrow">{expandedMenu === 'classes' ? '▼' : '▶'}</span>
          </button>
          {expandedMenu === 'classes' && (
            <div className="submenu">
              <Link
                to="/dashboard/classes"
                className={`submenu-button ${path === 'classes' ? 'active' : ''}`}
              >
                <span className="nav-icon">📋</span>
                <span className="nav-text">لیست کلاس‌ها</span>
              </Link>
              <Link
                to="/dashboard/classes/add"
                className={`submenu-button add-button ${path === 'add' ? 'active' : ''}`}
                onClick={onAddClass}
              >
                <span className="nav-icon">➕</span>
                <span className="nav-text">افزودن کلاس جدید</span>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar; 
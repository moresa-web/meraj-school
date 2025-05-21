import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
      <Link to="/" className="hover:text-emerald-600">
        خانه
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronLeft className="w-4 h-4" />
          {item.path ? (
            <Link to={item.path} className="hover:text-emerald-600">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-700">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs; 
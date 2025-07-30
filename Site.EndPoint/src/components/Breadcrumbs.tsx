import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
  isCurrent?: boolean;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  const location = useLocation();
  
  // Generate breadcrumbs from URL if not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'خانه', path: '/' }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Map URL segments to readable labels
      const labelMap: { [key: string]: string } = {
        'about': 'درباره ما',
        'contact': 'تماس با ما',
        'news': 'اخبار',
        'classes': 'کلاس‌ها',
        'register': 'ثبت‌نام',
        'login': 'ورود',
        'profile': 'پروفایل',
        'chat': 'چت',
        'faq': 'سوالات متداول',
        'rules': 'قوانین و مقررات',
        'gallery': 'گالری تصاویر',
        'achievements': 'افتخارات',
        'teachers': 'کادر آموزشی',
        'facilities': 'امکانات مدرسه',
        'extracurricular': 'فعالیت‌های فوق برنامه',
        'counseling': 'مشاوره تحصیلی',
        'calendar': 'تقویم آموزشی',
        'results': 'نتایج امتحانات',
        'library': 'کتابخانه',
        'laboratory': 'آزمایشگاه',
        'gym': 'سالن ورزشی',
        'cafeteria': 'کافه‌تریا',
        'health': 'بهداشت و درمان',
        'security': 'امنیت',
        'transportation': 'حمل و نقل',
        'dormitory': 'خوابگاه',
        'scholarship': 'بورسیه',
        'careers': 'همکاری با ما',
        'privacy': 'حریم خصوصی',
        'terms': 'شرایط استفاده'
      };

      const label = labelMap[segment] || segment;
      const isCurrent = index === pathSegments.length - 1;
      
      breadcrumbs.push({
        label,
        path: currentPath,
        isCurrent
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  // Generate structured data for breadcrumbs
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": `https://mohammadrezasardashti.ir${item.path}`
    }))
  };

  return (
    <>
      {/* Structured data for SEO */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      
      {/* Visual breadcrumbs */}
      <nav 
        className={`flex items-center space-x-2 space-x-reverse text-sm text-gray-600 dark:text-gray-400 ${className}`}
        aria-label="Breadcrumb"
      >
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.path}>
            {index === 0 ? (
              <Link
                to={item.path}
                className="flex items-center hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                aria-label="صفحه اصلی"
              >
                <Home className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                to={item.path}
                className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors ${
                  item.isCurrent 
                    ? 'text-emerald-600 dark:text-emerald-400 font-medium' 
                    : ''
                }`}
                aria-current={item.isCurrent ? 'page' : undefined}
              >
                {item.label}
              </Link>
            )}
            
            {index < breadcrumbItems.length - 1 && (
              <ChevronLeft className="w-4 h-4 text-gray-400" />
            )}
          </React.Fragment>
        ))}
      </nav>
    </>
  );
};

export default Breadcrumbs; 
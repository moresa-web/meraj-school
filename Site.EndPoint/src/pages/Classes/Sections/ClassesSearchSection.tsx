import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Filter, X } from 'lucide-react';
import './ClassesSearchSection.css';

interface ClassesSearchContent {
  searchPlaceholder: string;
  categories: string[];
  sortOptions: string[];
}

const defaultContent: ClassesSearchContent = {
  searchPlaceholder: 'جستجو در کلاس‌ها...',
  categories: ['همه کلاس‌ها', 'ریاضی', 'فیزیک', 'شیمی', 'زیست‌شناسی', 'ادبیات', 'زبان انگلیسی'],
  sortOptions: ['جدیدترین', 'پربازدیدترین', 'محبوب‌ترین', 'قیمت (صعودی)', 'قیمت (نزولی)']
};

interface ClassesSearchSectionProps {
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
  searchQuery: string;
  selectedCategory: string;
  sortBy: string;
}

const ClassesSearchSection: React.FC<ClassesSearchSectionProps> = ({
  onSearchChange,
  onCategoryChange,
  onSortChange,
  searchQuery,
  selectedCategory,
  sortBy
}) => {
  const [content, setContent] = useState<ClassesSearchContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const fetchContent = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // API call would go here
      // const response = await axios.get(`${API_URL}/api/content/classes-search`);
      // setContent(response.data);
    } catch (err) {
      setError('خطا در دریافت محتوا');
      console.error('Error fetching classes search content:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCategoryChange(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value);
  };

  const toggleMobileFilters = () => {
    setIsMobileFiltersOpen(!isMobileFiltersOpen);
  };

  if (isLoading) {
    return (
      <section className="classes-search-section">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-700 rounded-lg mb-6"></div>
            <div className="h-10 bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="classes-search-section">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-red-400 mb-4">{error}</div>
            <button
              onClick={fetchContent}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="classes-search-section">
      <div className="container mx-auto px-4">
        {/* Search Bar */}
        <div className="classes-search-bar mb-8">
          <div className="relative group">
            <input
              type="text"
              placeholder={content.searchPlaceholder}
              value={searchQuery}
              onChange={handleSearchChange}
              className="classes-search-input"
            />
            <Search className="classes-search-icon" />
          </div>
        </div>

        {/* Filters Row */}
        <div className="classes-filters">
          {/* Mobile Filter Button */}
          <div className="classes-mobile-filter-button">
            <button
              onClick={toggleMobileFilters}
              className="classes-mobile-filter-toggle"
            >
              <Filter className="w-5 h-5" />
              <span>فیلترها</span>
              <X className={`w-5 h-5 transition-transform duration-300 ${isMobileFiltersOpen ? 'rotate-90' : ''}`} />
            </button>
          </div>

          {/* Mobile Filters Dropdown */}
          <div className={`classes-mobile-filters ${isMobileFiltersOpen ? 'open' : ''}`}>
            {/* Categories */}
            <div className="classes-filter-group">
              <label className="classes-filter-label">دسته‌بندی</label>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="classes-filter-select"
              >
                {content.categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div className="classes-filter-group">
              <label className="classes-filter-label">مرتب‌سازی</label>
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="classes-filter-select"
              >
                {content.sortOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Desktop Filters */}
          <div className="classes-desktop-filters">
            {/* Sort Options - Left Side */}
            <div className="classes-sort-container">
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="classes-sort-select"
              >
                {content.sortOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Categories - Center */}
            <div className="classes-categories">
              {content.categories.map((category, index) => (
                <button
                  key={category}
                  onClick={() => onCategoryChange(category)}
                  className={`classes-category-button ${selectedCategory === category ? 'active' : ''}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Empty div for flex spacing */}
            <div className="classes-spacer"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClassesSearchSection;
import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import './NewsSearchSection.css';

interface NewsSearchSectionProps {
  searchQuery: string;
  selectedCategory: string;
  selectedTag: string;
  sortBy: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTagChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

const NewsSearchSection: React.FC<NewsSearchSectionProps> = ({
  searchQuery,
  selectedCategory,
  selectedTag,
  sortBy,
  onSearchChange,
  onCategoryChange,
  onTagChange,
  onSortChange
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const categories = [
    'همه اخبار',
    'اخبار مدرسه',
    'افتخارات',
    'همایش‌ها',
    'کلاس‌های تقویتی',
    'مسابقات',
    'اردوها'
  ];

  const tags = [
    'همه برچسب‌ها',
    'آموزشی',
    'فرهنگی',
    'ورزشی',
    'علمی',
    'اجتماعی',
    'فناوری',
    'هنری'
  ];

  const sortOptions = [
    { value: 'newest', label: 'جدیدترین' },
    { value: 'mostViewed', label: 'پربازدیدترین' },
    { value: 'mostLiked', label: 'محبوب‌ترین' },
    { value: 'oldest', label: 'قدیمی‌ترین' }
  ];

  return (
    <section className="news-search-section">
      <div className="news-search-container">
        {/* Search Bar */}
        <div className="news-search-bar">
          <div className="news-search-input-wrapper">
            <Search className="news-search-icon" />
            <input
              type="text"
              placeholder="جستجو در اخبار..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="news-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="news-search-clear"
                aria-label="پاک کردن جستجو"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Desktop Filters */}
        <div className="news-filters-desktop">
          <div className="news-filter-group">
            <label className="news-filter-label">دسته‌بندی:</label>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="news-filter-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="news-filter-group">
            <label className="news-filter-label">برچسب:</label>
            <select
              value={selectedTag}
              onChange={(e) => onTagChange(e.target.value)}
              className="news-filter-select"
            >
              {tags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          <div className="news-filter-group">
            <label className="news-filter-label">مرتب‌سازی:</label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="news-filter-select"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="news-filters-mobile">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="news-filter-toggle"
            aria-label="نمایش فیلترها"
          >
            <Filter className="w-5 h-5" />
            <span>فیلترها</span>
          </button>

          {/* Mobile Filters Dropdown */}
          {showMobileFilters && (
            <div className="news-mobile-filters">
              <div className="news-mobile-filter-group">
                <label className="news-mobile-filter-label">دسته‌بندی:</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="news-mobile-filter-select"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="news-mobile-filter-group">
                <label className="news-mobile-filter-label">برچسب:</label>
                <select
                  value={selectedTag}
                  onChange={(e) => onTagChange(e.target.value)}
                  className="news-mobile-filter-select"
                >
                  {tags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>

              <div className="news-mobile-filter-group">
                <label className="news-mobile-filter-label">مرتب‌سازی:</label>
                <select
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="news-mobile-filter-select"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsSearchSection; 
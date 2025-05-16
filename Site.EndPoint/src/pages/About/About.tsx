import React, { useState, useEffect } from 'react';
import HeroSection from '../../components/HeroSection/HeroSection';
import EditableContent from '../../components/EditableContent/EditableContent';
import { useAuth } from '../../contexts/AuthContext';
import SEO from '../../components/SEO';
import { Helmet } from 'react-helmet-async';

interface AboutContent {
  mainTitle: string;
  mainDescription: string;
  mainImage: string;
  featuresTitle: string;
  heroTitle: string;
  heroDescription: string;
  features: {
    title: string;
    description: string;
  }[];
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const About: React.FC = () => {
  const title = import.meta.env.VITE_ABOUT_TITLE || 'درباره ما - دبیرستان پسرانه معراج';
  const description =
    import.meta.env.VITE_ABOUT_DESCRIPTION ||
    'آشنایی با تاریخچه، مأموریت و تیم دبیرستان پسرانه معراج؛ مرکزی پیشرو در آموزش با استانداردهای جهانی.';
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://merajschool.ir';
  const pagePath = '/about';
  const fullUrl = `${siteUrl}${pagePath}`;
  const ogImagePath = import.meta.env.VITE_OG_IMAGE_PATH || '/images/logo.png';
  const ogImage = `${siteUrl}${ogImagePath}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "url": fullUrl,
    "name": title,
    "description": description,
    "isPartOf": {
      "@type": "School",
      "name": import.meta.env.VITE_DEFAULT_TITLE || 'دبیرستان پسرانه معراج',
      "url": siteUrl,
      "logo": `${siteUrl}/images/logo.png`
    }
  };


  const { user } = useAuth();
  const [content, setContent] = useState<AboutContent>({
    mainTitle: 'دبیرستان معراج',
    mainDescription: 'دبیرستان معراج با بیش از 20 سال سابقه درخشان در زمینه آموزش و پرورش، همواره در تلاش بوده است تا با بهره‌گیری از اساتید مجرب و امکانات آموزشی پیشرفته، محیطی مناسب برای رشد و شکوفایی استعدادهای دانش‌آموزان فراهم کند.\n\nما معتقدیم که هر دانش‌آموز دارای استعدادهای منحصر به فردی است و وظیفه ما کشف و پرورش این استعدادهاست. با برنامه‌های آموزشی متنوع و کلاس‌های تقویتی، تلاش می‌کنیم تا دانش‌آموزان را برای موفقیت در آینده آماده کنیم.',
    mainImage: '/images/about-school.png',
    featuresTitle: 'امکانات و ویژگی‌های ما',
    heroTitle: 'درباره ما',
    heroDescription: 'با دبیرستان معراج بیشتر آشنا شوید',
    features: [
      {
        title: 'آموزش با کیفیت',
        description: 'استفاده از اساتید مجرب و روش‌های نوین آموزشی'
      },
      {
        title: 'امکانات پیشرفته',
        description: 'آزمایشگاه‌های مجهز و کلاس‌های هوشمند'
      },
      {
        title: 'مشاوره تحصیلی',
        description: 'مشاوره تخصصی برای انتخاب رشته و برنامه‌ریزی تحصیلی'
      }
    ]
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${API_URL}/content/about/main`);
        if (response.ok) {
          const data = await response.json();
          setContent({
            ...data,
            featuresTitle: data.featuresTitle || 'امکانات و ویژگی‌های ما',
            heroTitle: data.heroTitle || 'درباره ما',
            heroDescription: data.heroDescription || 'با دبیرستان معراج بیشتر آشنا شوید'
          });
        }
      } catch (error) {
        console.error('Error fetching about content:', error);
      }
    };

    fetchContent();
  }, []);

  const handleSave = async (field: keyof AboutContent, newValue: any) => {
    try {
      const updatedContent = { ...content, [field]: newValue };

      const response = await fetch(`${API_URL}/content/about/main`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedContent)
      });

      if (response.ok) {
        setContent(updatedContent);
      } else {
        throw new Error('Failed to update about content');
      }
    } catch (error) {
      console.error('Error updating about content:', error);
      alert('خطا در به‌روزرسانی محتوا');
    }
  };

  const handleFeatureSave = async (index: number, field: 'title' | 'description', newValue: string) => {
    try {
      const updatedFeatures = [...content.features];
      updatedFeatures[index] = { ...updatedFeatures[index], [field]: newValue };

      const response = await fetch(`${API_URL}/content/about/main`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ...content, features: updatedFeatures })
      });

      if (response.ok) {
        setContent({ ...content, features: updatedFeatures });
      } else {
        throw new Error('Failed to update about content');
      }
    } catch (error) {
      console.error('Error updating about content:', error);
      alert('خطا در به‌روزرسانی محتوا');
    }
  };

  return (
    <>
      <SEO
        title="درباره ما | دبیرستان پسرانه معراج"
        description="معرفی دبیرستان پسرانه معراج مشهد. تاریخچه، اهداف، امکانات و افتخارات مدرسه. مدرسه‌ای پیشرفته با امکانات آموزشی مدرن."
        keywords="درباره دبیرستان معراج, تاریخچه مدرسه, امکانات مدرسه, افتخارات مدرسه, مدرسه هوشمند مشهد"
        url="/about"
      />
      <Helmet>
        {/* تنظیم عنوان و توضیحات متا */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={fullUrl} />

        {/* تنظیم Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:image" content={ogImage} />

        {/* تنظیم Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />

        {/* داده‌ ساختار‌یافته JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>


      <div className="min-h-screen bg-gray-50">
        <HeroSection
          title={
            <EditableContent
              type="text"
              value={content.heroTitle}
              isAdmin={user?.role === 'admin'}
              onSave={(newValue) => handleSave('heroTitle', newValue)}
            />
          }
          description={
            <EditableContent
              type="text"
              value={content.heroDescription}
              isAdmin={user?.role === 'admin'}
              onSave={(newValue) => handleSave('heroDescription', newValue)}
            />
          }
          backgroundImage="/images/about-hero.jpg"
          overlayColor="from-black/40"
        />

        {/* Content Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-fade-in-up">
                <h2 className="text-3xl font-bold text-gray-800">
                  <EditableContent
                    type="text"
                    value={content.mainTitle}
                    isAdmin={user?.role === 'admin'}
                    onSave={(newValue) => handleSave('mainTitle', newValue)}
                  />
                </h2>
                <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                  <EditableContent
                    type="text"
                    value={content.mainDescription}
                    isAdmin={user?.role === 'admin'}
                    onSave={(newValue) => handleSave('mainDescription', newValue)}
                  />
                </div>
              </div>
              <div className="relative h-[400px] rounded-2xl overflow-hidden animate-fade-in-up animation-delay-200">
                <EditableContent
                  type="image"
                  value={content.mainImage}
                  isAdmin={user?.role === 'admin'}
                  onSave={(newValue) => handleSave('mainImage', newValue)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 animate-fade-in-up">
              <EditableContent
                type="text"
                value={content.featuresTitle}
                isAdmin={user?.role === 'admin'}
                onSave={(newValue) => handleSave('featuresTitle', newValue)}
              />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {content.features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="mb-6">
                    {[
                      <svg key="education" className="w-12 h-12 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>,
                      <svg key="facilities" className="w-12 h-12 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>,
                      <svg key="counseling" className="w-12 h-12 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    ][index]}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    <EditableContent
                      type="text"
                      value={feature.title}
                      isAdmin={user?.role === 'admin'}
                      onSave={(newValue) => handleFeatureSave(index, 'title', newValue)}
                    />
                  </h3>
                  <p className="text-gray-600">
                    <EditableContent
                      type="text"
                      value={feature.description}
                      isAdmin={user?.role === 'admin'}
                      onSave={(newValue) => handleFeatureSave(index, 'description', newValue)}
                    />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About; 
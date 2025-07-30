// src/pages/Contact.tsx
import React, { lazy, Suspense, useState, useEffect } from 'react';
import './Contact.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet-async';
import SEO from '../../components/SEO';
import { useAuth } from '../../contexts/AuthContext';

// Lazy load sections
const ContactHeroSection = lazy(() => import('./Sections/ContactHeroSection'));
const ContactFormSection = lazy(() => import('./Sections/ContactFormSection'));
const ContactInfoSection = lazy(() => import('./Sections/ContactInfoSection'));
const ContactMapSection = lazy(() => import('./Sections/ContactMapSection'));
const ContactFeaturesSection = lazy(() => import('./Sections/ContactFeaturesSection'));

interface ContactContent {
  heroTitle: string;
  heroDescription: string;
  contactInfo: {
    address: string;
    phone: string;
    email: string;
  };
  sectionTitles: {
    contactForm: string;
    contactInfo: string;
    location: string;
  };
  mapUrl: string;
  mapLocation: { lat: number; lng: number };
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Contact: React.FC = () => {
  const { user } = useAuth();

  // --- متغیرهای Helmet ---
  const title = import.meta.env.VITE_CONTACT_TITLE || 'تماس با ما - دبیرستان پسرانه معراج';
  const description =
    import.meta.env.VITE_CONTACT_DESCRIPTION ||
    'راه‌های ارتباطی و پشتیبانی با دبیرستان پسرانه معراج؛ شامل فرم ارسال پیام، اطلاعات تماس و موقعیت مکانی.';
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://merajschool.ir';
  const pagePath = '/contact';
  const fullUrl = `${siteUrl}${pagePath}`;
  const ogImagePath = import.meta.env.VITE_OG_IMAGE_PATH || '/images/logo.png';
  const ogImage = `${siteUrl}${ogImagePath}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "url": fullUrl,
    "name": title,
    "description": description,
    "mainEntity": {
      "@type": "Organization",
      "name": import.meta.env.VITE_DEFAULT_TITLE || 'دبیرستان پسرانه معراج',
      "url": siteUrl,
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "telephone": "+985138932030",
        "email": "info@merajschool.ir",
        "areaServed": "IR",
        "availableLanguage": ["fa"]
      }
    }
  };

  // --- وضعیت اولیه محتوا ---
  const [content, setContent] = useState<ContactContent>({
    heroTitle: 'تماس با ما',
    heroDescription: 'راه‌های ارتباطی با دبیرستان معراج',
    contactInfo: {
      address: 'مشهد، خیابان امام رضا، خیابان معراج، دبیرستان معراج',
      phone: '(۰۵۱) ۳۸۹۳۲۰۳۰',
      email: 'info@meraj-school.ir'
    },
    sectionTitles: {
      contactForm: 'ارسال پیام',
      contactInfo: 'اطلاعات تماس',
      location: 'موقعیت مکانی'
    },
    mapUrl:
      'https://www.google.com/maps/embed?pb=!1m18...',
    mapLocation: { lat: 36.2972, lng: 59.6067 }
  });

  // --- وضعیت برای ویرایش موقعیت مکانی ---
  const [showMapLocationModal, setShowMapLocationModal] = useState(false);
  const [editLat, setEditLat] = useState(content.mapLocation?.lat || 36.2972);
  const [editLng, setEditLng] = useState(content.mapLocation?.lng || 59.6067);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${API_URL}/content/contact/main`);
        if (response.ok) {
          const data = await response.json();
          setContent({
            ...data,
            heroTitle: data.heroTitle || 'تماس با ما',
            heroDescription: data.heroDescription || 'راه‌های ارتباطی با دبیرستان معراج',
            contactInfo: {
              address: data.contactInfo?.address || 'مشهد، خیابان امام رضا، خیابان معراج، دبیرستان معراج',
              phone: data.contactInfo?.phone || '(۰۵۱) ۳۸۹۳۲۰۳۰',
              email: data.contactInfo?.email || 'info@meraj-school.ir'
            },
            sectionTitles: {
              contactForm: data.sectionTitles?.contactForm || 'ارسال پیام',
              contactInfo: data.sectionTitles?.contactInfo || 'اطلاعات تماس',
              location: data.sectionTitles?.location || 'موقعیت مکانی'
            },
            mapUrl: data.mapUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3257.1234567890123!2d59.12345678901234!3d36.12345678901234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDA3JzI0LjUiTiA1OcKwMDcnMjQuNSJF!5e0!3m2!1sen!2sir!4v1234567890123!5m2!1sen!2sir'
          });
        }
      } catch (error) {
        console.error('Error fetching contact content:', error);
      }
    };

    fetchContent();
  }, []);

  const handleSave = async (field: keyof ContactContent, newValue: any) => {
    try {
      const updatedContent = { ...content, [field]: newValue };
      const response = await fetch(`${API_URL}/content/contact/main`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ...updatedContent, mapLocation: content.mapLocation, mapUrl: content.mapUrl })
      });
      if (response.ok) {
        setContent(updatedContent);
      } else {
        throw new Error('Failed to update contact content');
      }
    } catch (error) {
      console.error('Error updating contact content:', error);
      alert('خطا در به‌روزرسانی محتوا');
    }
  };

  const handleContactInfoSave = async (field: keyof ContactContent['contactInfo'], newValue: string) => {
    try {
      const updatedContactInfo = { ...content.contactInfo, [field]: newValue };
      const updatedContent = { ...content, contactInfo: updatedContactInfo };

      const response = await fetch(`${API_URL}/content/contact/main`, {
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
        throw new Error('Failed to update contact content');
      }
    } catch (error) {
      console.error('Error updating contact content:', error);
      alert('خطا در به‌روزرسانی محتوا');
    }
  };

  const handleSectionTitleSave = async (field: keyof ContactContent['sectionTitles'], newValue: string) => {
    try {
      const updatedSectionTitles = { ...content.sectionTitles, [field]: newValue };
      const updatedContent = { ...content, sectionTitles: updatedSectionTitles };

      const response = await fetch(`${API_URL}/content/contact/main`, {
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
        throw new Error('Failed to update contact content');
      }
    } catch (error) {
      console.error('Error updating contact content:', error);
      alert('خطا در به‌روزرسانی محتوا');
    }
  };

  const handleMapLocationSave = async () => {
    try {
      const updatedContent = {
        ...content,
        mapLocation: { lat: editLat, lng: editLng }
      };
      const response = await fetch(`${API_URL}/content/contact/main`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ...updatedContent, mapUrl: content.mapUrl })
      });
      if (response.ok) {
        setContent(updatedContent);
        setShowMapLocationModal(false);
      } else {
        throw new Error('Failed to update map location');
      }
    } catch (error) {
      console.error('Error updating map location:', error);
      alert('خطا در به‌روزرسانی موقعیت مکانی');
    }
  };

  // Centralized state for form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleFormSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="تماس با ما | دبیرستان پسرانه معراج"
        description="راه‌های ارتباطی با دبیرستان پسرانه معراج مشهد. آدرس، شماره تماس، ایمیل و فرم ارتباط با ما. پاسخگویی به سوالات والدین و دانش‌آموزان."
        keywords="تماس با مدرسه, آدرس مدرسه, شماره تماس مدرسه, ایمیل مدرسه, فرم ارتباط با ما, دبیرستان معراج"
        url="/contact"
      />
      <Helmet>
        {/* عنوان و توضیحات متا */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={fullUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:image" content={ogImage} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />

        {/* JSON-LD ساختار‌یافته */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={true}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        
        <Suspense fallback={<div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div></div>}>
          <ContactHeroSection />
        </Suspense>

        <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>}>
          <ContactFormSection
            formData={formData}
            setFormData={setFormData}
            isSubmitting={isSubmitting}
            submitSuccess={submitSuccess}
            onSubmit={handleFormSubmit}
          />
        </Suspense>

        <Suspense fallback={<div className="h-64 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>}>
          <ContactInfoSection />
        </Suspense>

        <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>}>
          <ContactMapSection />
        </Suspense>

        <Suspense fallback={<div className="h-64 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>}>
          <ContactFeaturesSection />
        </Suspense>
      </div>

      {/* modal ویرایش lat/lng */}
      {showMapLocationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">ویرایش موقعیت مکانی (lat/lng)</h3>
            <div className="mb-4">
              <label className="block mb-1">Latitude (عرض جغرافیایی)</label>
              <input
                type="number"
                value={editLat}
                onChange={e => setEditLat(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Longitude (طول جغرافیایی)</label>
              <input
                type="number"
                value={editLng}
                onChange={e => setEditLng(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                onClick={() => setShowMapLocationModal(false)}
              >انصراف</button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={handleMapLocationSave}
              >ذخیره</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Contact; 
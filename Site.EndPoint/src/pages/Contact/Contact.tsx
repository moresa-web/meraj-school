// src/pages/Contact.tsx
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import HeroSection from '../../components/HeroSection/HeroSection';
import EditableContent from '../../components/EditableContent/EditableContent';
import { useAuth } from '../../contexts/AuthContext';
import ContactForm from './ContactForm';

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
}

const API_URL = process.env.REACT_APP_API_URL || 'http://mohammadrezasardashti.ir/api';

const Contact: React.FC = () => {
  const { user } = useAuth();

  // --- متغیرهای Helmet ---
  const title = process.env.REACT_APP_CONTACT_TITLE || 'تماس با ما - دبیرستان پسرانه معراج';
  const description =
    process.env.REACT_APP_CONTACT_DESCRIPTION ||
    'راه‌های ارتباطی و پشتیبانی با دبیرستان پسرانه معراج؛ شامل فرم ارسال پیام، اطلاعات تماس و موقعیت مکانی.';
  const siteUrl = process.env.REACT_APP_SITE_URL || 'https://merajschool.ir';
  const pagePath = '/contact';
  const fullUrl = `${siteUrl}${pagePath}`;
  const ogImagePath = process.env.REACT_APP_OG_IMAGE_PATH || '/images/logo.png';
  const ogImage = `${siteUrl}${ogImagePath}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "url": fullUrl,
    "name": title,
    "description": description,
    "mainEntity": {
      "@type": "Organization",
      "name": process.env.REACT_APP_DEFAULT_TITLE || 'دبیرستان پسرانه معراج',
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
      'https://www.google.com/maps/embed?pb=!1m18...'
  });

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

  return (
    <>
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
          backgroundImage="/images/contact-hero.jpg"
          overlayColor="from-black/40"
        />

        {/* Contact Information Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-white p-8 rounded-2xl shadow-lg animate-fade-in-up">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  <EditableContent
                    type="text"
                    value={content.sectionTitles.contactForm}
                    isAdmin={user?.role === 'admin'}
                    onSave={(newValue) => handleSectionTitleSave('contactForm', newValue)}
                  />
                </h2>
                <ContactForm />
              </div>

              {/* Contact Information */}
              <div className="space-y-8 animate-fade-in-up animation-delay-200">
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    <EditableContent
                      type="text"
                      value={content.sectionTitles.contactInfo}
                      isAdmin={user?.role === 'admin'}
                      onSave={(newValue) => handleSectionTitleSave('contactInfo', newValue)}
                    />
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="mr-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">آدرس</h3>
                        <p className="text-gray-600">
                          <EditableContent
                            type="text"
                            value={content.contactInfo.address}
                            isAdmin={user?.role === 'admin'}
                            onSave={(newValue) => handleContactInfoSave('address', newValue)}
                          />
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div className="mr-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">تلفن</h3>
                        <p className="text-gray-600">
                          <EditableContent
                            type="text"
                            value={content.contactInfo.phone}
                            isAdmin={user?.role === 'admin'}
                            onSave={(newValue) => handleContactInfoSave('phone', newValue)}
                          />
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="mr-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">ایمیل</h3>
                        <p className="text-gray-600">
                          <EditableContent
                            type="text"
                            value={content.contactInfo.email}
                            isAdmin={user?.role === 'admin'}
                            onSave={(newValue) => handleContactInfoSave('email', newValue)}
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                      <EditableContent
                        type="text"
                        value={content.sectionTitles.location}
                        isAdmin={user?.role === 'admin'}
                        onSave={(newValue) => handleSectionTitleSave('location', newValue)}
                      />
                    </h2>
                    {user?.role === 'admin' && (
                      <div className="relative">
                        <button
                          onClick={() => {
                            const modal = document.createElement('div');
                            modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';

                            const modalContent = document.createElement('div');
                            modalContent.className = 'bg-white rounded-lg p-6 w-full max-w-lg';

                            const title = document.createElement('h3');
                            title.className = 'text-lg font-semibold mb-4';
                            title.textContent = 'ویرایش لینک نقشه';

                            const input = document.createElement('input');
                            input.type = 'text';
                            input.id = 'mapUrlInput';
                            input.className = 'w-full px-4 py-2 border rounded-lg mb-4';
                            input.value = content.mapUrl;

                            const buttonContainer = document.createElement('div');
                            buttonContainer.className = 'flex justify-end gap-2';

                            const cancelButton = document.createElement('button');
                            cancelButton.className = 'px-4 py-2 text-gray-600 hover:text-gray-800';
                            cancelButton.textContent = 'انصراف';
                            cancelButton.onclick = () => modal.remove();

                            const saveButton = document.createElement('button');
                            saveButton.className = 'px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700';
                            saveButton.textContent = 'ذخیره';
                            saveButton.onclick = async () => {
                              const newValue = input.value;
                              try {
                                const response = await fetch(`${API_URL}/content/contact/main`, {
                                  method: 'PUT',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                                  },
                                  body: JSON.stringify({ ...content, mapUrl: newValue })
                                });

                                if (response.ok) {
                                  window.location.reload();
                                } else {
                                  alert('خطا در به‌روزرسانی لینک نقشه');
                                }
                              } catch (error) {
                                console.error('Error updating map URL:', error);
                                alert('خطا در به‌روزرسانی لینک نقشه');
                              }
                              modal.remove();
                            };

                            buttonContainer.appendChild(cancelButton);
                            buttonContainer.appendChild(saveButton);

                            modalContent.appendChild(title);
                            modalContent.appendChild(input);
                            modalContent.appendChild(buttonContainer);

                            modal.appendChild(modalContent);
                            document.body.appendChild(modal);
                          }}
                          className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-emerald-200 transition-colors"
                        >
                          <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden">
                    <iframe
                      src={content.mapUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contact; 
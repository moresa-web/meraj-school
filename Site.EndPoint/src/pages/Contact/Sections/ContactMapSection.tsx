import React from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import './ContactMapSection.css';

const ContactMapSection: React.FC = () => {
  const locationInfo = {
    address: 'مشهد، خیابان امام رضا، خیابان معراج، دبیرستان معراج',
    coordinates: {
      lat: 36.2972,
      lng: 59.6067
    },
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3257.1234567890123!2d59.12345678901234!3d36.12345678901234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDA3JzI0LjUiTiA1OcKwMDcnMjQuNSJF!5e0!3m2!1sen!2sir!4v1234567890123!5m2!1sen!2sir',
    directionsUrl: 'https://maps.google.com/maps?daddr=36.2972,59.6067'
  };

  const handleGetDirections = () => {
    window.open(locationInfo.directionsUrl, '_blank');
  };

  const handleOpenMap = () => {
    window.open(locationInfo.directionsUrl, '_blank');
  };

  return (
    <section className="contact-map-section">
      <div className="contact-map-container">
        <div className="contact-map-header">
          <h2 className="contact-map-title">موقعیت مکانی</h2>
          <p className="contact-map-subtitle">
            آدرس دقیق و نقشه دبیرستان معراج
          </p>
        </div>

        <div className="contact-map-content">
          <div className="contact-map-info">
            <div className="contact-map-info-card">
              <div className="contact-map-info-icon">
                <MapPin className="w-8 h-8" />
              </div>
              <div className="contact-map-info-content">
                <h3 className="contact-map-info-title">آدرس دبیرستان</h3>
                <p className="contact-map-info-address">{locationInfo.address}</p>
                <div className="contact-map-info-coordinates">
                  <span>عرض جغرافیایی: {locationInfo.coordinates.lat}</span>
                  <span>طول جغرافیایی: {locationInfo.coordinates.lng}</span>
                </div>
              </div>
            </div>

            <div className="contact-map-actions">
              <button 
                onClick={handleGetDirections}
                className="contact-map-action-button primary"
              >
                <Navigation className="w-5 h-5" />
                مسیریابی
              </button>
              <button 
                onClick={handleOpenMap}
                className="contact-map-action-button secondary"
              >
                <ExternalLink className="w-5 h-5" />
                مشاهده در نقشه
              </button>
            </div>
          </div>

          <div className="contact-map-embed">
            <div className="contact-map-frame-container">
              <iframe
                src={locationInfo.mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="موقعیت دبیرستان معراج"
                className="contact-map-frame"
              />
            </div>
            <div className="contact-map-overlay">
              <div className="contact-map-overlay-content">
                <MapPin className="w-6 h-6" />
                <span>دبیرستان معراج</span>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-map-footer">
          <div className="contact-map-footer-content">
            <h3 className="contact-map-footer-title">دسترسی آسان</h3>
            <p className="contact-map-footer-text">
              دبیرستان معراج در مرکز شهر مشهد واقع شده و دسترسی آسانی از طریق وسایل نقلیه عمومی دارد.
            </p>
            <div className="contact-map-footer-features">
              <div className="contact-map-footer-feature">
                <span className="contact-map-footer-feature-icon">🚌</span>
                <span>اتوبوس شهری</span>
              </div>
              <div className="contact-map-footer-feature">
                <span className="contact-map-footer-feature-icon">🚇</span>
                <span>مترو</span>
              </div>
              <div className="contact-map-footer-feature">
                <span className="contact-map-footer-feature-icon">🚗</span>
                <span>پارکینگ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMapSection; 
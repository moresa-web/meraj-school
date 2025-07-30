import React from 'react';
import { Send, User, Mail, MessageSquare, FileText } from 'lucide-react';
import './ContactFormSection.css';

interface ContactFormSectionProps {
  formData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    subject: string;
    message: string;
  }>>;
  isSubmitting: boolean;
  submitSuccess: boolean;
  onSubmit: (formData: any) => Promise<void>;
}

const ContactFormSection: React.FC<ContactFormSectionProps> = ({
  formData,
  setFormData,
  isSubmitting,
  submitSuccess,
  onSubmit
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <section className="contact-form-section">
      <div className="contact-form-container">
        <div className="contact-form-content">
          <div className="contact-form-header">
            <div className="contact-form-icon">
              <Send className="w-8 h-8" />
            </div>
            <h2 className="contact-form-title">ارسال پیام</h2>
            <p className="contact-form-subtitle">
              فرم زیر را پر کنید تا با شما تماس بگیریم
            </p>
          </div>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="contact-form-group">
              <label htmlFor="name" className="contact-form-label">
                <User className="w-4 h-4" />
                نام و نام خانوادگی
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="contact-form-input"
                placeholder="نام خود را وارد کنید"
                required
              />
            </div>

            <div className="contact-form-group">
              <label htmlFor="email" className="contact-form-label">
                <Mail className="w-4 h-4" />
                ایمیل
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="contact-form-input"
                placeholder="ایمیل خود را وارد کنید"
                required
              />
            </div>

            <div className="contact-form-group">
              <label htmlFor="subject" className="contact-form-label">
                <FileText className="w-4 h-4" />
                موضوع
              </label>
              <input
                type="text"
                id="subject"
                value={formData.subject}
                onChange={handleChange}
                className="contact-form-input"
                placeholder="موضوع پیام خود را وارد کنید"
                required
              />
            </div>

            <div className="contact-form-group">
              <label htmlFor="message" className="contact-form-label">
                <MessageSquare className="w-4 h-4" />
                پیام
              </label>
              <textarea
                id="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="contact-form-textarea"
                placeholder="پیام خود را وارد کنید"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="contact-form-button"
            >
              {isSubmitting ? (
                <>
                  <div className="contact-form-spinner" />
                  در حال ارسال...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  ارسال پیام
                </>
              )}
            </button>

            {submitSuccess && (
              <div className="contact-form-success">
                <div className="contact-form-success-icon">✓</div>
                <p>پیام شما با موفقیت ارسال شد. به زودی با شما تماس خواهیم گرفت.</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection; 
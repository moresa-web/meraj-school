'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { PlusIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface EmailTemplate {
  _id: string;
  name: string;
  description: string;
  type: 'new_news' | 'new_class';
  subject: string;
  html: string;
  variables: string[];
  isActive: boolean;
}

export default function EmailTemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('new_news');
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/email-templates');
      if (!response.ok) throw new Error('خطا در دریافت قالب‌ها');
      const data = await response.json();

      // اطمینان از اینکه data.data یک آرایه است
      if (data.success && Array.isArray(data.data)) {
        setTemplates(data.data);
      } else {
        setTemplates([]);
        toast.error('فرمت داده‌های دریافتی نامعتبر است');
      }
    } catch (error) {
      setTemplates([]);
      toast.error('خطا در دریافت قالب‌های ایمیل');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateUpdate = async (templateId: string, updates: Partial<EmailTemplate>) => {
    try {
      const response = await fetch(`/api/email-templates/${templateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('خطا در بروزرسانی قالب');

      toast.success('قالب با موفقیت بروزرسانی شد');
      fetchTemplates();
    } catch (error) {
      toast.error('خطا در بروزرسانی قالب');
    }
  };

  const handleToggleActive = async (templateId: string, isActive: boolean) => {
    try {
      console.log('Sending request to toggle template:', templateId, isActive);

      const response = await fetch(`/api/email-templates/${templateId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'خطا در تغییر وضعیت قالب');
      }

      if (data.success) {
        toast.success('وضعیت قالب با موفقیت تغییر کرد');
        // به‌روزرسانی وضعیت در state
        setTemplates(prevTemplates =>
          prevTemplates.map(template =>
            template._id === templateId
              ? { ...template, isActive }
              : template
          )
        );
      } else {
        throw new Error(data.message || 'خطا در تغییر وضعیت قالب');
      }
    } catch (error) {
      console.error('Error toggling template:', error);
      toast.error(error instanceof Error ? error.message : 'خطا در تغییر وضعیت قالب');
      // برگرداندن وضعیت به حالت قبلی
      setTemplates(prevTemplates =>
        prevTemplates.map(template =>
          template._id === templateId
            ? { ...template, isActive: !isActive }
            : template
        )
      );
    }
  };

  const handleSubjectChange = async (templateId: string, subject: string) => {
    try {
      const response = await fetch(`/api/email-templates/${templateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject }),
      });

      if (!response.ok) throw new Error('خطا در بروزرسانی موضوع');

      const data = await response.json();
      if (data.success) {
        toast.success('موضوع با موفقیت بروزرسانی شد');
        // به‌روزرسانی موضوع در state
        setTemplates(prevTemplates =>
          prevTemplates.map(template =>
            template._id === templateId
              ? { ...template, subject }
              : template
          )
        );
      } else {
        throw new Error(data.message || 'خطا در بروزرسانی موضوع');
      }
    } catch (error) {
      toast.error('خطا در بروزرسانی موضوع');
      // برگرداندن موضوع به حالت قبلی
      setTemplates(prevTemplates =>
        prevTemplates.map(template =>
          template._id === templateId
            ? { ...template, subject: template.subject }
            : template
        )
      );
    }
  };

  const handleHtmlChange = async (templateId: string, html: string) => {
    try {
      const response = await fetch(`/api/email-templates/${templateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html }),
      });

      if (!response.ok) throw new Error('خطا در بروزرسانی محتوا');

      const data = await response.json();
      if (data.success) {
        toast.success('محتوا با موفقیت بروزرسانی شد');
        // به‌روزرسانی محتوا در state
        setTemplates(prevTemplates =>
          prevTemplates.map(template =>
            template._id === templateId
              ? { ...template, html }
              : template
          )
        );

        // به‌روزرسانی پیش‌نمایش اگر این قالب در حال نمایش است
        if (previewTemplate === templateId) {
          const template = templates.find(t => t._id === templateId);
          if (template) {
            const previewHtml = replaceTemplateVariables(html, template.type);
            const previewFrame = document.getElementById('preview-frame') as HTMLIFrameElement;
            if (previewFrame?.contentWindow) {
              previewFrame.contentWindow.document.open();
              previewFrame.contentWindow.document.write(previewHtml);
              previewFrame.contentWindow.document.close();
            }
          }
        }
      } else {
        throw new Error(data.message || 'خطا در بروزرسانی محتوا');
      }
    } catch (error) {
      toast.error('خطا در بروزرسانی محتوا');
      // برگرداندن محتوا به حالت قبلی
      setTemplates(prevTemplates =>
        prevTemplates.map(template =>
          template._id === templateId
            ? { ...template, html: template.html }
            : template
        )
      );
    }
  };

  const replaceTemplateVariables = (html: string, type: string) => {
    let previewHtml = html;
    const variables = type === 'new_news'
      ? {
          title: 'عنوان خبر نمونه',
          description: 'توضیحات خبر نمونه',
          image: 'https://via.placeholder.com/800x400',
          date: new Date().toLocaleDateString('fa-IR'),
          link: '#'
        }
      : {
          title: 'عنوان کلاس نمونه',
          description: 'توضیحات کلاس نمونه',
          image: 'https://via.placeholder.com/800x400',
          date: new Date().toLocaleDateString('fa-IR'),
          teacher: 'نام استاد نمونه',
          duration: '2 ساعت',
          link: '#'
        };

    Object.entries(variables).forEach(([key, value]) => {
      previewHtml = previewHtml.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    return `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              line-height: 1.5;
              margin: 0;
              padding: 20px;
              background-color: #f9fafb;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: white;
              border-radius: 8px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .email-content {
              padding: 20px;
            }
            img {
              max-width: 100%;
              height: auto;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-content">
              ${previewHtml}
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const togglePreview = (templateId: string) => {
    if (previewTemplate === templateId) {
      setPreviewTemplate(null);
    } else {
      setPreviewTemplate(templateId);
      const template = templates.find(t => t._id === templateId);
      if (template) {
        const previewHtml = replaceTemplateVariables(template.html, template.type);
        setTimeout(() => {
          const previewFrame = document.getElementById('preview-frame') as HTMLIFrameElement;
          if (previewFrame?.contentWindow) {
            previewFrame.contentWindow.document.open();
            previewFrame.contentWindow.document.write(previewHtml);
            previewFrame.contentWindow.document.close();
          }
        }, 100);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const filteredTemplates = templates.filter((template) => template.type === activeTab);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">مدیریت قالب‌های ایمیل</h1>
          <p className="text-gray-500 mt-1">مدیریت و ویرایش قالب‌های ایمیل ارسالی به مشترکین</p>
        </div>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700"
          onClick={() => router.push('/email-templates/new')}
        >
          <PlusIcon className="h-5 w-5 ml-2" />
          افزودن قالب جدید
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('new_news')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'new_news'
                  ? 'border-b-2 border-emerald-500 text-emerald-700 bg-emerald-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              قالب خبر جدید
            </button>
            <button
              onClick={() => setActiveTab('new_class')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'new_class'
                  ? 'border-b-2 border-emerald-500 text-emerald-700 bg-emerald-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              قالب کلاس جدید
            </button>
          </div>
        </div>

        <div className="p-6">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              هیچ قالبی یافت نشد
            </div>
          ) : (
            filteredTemplates.map((template) => (
              <Card key={template._id} className="mb-6 border border-gray-200">
                <CardHeader className="bg-gray-50 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">
                        {template.name}
                      </CardTitle>
                      <p className="text-gray-500 mt-1">{template.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`active-${template._id}`} className="text-gray-700">
                        فعال
                      </Label>
                      <Switch
                        id={`active-${template._id}`}
                        checked={template.isActive}
                        onCheckedChange={(checked) => {
                          console.log('Switch clicked:', template._id, checked);
                          handleToggleActive(template._id, checked);
                        }}
                        className="data-[state=checked]:bg-emerald-600"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor={`subject-${template._id}`} className="text-gray-700 block mb-2">
                        موضوع ایمیل
                      </Label>
                      <Input
                        id={`subject-${template._id}`}
                        value={template.subject}
                        onChange={(e) =>
                          handleSubjectChange(template._id, e.target.value)
                        }
                        className="text-gray-900"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`html-${template._id}`} className="text-gray-700 block mb-2">
                        محتوای HTML
                      </Label>
                      <div className="relative">
                        <Textarea
                          id={`html-${template._id}`}
                          value={template.html}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            setTemplates(prevTemplates =>
                              prevTemplates.map(t =>
                                t._id === template._id
                                  ? { ...t, html: newValue }
                                  : t
                              )
                            );
                            handleHtmlChange(template._id, newValue);
                          }}
                          className="h-64 font-mono text-gray-900"
                          dir="ltr"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => togglePreview(template._id)}
                        >
                          {previewTemplate === template._id ? (
                            <EyeSlashIcon className="h-4 w-4 ml-1" />
                          ) : (
                            <EyeIcon className="h-4 w-4 ml-1" />
                          )}
                          {previewTemplate === template._id ? 'بستن پیش‌نمایش' : 'پیش‌نمایش'}
                        </Button>
                      </div>
                    </div>

                    {previewTemplate === template._id && (
                      <div className="mt-4">
                        <Label className="text-gray-700 block mb-2">پیش‌نمایش</Label>
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <iframe
                            id="preview-frame"
                            className="w-full h-[500px] bg-white"
                            title="پیش‌نمایش قالب"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <Label className="text-gray-700 block mb-2">متغیرهای قابل استفاده</Label>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-2 gap-2">
                          {template.variables.map((variable) => (
                            <div
                              key={variable}
                              className="px-3 py-1.5 bg-white rounded border border-gray-200 text-gray-900 text-sm"
                            >
                              {`{{${variable}}}`}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 
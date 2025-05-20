'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function NewEmailTemplatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    subject: '',
    html: '',
    variables: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/email-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('خطا در ایجاد قالب');

      toast.success('قالب با موفقیت ایجاد شد');
      router.push('/email-templates');
    } catch (error) {
      toast.error('خطا در ایجاد قالب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">افزودن قالب ایمیل جدید</h1>
          <p className="text-gray-500 mt-1">ایجاد قالب جدید برای ارسال ایمیل به مشترکین</p>
        </div>
      </div>

      <Card className="border border-gray-200">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="text-xl font-bold text-gray-900">اطلاعات قالب</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="text-gray-700 block mb-2">
                  نام قالب
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="text-gray-900"
                  required
                />
              </div>

              <div>
                <Label htmlFor="type" className="text-gray-700 block mb-2">
                  نوع قالب
                </Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                >
                  <option value="">انتخاب نوع قالب</option>
                  <option value="new_news">قالب خبر جدید</option>
                  <option value="new_class">قالب کلاس جدید</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-gray-700 block mb-2">
                توضیحات
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="text-gray-900"
                required
              />
            </div>

            <div>
              <Label htmlFor="subject" className="text-gray-700 block mb-2">
                موضوع ایمیل
              </Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="text-gray-900"
                required
              />
            </div>

            <div>
              <Label htmlFor="html" className="text-gray-700 block mb-2">
                محتوای HTML
              </Label>
              <Textarea
                id="html"
                value={formData.html}
                onChange={(e) => setFormData({ ...formData, html: e.target.value })}
                className="h-64 font-mono text-gray-900"
                required
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                انصراف
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={loading}
              >
                {loading ? 'در حال ایجاد...' : 'ایجاد قالب'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 
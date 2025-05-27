import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import api from '@/services/api';

interface SEOData {
  title: string;
  description: string;
  keywords: string;
  image: string;
  siteUrl: string;
  schoolName: string;
  address: string;
  phone: string;
  email: string;
  socialMedia: {
    instagram: string;
    twitter: string;
  };
}

const SEO = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seoData, setSeoData] = useState<SEOData>({
    title: '',
    description: '',
    keywords: '',
    image: '',
    siteUrl: '',
    schoolName: '',
    address: '',
    phone: '',
    email: '',
    socialMedia: {
      instagram: '',
      twitter: ''
    }
  });

  useEffect(() => {
    fetchSEOData();
  }, []);

  const fetchSEOData = async () => {
    try {
      const response = await api.get('/api/seo');
      setSeoData(response.data);
    } catch (error) {
      console.error('Error fetching SEO data:', error);
      toast.error(t('error.fetchingSeoData'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put('/api/seo', seoData);
      toast.success(t('success.seoUpdated'));
    } catch (error) {
      console.error('Error updating SEO data:', error);
      toast.error(t('error.updatingSeoData'));
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('socialMedia.')) {
      const platform = name.split('.')[1];
      setSeoData(prev => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [platform]: value
        }
      }));
    } else {
      setSeoData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.seo.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">{t('dashboard.seo.title')}</Label>
                <Input
                  id="title"
                  name="title"
                  value={seoData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="schoolName">{t('dashboard.seo.schoolName')}</Label>
                <Input
                  id="schoolName"
                  name="schoolName"
                  value={seoData.schoolName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t('dashboard.seo.description')}</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={seoData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">{t('dashboard.seo.keywords')}</Label>
                <Textarea
                  id="keywords"
                  name="keywords"
                  value={seoData.keywords}
                  onChange={handleChange}
                  required
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">{t('dashboard.seo.image')}</Label>
                <Input
                  id="image"
                  name="image"
                  value={seoData.image}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteUrl">{t('dashboard.seo.siteUrl')}</Label>
                <Input
                  id="siteUrl"
                  name="siteUrl"
                  value={seoData.siteUrl}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">{t('dashboard.seo.address')}</Label>
                <Input
                  id="address"
                  name="address"
                  value={seoData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t('dashboard.seo.phone')}</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={seoData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('dashboard.seo.email')}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={seoData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="socialMedia.instagram">{t('dashboard.seo.instagram')}</Label>
                <Input
                  id="socialMedia.instagram"
                  name="socialMedia.instagram"
                  value={seoData.socialMedia.instagram}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="socialMedia.twitter">{t('dashboard.seo.twitter')}</Label>
                <Input
                  id="socialMedia.twitter"
                  name="socialMedia.twitter"
                  value={seoData.socialMedia.twitter}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('common.saving')}
                  </>
                ) : (
                  t('common.save')
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SEO; 
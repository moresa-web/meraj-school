import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import LoadingState from '@/components/LoadingState';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, BookOpen, MapPin } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface ClassData {
  _id: string;
  title: string;
  description: string;
  teacher: string;
  schedule: string;
  capacity: number;
  enrolledStudents: number;
  price: number;
  status: 'active' | 'inactive' | 'completed';
  tags: string[];
  slug: string;
  image: string;
}

const ClassDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/classes/${slug}`);
        setClassData(response.data);
        
        if (user) {
          const checkResponse = await axios.get(`${API_URL}/api/classes/${response.data._id}/check-registration`, {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          setIsRegistered(checkResponse.data.isRegistered);
        }
      } catch (error) {
        console.error('Error fetching class data:', error);
        toast.error('خطا در دریافت اطلاعات کلاس');
        navigate('/classes');
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();
  }, [slug, user, navigate]);

  const handleRegister = async () => {
    if (!user) {
      toast.error('لطفاً ابتدا وارد حساب کاربری خود شوید');
      navigate('/login', { state: { from: `/classes/${slug}` } });
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/classes/${classData?._id}/register`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setIsRegistered(true);
      toast.success('ثبت‌نام با موفقیت انجام شد');
    } catch (error: any) {
      console.error('Error registering for class:', error);
      toast.error(error.response?.data?.message || 'خطا در ثبت‌نام');
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!classData) {
    return null;
  }

  return (
    <>
      <SEO
        title={`${classData.title} | دبیرستان پسرانه معراج`}
        description={classData.description}
        keywords={classData.tags.join(', ')}
        url={`/classes/${classData.slug}`}
      />
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: 'کلاس‌های تقویتی', path: '/classes' },
            { label: classData.title }
          ]}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{classData.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p>{classData.description}</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {classData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>اطلاعات کلاس</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-600" />
                    <span>استاد: {classData.teacher}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                    <span>زمان: {classData.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-600" />
                    <span>
                      ظرفیت: {classData.enrolledStudents}/{classData.capacity}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-600" />
                    <span>وضعیت: {classData.status === 'active' ? 'فعال' : 'غیرفعال'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    <span>مکان: کلاس‌های دبیرستان معراج</span>
                  </div>
                  <div className="pt-4">
                    <div className="text-2xl font-bold text-emerald-600 mb-4">
                      {classData.price.toLocaleString()} تومان
                    </div>
                    <Button
                      onClick={handleRegister}
                      disabled={isRegistered || classData.status !== 'active' || classData.enrolledStudents >= classData.capacity}
                      className="w-full"
                    >
                      {isRegistered
                        ? 'شما در این کلاس ثبت‌نام کرده‌اید'
                        : classData.status !== 'active'
                        ? 'این کلاس در حال حاضر فعال نیست'
                        : classData.enrolledStudents >= classData.capacity
                        ? 'ظرفیت کلاس تکمیل شده است'
                        : 'ثبت‌نام در کلاس'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClassDetail; 
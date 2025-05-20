import { useQuery } from '@tanstack/react-query';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import api from '@/services/api';

// ثبت کامپوننت‌های مورد نیاز Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface NewsletterStats {
  label: string;
  total: number;
  active: number;
}

export function NewsletterChart() {
  const { data, isLoading, error } = useQuery<NewsletterStats[]>({
    queryKey: ['newsletterHistory'],
    queryFn: async () => {
      const { data } = await api.get('/api/dashboard/newsletter-history');
      return data;
    }
  });

  if (isLoading) {
    return <div className="p-4">در حال بارگذاری...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">خطا در دریافت اطلاعات</div>;
  }

  const chartData = {
    labels: data?.map(item => item.label) || [],
    datasets: [
      {
        label: 'کل مشترکان',
        data: data?.map(item => item.total) || [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'مشترکان فعال',
        data: data?.map(item => item.active) || [],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'Vazirmatn'
          }
        }
      },
      title: {
        display: true,
        text: 'تاریخچه مشترکان خبرنامه',
        font: {
          family: 'Vazirmatn',
          size: 16
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            family: 'Vazirmatn'
          }
        }
      },
      x: {
        ticks: {
          font: {
            family: 'Vazirmatn'
          }
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="h-[300px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
} 
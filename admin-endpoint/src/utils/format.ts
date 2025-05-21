export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export function formatNumber(num: number | string) {
  return num.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);
}

export function getImageUrl(imagePath: string) {
  if (!imagePath) return '/images/placeholder.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/uploads')) {
  return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${imagePath}`;
  }
  return imagePath;
} 
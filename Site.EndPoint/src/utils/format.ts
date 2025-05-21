const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getImageUrl = (path: string): string => {
  if (!path) return '';
  
  // اگر آدرس کامل است، همان را برگردان
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // اگر آدرس با / شروع شده، آن را به API_URL اضافه کن
  if (path.startsWith('/')) {
    return `${API_URL}${path}`;
  }

  // در غیر این صورت، آدرس را به API_URL اضافه کن
  return `${API_URL}/${path}`;
}; 
export const formatDate = (dateString: string): string => {
  try {
    // If the date is already in Persian format (YYYY/MM/DD), return it
    if (/^\d{4}\/\d{2}\/\d{2}$/.test(dateString)) {
      return dateString;
    }

    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'تاریخ نامعتبر';
    }

    // Convert to Persian date
    const persianDate = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);

    return persianDate;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'تاریخ نامعتبر';
  }
}; 
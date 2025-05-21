import fs from 'fs';
import path from 'path';

export const deleteFile = (filePath: string) => {
  try {
    console.log('deleteFile called with path:', filePath);
    
    // اگر مسیر خالی باشد، خارج شو
    if (!filePath) {
      console.log('Empty file path provided');
      return;
    }

    // تبدیل URL به مسیر نسبی
    const relativePath = filePath.split('/uploads/')[1];
    if (!relativePath) {
      console.log('No /uploads/ found in path:', filePath);
      return;
    }

    // ساخت مسیر کامل فایل
    const fullPath = path.join(__dirname, '../../uploads', relativePath);
    console.log('Full path to delete:', fullPath);
    
    // بررسی وجود فایل
    if (fs.existsSync(fullPath)) {
      // حذف فایل
      fs.unlinkSync(fullPath);
      console.log('File successfully deleted:', fullPath);
    } else {
      console.log('File does not exist:', fullPath);
    }
  } catch (error) {
    console.error('Error in deleteFile:', error);
  }
}; 
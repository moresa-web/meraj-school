import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">درباره ما</h3>
                        <p className="text-gray-300">
                            مدرسه معراج، مرکز آموزشی پیشرفته با امکانات مدرن و کادر مجرب
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">دسترسی سریع</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/about" className="text-gray-300 hover:text-white">
                                    درباره ما
                                </Link>
                            </li>
                            <li>
                                <Link to="/news" className="text-gray-300 hover:text-white">
                                    اخبار
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-300 hover:text-white">
                                    تماس با ما
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">تماس با ما</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li>آدرس: مشهد، خیابان معراج</li>
                            <li>تلفن: ۰۵۱-۱۲۳۴۵۶۷۸</li>
                            <li>ایمیل: info@meraj.school</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
                    <p>© {new Date().getFullYear()} مدرسه معراج. تمامی حقوق محفوظ است.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 
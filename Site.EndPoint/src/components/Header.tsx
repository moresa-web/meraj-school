import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-sm">
            <nav className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link to="/" className="text-xl font-bold text-gray-800">
                        مدرسه معراج
                    </Link>
                    <div className="flex items-center space-x-4">
                        <Link to="/about" className="text-gray-600 hover:text-gray-800">
                            درباره ما
                        </Link>
                        <Link to="/news" className="text-gray-600 hover:text-gray-800">
                            اخبار
                        </Link>
                        <Link to="/contact" className="text-gray-600 hover:text-gray-800">
                            تماس با ما
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header; 
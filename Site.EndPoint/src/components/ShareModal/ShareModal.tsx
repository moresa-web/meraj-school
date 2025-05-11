import React, { useState, useEffect } from 'react';

interface NewsItem {
  _id: string;
  title: string;
  description: string;
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  newsItem: NewsItem | null;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, newsItem }) => {
  const [isWebShareSupported, setIsWebShareSupported] = useState(false);

  useEffect(() => {
    setIsWebShareSupported('share' in navigator);
  }, []);

  if (!isOpen || !newsItem) return null;

  const handleWebShare = async () => {
    try {
      await navigator.share({
        title: newsItem.title,
        text: newsItem.description,
        url: `${window.location.origin}/news/${newsItem._id}`
      });
      onClose();
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/news/${newsItem._id}`;
    navigator.clipboard.writeText(url);
    onClose();
  };

  const handleShareSocial = (platform: string) => {
    const url = `${window.location.origin}/news/${newsItem._id}`;
    const title = newsItem.title;
    const text = newsItem.description;

    let shareUrl = '';
    switch (platform) {
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
    }

    window.open(shareUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">اشتراک‌گذاری</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {isWebShareSupported && (
            <button
              onClick={handleWebShare}
              className="flex flex-col items-center p-4 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-colors"
            >
              <svg className="w-8 h-8 mb-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
              </svg>
              <span className="text-sm">اشتراک‌گذاری</span>
            </button>
          )}
          <button
            onClick={() => handleShareSocial('telegram')}
            className="flex flex-col items-center p-4 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
          >
            <svg className="w-8 h-8 mb-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.2-.04-.28-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.29-.49.8-.75 3.12-1.36 5.2-2.26 6.24-2.72 2.95-1.28 3.56-1.5 3.96-1.5.09 0 .28.02.4.09.11.06.18.14.21.24.03.1.04.2.01.32z"/>
            </svg>
            <span className="text-sm">تلگرام</span>
          </button>
          <button
            onClick={() => handleShareSocial('whatsapp')}
            className="flex flex-col items-center p-4 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors"
          >
            <svg className="w-8 h-8 mb-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span className="text-sm">واتساپ</span>
          </button>
          <button
            onClick={() => handleShareSocial('twitter')}
            className="flex flex-col items-center p-4 bg-blue-50 text-blue-400 rounded-xl hover:bg-blue-100 transition-colors"
          >
            <svg className="w-8 h-8 mb-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            <span className="text-sm">توییتر</span>
          </button>
        </div>
        <button
          onClick={handleCopyLink}
          className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
        >
          <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          کپی لینک
        </button>
      </div>
    </div>
  );
};

export default ShareModal; 
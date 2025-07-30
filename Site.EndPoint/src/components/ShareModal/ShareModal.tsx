import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Share2, 
  Copy, 
  Link, 
  MessageSquare, 
  Twitter, 
  Instagram,
  Facebook,
  Mail,
  Check,
  ExternalLink
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'react-hot-toast';

interface NewsItem {
  _id: string;
  title: string;
  description: string;
  slug?: string;
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  newsItem: NewsItem | null;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, newsItem }) => {
  const [isWebShareSupported, setIsWebShareSupported] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsWebShareSupported('share' in navigator);
  }, []);

  const handleWebShare = async () => {
    try {
      await navigator.share({
        title: newsItem?.title || 'دبیرستان معراج',
        text: newsItem?.description || 'مطلب جالبی از دبیرستان معراج',
        url: `${window.location.origin}/news/${newsItem?.slug || newsItem?._id}`
      });
      onClose();
      toast.success('اشتراک‌گذاری با موفقیت انجام شد');
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('خطا در اشتراک‌گذاری');
    }
  };

  const handleCopyLink = async () => {
    try {
      const url = `${window.location.origin}/news/${newsItem?.slug || newsItem?._id}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('لینک کپی شد');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying link:', error);
      toast.error('خطا در کپی کردن لینک');
    }
  };

  const handleShareSocial = (platform: string) => {
    const url = `${window.location.origin}/news/${newsItem?.slug || newsItem?._id}`;
    const title = newsItem?.title || 'دبیرستان معراج';
    const text = newsItem?.description || 'مطلب جالبی از دبیرستان معراج';

    let shareUrl = '';
    switch (platform) {
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${title}\n${text}\n${url}`)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct sharing via URL, so we'll copy the link
        handleCopyLink();
        return;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`;
        break;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
    onClose();
    toast.success(`اشتراک‌گذاری در ${platform} انجام شد`);
  };

  const shareOptions = [
    {
      id: 'web-share',
      label: 'اشتراک‌گذاری',
      icon: Share2,
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'from-purple-600 to-purple-700',
      onClick: handleWebShare,
      show: isWebShareSupported
    },
    {
      id: 'telegram',
      label: 'تلگرام',
      icon: MessageSquare,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'from-blue-600 to-blue-700',
      onClick: () => handleShareSocial('telegram'),
      show: true
    },
    {
      id: 'whatsapp',
      label: 'واتساپ',
      icon: MessageSquare,
      color: 'from-green-500 to-green-600',
      hoverColor: 'from-green-600 to-green-700',
      onClick: () => handleShareSocial('whatsapp'),
      show: true
    },
    {
      id: 'twitter',
      label: 'توییتر',
      icon: Twitter,
      color: 'from-blue-400 to-blue-500',
      hoverColor: 'from-blue-500 to-blue-600',
      onClick: () => handleShareSocial('twitter'),
      show: true
    },
    {
      id: 'facebook',
      label: 'فیسبوک',
      icon: Facebook,
      color: 'from-blue-600 to-blue-700',
      hoverColor: 'from-blue-700 to-blue-800',
      onClick: () => handleShareSocial('facebook'),
      show: true
    },
    {
      id: 'instagram',
      label: 'اینستاگرام',
      icon: Instagram,
      color: 'from-pink-500 to-purple-500',
      hoverColor: 'from-pink-600 to-purple-600',
      onClick: () => handleShareSocial('instagram'),
      show: true
    },
    {
      id: 'email',
      label: 'ایمیل',
      icon: Mail,
      color: 'from-gray-500 to-gray-600',
      hoverColor: 'from-gray-600 to-gray-700',
      onClick: () => handleShareSocial('email'),
      show: true
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <Card className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-gray-700 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    اشتراک‌گذاری
                  </CardTitle>
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 rounded-full p-2"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                {/* News Preview */}
                {newsItem && (
                  <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <h4 className="text-white font-semibold text-sm mb-2 line-clamp-2">
                      {newsItem.title}
                    </h4>
                    <p className="text-gray-300 text-xs line-clamp-3">
                      {newsItem.description}
                    </p>
                  </div>
                )}

                {/* Share Options Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {shareOptions.filter(option => option.show).map((option) => (
                    <Button
                      key={option.id}
                      onClick={option.onClick}
                      className={`flex flex-col items-center p-4 h-auto bg-gradient-to-br ${option.color} hover:${option.hoverColor} text-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg`}
                    >
                      <option.icon className="w-6 h-6 mb-2" />
                      <span className="text-xs font-medium">{option.label}</span>
                    </Button>
                  ))}
                </div>

                {/* Copy Link Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <Link className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-300 text-xs truncate">
                        {`${window.location.origin}/news/${newsItem?.slug || newsItem?._id}`}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleCopyLink}
                    className={`w-full h-12 text-lg font-semibold transition-all duration-300 ${
                      copied
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5 ml-2" />
                        کپی شد!
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5 ml-2" />
                        کپی لینک
                      </>
                    )}
                  </Button>
                </div>

                {/* Additional Info */}
                <div className="mt-4 text-center">
                  <p className="text-gray-400 text-xs">
                    این مطلب را با دوستان خود به اشتراک بگذارید
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal; 
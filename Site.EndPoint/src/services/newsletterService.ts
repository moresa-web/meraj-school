import api from './api';

interface SubscriptionResponse {
  success: boolean;
  message: string;
}

export const newsletterService = {
  /**
   * اشتراک در خبرنامه با ارسال ایمیل
   * @param email ایمیل کاربر
   * @returns پاسخ سرور
   */
  subscribe: async (email: string): Promise<SubscriptionResponse> => {
    const response = await api.post('/newsletter/subscribe', { email });
    return response.data;
  },

  /**
   * لغو اشتراک از خبرنامه
   * @param email ایمیل کاربر
   * @returns پاسخ سرور
   */
  unsubscribe: async (email: string): Promise<SubscriptionResponse> => {
    const response = await api.post('/newsletter/unsubscribe', { email });
    return response.data;
  }
}; 
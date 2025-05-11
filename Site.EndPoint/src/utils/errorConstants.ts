export const ERROR_MESSAGES = {
  NETWORK: {
    NO_RESPONSE: 'خطا در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید.',
    TIMEOUT: 'زمان اتصال به سرور به پایان رسید. لطفاً دوباره تلاش کنید.',
    CONNECTION_REFUSED: 'اتصال به سرور رد شد. لطفاً دوباره تلاش کنید.'
  },
  VALIDATION: {
    INVALID_INPUT: 'ورودی نامعتبر است. لطفاً اطلاعات را بررسی کنید.',
    REQUIRED_FIELD: 'این فیلد الزامی است.',
    INVALID_FORMAT: 'فرمت وارد شده صحیح نیست.',
    MIN_LENGTH: 'تعداد کاراکترها کمتر از حد مجاز است.',
    MAX_LENGTH: 'تعداد کاراکترها بیشتر از حد مجاز است.',
    INVALID_EMAIL: 'آدرس ایمیل نامعتبر است.',
    INVALID_PHONE: 'شماره تلفن نامعتبر است.',
    INVALID_PASSWORD: 'رمز عبور باید حداقل 8 کاراکتر و شامل حروف و اعداد باشد.',
    PASSWORDS_NOT_MATCH: 'رمز عبور و تکرار آن مطابقت ندارند.'
  },
  AUTH: {
    UNAUTHORIZED: 'لطفاً وارد حساب کاربری خود شوید.',
    FORBIDDEN: 'شما دسترسی به این بخش را ندارید.',
    INVALID_CREDENTIALS: 'نام کاربری یا رمز عبور اشتباه است.',
    SESSION_EXPIRED: 'نشست شما منقضی شده است. لطفاً دوباره وارد شوید.',
    ACCOUNT_LOCKED: 'حساب کاربری شما قفل شده است. لطفاً با پشتیبانی تماس بگیرید.',
    INVALID_TOKEN: 'توکن نامعتبر است. لطفاً دوباره وارد شوید.'
  },
  SERVER: {
    INTERNAL: 'خطای سرور. لطفاً بعداً تلاش کنید.',
    NOT_FOUND: 'منبع مورد نظر یافت نشد.',
    SERVICE_UNAVAILABLE: 'سرویس در حال حاضر در دسترس نیست. لطفاً بعداً تلاش کنید.',
    UNKNOWN: 'خطای ناشناخته رخ داده است. لطفاً با پشتیبانی تماس بگیرید.'
  },
  GENERAL: {
    UNKNOWN: 'خطای ناشناخته رخ داده است.',
    RETRY: 'لطفاً دوباره تلاش کنید.',
    CONTACT_SUPPORT: 'لطفاً با پشتیبانی تماس بگیرید.'
  }
};

export const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
}; 
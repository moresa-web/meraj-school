import { useRouter } from 'next/navigation';

const EmailTemplatesPage = () => {
  const router = useRouter();

  return (
    <div>
      <button
        onClick={() => router.push('/dashboard/email-templates/new')}
        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
      >
        افزودن قالب جدید
      </button>
    </div>
  );
};

export default EmailTemplatesPage; 
import { useState } from "react"

export default function ContactForm() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    })
    const [sending, setSending] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSending(true)

        try {
            const res = await fetch("http://localhost:5000/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    subject: form.subject,
                    message: form.message
                })
            })

            if (!res.ok) throw new Error("خطا در ارسال پیام")

            setSuccess(true)
            setForm({ name: "", email: "", subject: "", message: "" })
        } catch (err) {
            console.error(err)
            alert("ارسال پیام با خطا مواجه شد.")
        } finally {
            setSending(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    نام و نام خانوادگی
                </label>
                <input
                    type="text"
                    id="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                    placeholder="نام خود را وارد کنید"
                    required
                />
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    ایمیل
                </label>
                <input
                    type="email"
                    id="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                    placeholder="ایمیل خود را وارد کنید"
                    required
                />
            </div>

            <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    موضوع
                </label>
                <input
                    type="text"
                    id="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                    placeholder="موضوع پیام خود را وارد کنید"
                />
            </div>

            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    پیام
                </label>
                <textarea
                    id="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                    placeholder="پیام خود را وارد کنید"
                    required
                ></textarea>
            </div>

            <button
                type="submit"
                disabled={sending}
                className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
                {sending ? "در حال ارسال..." : "ارسال پیام"}
            </button>

            {success && (
                <p className="text-green-600 text-sm mt-2">
                    پیام شما با موفقیت ارسال شد.
                </p>
            )}
        </form>
    )
}

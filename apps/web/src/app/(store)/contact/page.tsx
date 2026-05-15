import { Metadata } from 'next';
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, Linkedin, Facebook, Music2, Instagram } from 'lucide-react';
import { STORE_PHONE, STORE_EMAIL, STORE_WHATSAPP_SUPPORT, STORE_LINKEDIN, STORE_FACEBOOK, STORE_TIKTOK, STORE_INSTAGRAM } from '@/lib/constants';

export const metadata: Metadata = {
    title: 'تواصل معنا — الديرة باك',
    description: 'نحن هنا لمساعدتكم في أي وقت. تواصلوا معنا للاستفسارات، الشكاوى، أو طلبات الجملة في الكويت.',
};

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-slate-50">
            {/* ── HEADER ── */}
            <section className="bg-white py-20 lg:py-28 text-center border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4">
                    <span className="inline-block bg-brand-50 text-brand-600 text-xs font-black px-4 py-2 rounded-full mb-6 uppercase tracking-widest">متاحون 24/7</span>
                    <h1 className="text-4xl lg:text-6xl font-black text-gray-900 mb-6">يسعدنا <span className="text-brand-600">التواصل</span> معكم</h1>
                    <p className="text-gray-500 font-bold max-w-2xl mx-auto text-lg leading-relaxed">
                        دائماً ما نضع عملاءنا في المقدمة. سواء كان لديكم استفسار عن منتج، شكوى، أو اقتراح — فريق الديرة باك في انتظاركم.
                    </p>
                </div>
            </section>

            <section className="py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

                        {/* ── CONTACT INFO (5/12) ── */}
                        <div className="lg:col-span-12 xl:col-span-5 space-y-8">
                            <h2 className="text-3xl font-black text-gray-900 mb-8">معلومات الاتصال</h2>

                            <div className="space-y-6">
                                {/* WhatsApp Card - Most Important in KW */}
                                <a
                                    href={STORE_WHATSAPP_SUPPORT}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-6 p-8 bg-green-50 rounded-[2.5rem] border border-green-100 hover:shadow-xl hover:shadow-green-100/50 transition-all group"
                                >
                                    <div className="w-16 h-16 bg-white text-green-500 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                        <MessageCircle className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">الأسرع دائماً</p>
                                        <h3 className="text-xl font-black text-gray-900">واتساب — شكاوى واقتراحات</h3>
                                        <p className="text-sm text-gray-500 font-bold mt-1" dir="ltr">+965 65668003</p>
                                    </div>
                                </a>

                                {/* Phone & Email Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-lg transition-all">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-6">
                                            <Phone className="w-6 h-6" />
                                        </div>
                                        <h4 className="font-black text-gray-900 mb-2">اتصل بنا</h4>
                                        <p className="text-sm font-bold text-gray-500" dir="ltr">{STORE_PHONE}</p>
                                    </div>
                                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-lg transition-all">
                                        <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center mb-6">
                                            <Mail className="w-6 h-6" />
                                        </div>
                                        <h4 className="font-black text-gray-900 mb-2">راسلنا</h4>
                                        <p className="text-sm font-bold text-gray-500 truncate">{STORE_EMAIL}</p>
                                    </div>
                                </div>

                                {/* Location & Hours */}
                                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl" />
                                    <div className="flex flex-col gap-6 relative z-10">
                                        <div className="flex items-start gap-4">
                                            <MapPin className="w-5 h-5 text-brand-500 mt-1" />
                                            <div>
                                                <h4 className="font-black mb-1">موقعنا في الكويت</h4>
                                                <p className="text-sm text-gray-400 font-bold">منطقة الشويخ الصناعية، شارع كندا دراي، الكويت.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <Clock className="w-5 h-5 text-brand-500 mt-1" />
                                            <div>
                                                <h4 className="font-black mb-1">ساعات العمل</h4>
                                                <p className="text-sm text-gray-400 font-bold">السبت — الخميس: 8 صباحاً — 10 مساءً</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── CONTACT FORM (7/12) ── */}
                        <div className="lg:col-span-12 xl:col-span-7">
                            <div className="bg-white rounded-[3rem] p-8 lg:p-12 shadow-xl border border-gray-50">
                                <h2 className="text-3xl font-black text-gray-900 mb-8">أرسل لنا رسالة</h2>
                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-600 mr-2">الاسم الكامل</label>
                                            <input type="text" className="input bg-slate-50 border-transparent focus:bg-white" placeholder="أحمد الكويتي" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-600 mr-2">رقم الجوال</label>
                                            <input type="tel" className="input bg-slate-50 border-transparent focus:bg-white" placeholder="9XXXXXXX" dir="ltr" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-600 mr-2">الموضوع</label>
                                        <select className="input bg-slate-50 border-transparent focus:bg-white">
                                            <option>استفسار عام</option>
                                            <option>طلب خاص أو جملة</option>
                                            <option>شكوى أو اقتراح</option>
                                            <option>أخرى</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-600 mr-2">تفاصيل الرسالة</label>
                                        <textarea rows={6} className="input bg-slate-50 border-transparent focus:bg-white resize-none" placeholder="كيف يمكننا مساعدتك اليوم؟"></textarea>
                                    </div>

                                    <button type="button" className="btn-primary w-full h-16 !rounded-2xl text-lg flex items-center justify-center gap-3 active:scale-95 group">
                                        <Send className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                        <span>إرسال الطلب</span>
                                    </button>

                                    <p className="text-center text-xs text-gray-400 font-bold mt-4">
                                        سيتم التعامل مع بياناتك بكل خصوصية وسنرد عليك في أقرب وقت.
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SOCIAL MEDIA SECTION ── */}
            <section className="bg-white py-20 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <span className="inline-block bg-brand-50 text-brand-600 text-xs font-black px-4 py-2 rounded-full mb-4 uppercase tracking-widest">ابقَ على تواصل</span>
                        <h2 className="text-3xl font-black text-gray-900">تابعنا على <span className="text-brand-600">السوشيال ميديا</span></h2>
                        <p className="text-gray-500 font-bold mt-3">آخر العروض والمنتجات الجديدة — لا تفوّتها</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">

                        {/* LinkedIn */}
                        <a
                            href={STORE_LINKEDIN}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center gap-4 p-8 bg-[#EBF3FB] rounded-[2.5rem] border border-[#cce0f5] hover:shadow-xl hover:shadow-blue-100/60 transition-all group"
                        >
                            <div className="w-16 h-16 bg-[#0A66C2] text-white rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                <Linkedin className="w-8 h-8" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-lg font-black text-gray-900">LinkedIn</h3>
                                <p className="text-xs font-bold text-[#0A66C2] mt-1">تابع صفحتنا المهنية</p>
                            </div>
                        </a>

                        {/* Facebook */}
                        <a
                            href={STORE_FACEBOOK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center gap-4 p-8 bg-[#EBF0FA] rounded-[2.5rem] border border-[#c8d8f8] hover:shadow-xl hover:shadow-blue-100/60 transition-all group"
                        >
                            <div className="w-16 h-16 bg-[#1877F2] text-white rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                <Facebook className="w-8 h-8" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-lg font-black text-gray-900">Facebook</h3>
                                <p className="text-xs font-bold text-[#1877F2] mt-1">أعجبك صفحتنا على فيسبوك</p>
                            </div>
                        </a>

                        {/* TikTok */}
                        <a
                            href={STORE_TIKTOK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center gap-4 p-8 bg-gray-50 rounded-[2.5rem] border border-gray-200 hover:shadow-xl hover:shadow-gray-200/60 transition-all group"
                        >
                            <div className="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                <Music2 className="w-8 h-8" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-lg font-black text-gray-900">TikTok</h3>
                                <p className="text-xs font-bold text-gray-600 mt-1">شاهد مقاطعنا على تيك توك</p>
                            </div>
                        </a>

                        {/* Instagram */}
                        <a
                            href={STORE_INSTAGRAM}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center gap-4 p-8 bg-[#FDF0F7] rounded-[2.5rem] border border-[#f5c6e8] hover:shadow-xl hover:shadow-pink-100/60 transition-all group"
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] text-white rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                <Instagram className="w-8 h-8" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-lg font-black text-gray-900">Instagram</h3>
                                <p className="text-xs font-bold text-[#e1306c] mt-1">تابعنا على إنستغرام</p>
                            </div>
                        </a>

                    </div>
                </div>
            </section>
        </main>
    );
}

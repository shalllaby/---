'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Heart, ExternalLink } from 'lucide-react';
import {
    STORE_NAME, STORE_WHATSAPP, STORE_INSTAGRAM,
    PAYMENT_METHODS_KW, KUWAIT_GOVERNORATES,
} from '@/lib/constants';

const FOOTER_LINKS = {
    shop: [
        { href: '/products', label: 'جميع المنتجات' },
        { href: '/products?featured=true', label: 'العروض الخاصة' },
        { href: '/categories', label: 'التصنيفات' },
    ],
    info: [
        { href: '/about', label: 'من نحن' },
        { href: '/contact', label: 'تواصل معنا' },
        { href: '/faq', label: 'الأسئلة الشائعة' },
        { href: '/returns', label: 'سياسة الإرجاع' },
    ],
    legal: [
        { href: '/privacy', label: 'سياسة الخصوصية' },
        { href: '/terms', label: 'الشروط والأحكام' },
    ],
};

const COMPANIES = [
    { name: 'انهار الديرة', emoji: '⭐' },
    { name: 'البراق باك', emoji: '🔷' },
    { name: 'شموخ الديرة', emoji: '🔷' },
    { name: 'خير الديرة', emoji: '🔷' },
    { name: 'الديرة باك', emoji: '🔷' },
];

export default function Footer() {
    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                .footer-root {
                    font-family: var(--font-cairo, 'Cairo'), sans-serif;
                    direction: rtl;
                    background: linear-gradient(180deg, #0f172a 0%, #1e3a8a 100%);
                    color: #e2e8f0;
                    margin-top: 0;
                    position: relative;
                    overflow: hidden;
                }

                /* Ambient orbs */
                .footer-root::before {
                    content: '';
                    position: absolute;
                    width: 600px; height: 600px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 70%);
                    top: -200px; right: -150px;
                    pointer-events: none;
                }
                .footer-root::after {
                    content: '';
                    position: absolute;
                    width: 400px; height: 400px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(251, 207, 51, 0.1) 0%, transparent 70%);
                    bottom: 0; left: -100px;
                    pointer-events: none;
                }

                /* ── TOP WAVE ── */
                .footer-wave {
                    display: block;
                    width: 100%;
                    margin-bottom: -2px;
                }

                /* ── CTA STRIP ── */
                .footer-cta-strip {
                    background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 40%, #1e40af 100%);
                    padding: 40px 24px;
                    text-align: center;
                    position: relative;
                    z-index: 2;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }
                .footer-cta-strip h3 {
                    font-size: 1.4rem;
                    font-weight: 900;
                    color: #fbcf33;
                    margin-bottom: 6px;
                }
                .footer-cta-strip p {
                    font-size: 0.9rem;
                    color: rgba(255,255,255,0.8);
                    margin-bottom: 20px;
                }
                .footer-cta-btns {
                    display: flex;
                    justify-content: center;
                    gap: 12px;
                    flex-wrap: wrap;
                }
                .footer-cta-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 11px 24px;
                    border-radius: 12px;
                    font-family: 'Cairo', sans-serif;
                    font-weight: 700;
                    font-size: 0.9rem;
                    text-decoration: none;
                    transition: all 0.25s ease;
                }
                .footer-cta-btn.wa {
                    background: #25D366;
                    color: white;
                    box-shadow: 0 4px 20px rgba(37,211,102,0.3);
                }
                .footer-cta-btn.wa:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(37,211,102,0.4); }
                .footer-cta-btn.ig {
                    background: rgba(255,255,255,0.12);
                    border: 1.5px solid rgba(255,255,255,0.25);
                    color: white;
                    backdrop-filter: blur(8px);
                }
                .footer-cta-btn.ig:hover { background: rgba(255,255,255,0.2); transform: translateY(-2px); }

                /* ── MAIN GRID ── */
                .footer-main {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 56px 24px 40px;
                    display: grid;
                    grid-template-columns: 1.5fr 0.8fr 0.8fr 1fr 1.3fr;
                    gap: 32px;
                    position: relative;
                    z-index: 2;
                }
                @media (max-width: 1024px) {
                    .footer-main { grid-template-columns: 1fr 1fr; gap: 36px; }
                }
                @media (max-width: 640px) {
                    .footer-main { grid-template-columns: 1fr; gap: 32px; }
                }

                /* Brand Column */
                .footer-brand-logo {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    margin-bottom: 20px;
                }
                .footer-logo-ring {
                    position: relative;
                    width: 56px; height: 56px;
                    flex-shrink: 0;
                }
                .footer-logo-ring::before {
                    content: '';
                    position: absolute;
                    inset: -2px;
                    border-radius: 50%;
                    background: conic-gradient(from 0deg, #fbcf33, #3b82f6, #fbcf33);
                    animation: footerSpin 5s linear infinite;
                }
                .footer-logo-ring::after {
                    content: '';
                    position: absolute;
                    inset: 2px;
                    border-radius: 50%;
                    background: white;
                    z-index: 1;
                }
                .footer-logo-img {
                    position: absolute;
                    inset: 4px;
                    border-radius: 50%;
                    z-index: 2;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 4px;
                    background: white;
                }
                @keyframes footerSpin { to { transform: rotate(360deg); } }
                .footer-brand-name {
                    font-size: 1.15rem;
                    font-weight: 900;
                    color: white;
                    line-height: 1.2;
                }
                .footer-brand-sub {
                    font-size: 0.75rem;
                    color: #fbcf33;
                    font-weight: 600;
                }
                .footer-tagline {
                    font-size: 0.88rem;
                    color: #94A3B8;
                    line-height: 1.8;
                    margin-bottom: 24px;
                    border-right: 2px solid rgba(139,92,246,0.4);
                    padding-right: 12px;
                }
                .footer-location {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.82rem;
                    color: #94A3B8;
                    margin-bottom: 20px;
                }
                .footer-location-icon {
                    width: 28px; height: 28px;
                    border-radius: 8px;
                    background: rgba(91,45,142,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                /* Companies list */
                .companies-label {
                    font-size: 0.72rem;
                    font-weight: 800;
                    color: #7B4FBB;
                    letter-spacing: 0.8px;
                    text-transform: uppercase;
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .companies-label::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: rgba(123,79,187,0.3);
                }
                .company-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 7px 10px;
                    border-radius: 10px;
                    transition: background 0.2s ease;
                    margin-bottom: 4px;
                    text-decoration: none;
                }
                .company-row:hover { background: rgba(255,255,255,0.04); }
                .company-row-left { display: flex; align-items: center; gap: 8px; }
                .company-dot {
                    width: 6px; height: 6px;
                    border-radius: 50%;
                    background: #7B4FBB;
                    flex-shrink: 0;
                }
                .company-dot.main { background: #A78BFA; width: 8px; height: 8px; box-shadow: 0 0 6px rgba(167,139,250,0.6); }
                .company-name { font-size: 0.82rem; font-weight: 700; color: #CBD5E1; }
                .company-name.main { color: white; }
                .company-phone {
                    font-size: 0.75rem;
                    color: #64748B;
                    direction: ltr;
                    font-weight: 600;
                    transition: color 0.2s;
                }
                .company-row:hover .company-phone { color: #A78BFA; }

                /* Links columns */
                .footer-col-title {
                    font-size: 0.82rem;
                    font-weight: 800;
                    color: white;
                    letter-spacing: 0.5px;
                    margin-bottom: 18px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .footer-col-title::before {
                    content: '';
                    width: 3px; height: 16px;
                    border-radius: 2px;
                    background: linear-gradient(180deg, #fbcf33, #eab308);
                    flex-shrink: 0;
                }
                .footer-link {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.85rem;
                    color: #94a3b8;
                    text-decoration: none;
                    padding: 5px 0;
                    transition: all 0.2s ease;
                    border-radius: 6px;
                }
                .footer-link::before {
                    content: '•';
                    color: #fbcf33;
                    font-weight: 700;
                    font-size: 1.2rem;
                    transition: color 0.2s, transform 0.2s;
                }
                .footer-link:hover { color: white; padding-right: 4px; }
                .footer-link:hover::before { color: #fbcf33; }

                /* Coverage + Payment */
                .gov-grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                    margin-bottom: 24px;
                }
                .gov-tag {
                    font-size: 0.72rem;
                    font-weight: 600;
                    color: #94A3B8;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    padding: 4px 10px;
                    border-radius: 100px;
                    transition: all 0.2s ease;
                    cursor: default;
                }
                .gov-tag:hover {
                    background: rgba(139,92,246,0.15);
                    border-color: rgba(139,92,246,0.3);
                    color: #C4B5FD;
                }
                .payment-grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                }
                .payment-tag {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: #CBD5E1;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    padding: 6px 12px;
                    border-radius: 10px;
                    transition: all 0.2s ease;
                }
                .payment-tag:hover {
                    background: rgba(91,45,142,0.25);
                    border-color: rgba(139,92,246,0.4);
                }

                /* ── DIVIDER ── */
                .footer-divider {
                    max-width: 1200px;
                    margin: 0 auto;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(139,92,246,0.3), rgba(65,105,225,0.3), transparent);
                    position: relative;
                    z-index: 2;
                }

                /* ── BOTTOM BAR ── */
                .footer-bottom {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px 24px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    flex-wrap: wrap;
                    position: relative;
                    z-index: 2;
                }
                .footer-copy {
                    font-size: 0.78rem;
                    color: #475569;
                }
                .footer-copy span { color: #7B4FBB; font-weight: 700; }
                .footer-made {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 0.78rem;
                    color: #475569;
                }
                .footer-legal-links {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                .footer-legal-link {
                    font-size: 0.78rem;
                    color: #475569;
                    text-decoration: none;
                    transition: color 0.2s;
                }
                .footer-legal-link:hover { color: #A78BFA; }

                /* ── BOTTOM ACCENT LINE ── */
                .footer-accent-line {
                    height: 3px;
                    background: linear-gradient(90deg, #1e3a8a, #fbcf33, #3b82f6, #fbcf33, #1e3a8a);
                    background-size: 200% 100%;
                    animation: shimmer 4s linear infinite;
                }
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            ` }} />

            {/* Top wave transition */}
            < svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="footer-wave" style={{ background: '#F8F6FF', display: 'block' }
            }>
                <path d="M0 80 C360 20 720 60 1080 20 C1260 0 1380 40 1440 30 L1440 80 L0 80Z" fill="#0F0626" />
            </svg >

            <footer className="footer-root">

                {/* ── CTA STRIP ── */}
                <div className="footer-cta-strip">
                    <div style={{ maxWidth: 600, margin: '0 auto' }}>
                        <h3>تواصل معنا مباشرة</h3>
                        <p>نحن هنا لخدمتك — تواصل معنا عبر واتساب أو تابعنا على إنستغرام</p>
                        <div className="footer-cta-btns">
                            <a href={STORE_WHATSAPP} target="_blank" rel="noopener noreferrer" className="footer-cta-btn wa">
                                💬 واتساب
                            </a>
                            <a href={STORE_INSTAGRAM} target="_blank" rel="noopener noreferrer" className="footer-cta-btn ig">
                                📸 إنستغرام
                            </a>
                        </div>
                    </div>
                </div>

                {/* ── MAIN GRID ── */}
                <div className="footer-main">

                    {/* ① Brand + Companies */}
                    <div>
                        {/* Logo */}
                        <div className="footer-brand-logo">
                            <div className="footer-logo-ring">
                                <div className="footer-logo-img">
                                    <Image src="/logo-2.webp" alt={STORE_NAME} width={36} height={36} className="object-contain" />
                                </div>
                            </div>
                            <div>
                                <div className="footer-brand-name">{STORE_NAME}</div>
                                <div className="footer-brand-sub">Anhar AL-Deera</div>
                            </div>
                        </div>

                        {/* Tagline */}
                        <p className="footer-tagline">
                            حرصنا على توفير أكبر تشكيلة من منتجات ومستلزمات المنزل العصري والنظافة تحت سقف واحد — لخدمة أهل الديرة.
                        </p>

                        {/* Location */}
                        <div className="footer-location">
                            <div className="footer-location-icon">
                                <MapPin size={14} color="#A78BFA" />
                            </div>
                            نوصّل لجميع محافظات الكويت 🇰🇼
                        </div>

                        {/* Companies */}
                        <div className="companies-label">مجموعة شركاتنا</div>
                        {COMPANIES.map((c) => (
                            <div key={c.name} className="company-row" style={{ cursor: 'default' }}>
                                <div className="company-row-left">
                                    <div className={`company-dot ${c.name === 'انهار الديرة' ? 'main' : ''}`} />
                                    <div>
                                        <div className={`company-name ${c.name === 'انهار الديرة' ? 'main' : ''}`}>{c.name}</div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* General Contact */}
                        <div className="companies-label" style={{ marginTop: 20 }}>للتواصل مع مسؤولي المجموعة</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            <a href="tel:60008807" style={{ fontSize: '0.8rem', color: '#A78BFA', textDecoration: 'none', direction: 'ltr' }}>60008807</a>
                            <span style={{ color: '#475569' }}>|</span>
                            <a href="tel:60048631" style={{ fontSize: '0.8rem', color: '#A78BFA', textDecoration: 'none', direction: 'ltr' }}>60048631</a>
                            <span style={{ color: '#475569' }}>|</span>
                            <a href="tel:65668003" style={{ fontSize: '0.8rem', color: '#A78BFA', textDecoration: 'none', direction: 'ltr' }}>65668003</a>
                        </div>
                    </div>

                    {/* ② Shop Links */}
                    <div>
                        <div className="footer-col-title">التسوق</div>
                        {FOOTER_LINKS.shop.map((l) => (
                            <Link key={l.href} href={l.href} className="footer-link" style={{ display: 'flex' }}>
                                {l.label}
                            </Link>
                        ))}
                    </div>

                    {/* ③ Info Links */}
                    <div>
                        <div className="footer-col-title">معلومات</div>
                        {FOOTER_LINKS.info.map((l) => (
                            <Link key={l.href} href={l.href} className="footer-link" style={{ display: 'flex' }}>
                                {l.label}
                            </Link>
                        ))}
                    </div>

                    {/* ④ Management */}
                    <div>
                        <div className="footer-col-title">الإدارة</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#CBD5E1' }}>أ. أحمد اسماعيل</div>
                                <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginBottom: '2px' }}>رئيس مجلس الإدارة</div>
                                <a href="tel:60008807" style={{ fontSize: '0.78rem', color: '#A78BFA', textDecoration: 'none', direction: 'ltr', display: 'inline-block', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#fff'} onMouseOut={(e) => e.currentTarget.style.color = '#A78BFA'}>60008807</a>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#CBD5E1' }}>م/ وليد عيسى</div>
                                <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginBottom: '2px' }}>المدير التنفيذي للتصميم</div>
                                <a href="tel:60048631" style={{ fontSize: '0.78rem', color: '#A78BFA', textDecoration: 'none', direction: 'ltr', display: 'inline-block', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#fff'} onMouseOut={(e) => e.currentTarget.style.color = '#A78BFA'}>60048631</a>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#CBD5E1' }}>م/ محمد شلبي</div>
                                <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginBottom: '2px' }}>الدعم الفني والصيانة</div>
                                <a href="tel:+201094775924" style={{ fontSize: '0.78rem', color: '#A78BFA', textDecoration: 'none', direction: 'ltr', display: 'inline-block', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#fff'} onMouseOut={(e) => e.currentTarget.style.color = '#A78BFA'}>+201094775924</a>
                            </div>
                        </div>
                    </div>

                    {/* ⑤ Coverage + Payment */}
                    <div>
                        <div className="footer-col-title">التغطية</div>
                        <div className="gov-grid">
                            {KUWAIT_GOVERNORATES.map((gov) => (
                                <span key={gov.value} className="gov-tag">{gov.nameAr}</span>
                            ))}
                        </div>

                        <div className="footer-col-title" style={{ marginTop: 8 }}>طرق الدفع</div>
                        <div className="payment-grid">
                            {PAYMENT_METHODS_KW.map((pm) => (
                                <span key={pm.id} className="payment-tag" title={pm.desc}>
                                    {pm.emoji} {pm.nameAr}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── DIVIDER ── */}
                <div className="footer-divider" />

                {/* ── BOTTOM BAR ── */}
                <div className="footer-bottom">
                    <p className="footer-copy">
                        <span>©</span> 2025 انهار الديرة — جميع الحقوق محفوظة
                    </p>
                    <div className="footer-made">
                        <span>صُنع بـ</span>
                        <Heart size={12} fill="#E040FB" color="#E040FB" />
                        <span>في الكويت 🇰🇼</span>
                    </div>
                    <div className="footer-legal-links">
                        {FOOTER_LINKS.legal.map((l) => (
                            <Link key={l.href} href={l.href} className="footer-legal-link">
                                {l.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ── ANIMATED BOTTOM LINE ── */}
                <div className="footer-accent-line" />
            </footer>
        </>
    );
}
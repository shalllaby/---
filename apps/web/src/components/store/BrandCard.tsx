import Link from 'next/link';
import Image from 'next/image';

export default function BrandCard() {
    return (
        <div
            dir="rtl"
            style={{
                width: '100%',
                background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #1d4ed8 100%)',
                position: 'relative',
                overflow: 'hidden',
                fontFamily: "'Cairo', 'Tajawal', sans-serif",
                borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}
        >
            {/* Subtle orb overlays for background texture */}
            <div style={{
                position: 'absolute', top: -120, right: -60,
                width: 400, height: 400, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', bottom: -120, left: 80,
                width: 350, height: 350, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(251, 207, 51, 0.08) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />

            {/* Inner Container */}
            <div style={{
                maxWidth: '74rem',
                margin: '0 auto',
                padding: '56px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '32px',
                position: 'relative',
                zIndex: 1,
            }}
                className="flex-col md:flex-row text-center md:text-right"
            >
                {/* Brand Info (Left/Start) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="flex-col md:flex-row">
                    {/* Logo */}
                    <div
                        className="w-20 h-20 md:w-[110px] md:h-[110px] flex-shrink-0"
                        style={{
                            borderRadius: '28px',
                            background: 'white',
                            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 12,
                            transform: 'rotate(-4deg)'
                        }}>
                        <Image
                            src="/logo-2.webp"
                            alt="أنهار الديرة"
                            width={80}
                            height={80}
                            style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                            priority
                        />
                    </div>

                    {/* Text */}
                    <div>
                        <h1
                            className="text-4xl md:text-[3.5rem] font-black text-white mb-3 leading-none tracking-tight"
                            style={{ textShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        >
                            أنهار الديرة
                        </h1>
                        <p className="text-lg md:text-xl leading-relaxed font-semibold" style={{ color: 'rgba(255,255,255,0.95)', maxWidth: '520px' }}>
                            أكبر تشكيلة من منتجات المنزل والنظافة — خامات آمنة، مواد حلال معتمدة، تحت سقف واحد لخدمة أهل الديرة.
                        </p>
                    </div>
                </div>

                {/* CTA Button (Right/End) */}
                <Link
                    href="/products"
                    className="hover:-translate-y-1 hover:shadow-2xl active:scale-95 group"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 12,
                        background: '#fbcf33',
                        color: '#1e3a8a',
                        fontWeight: 900,
                        fontSize: '1.2rem',
                        padding: '20px 48px',
                        borderRadius: '24px',
                        textDecoration: 'none',
                        boxShadow: '0 12px 30px rgba(251, 207, 51, 0.2)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        flexShrink: 0,
                        whiteSpace: 'nowrap'
                    }}
                >
                    تسوّق الآن
                    <svg className="transition-transform group-hover:scale-125" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}


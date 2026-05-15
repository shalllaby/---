/**
 * أنهار الديرة — Anhar Al-Deera
 * Shared constants for Kuwait market localization.
 * Import from '@/lib/constants' in any component or page.
 */

// ── Brand ─────────────────────────────────────────────────────────────────
export const STORE_NAME = 'انهار الديرة';
export const STORE_NAME_EN = 'Anhar AL-Deera';
export const STORE_TAGLINE = 'تحت سقف الديرة — كل ما تحتاج';
export const STORE_EMAIL = 'bakaldayruh@gmail.com';
export const STORE_PHONE = '+965 51625057';
export const STORE_WHATSAPP = 'https://wa.me/96551625057';
export const STORE_WHATSAPP_SUPPORT = 'https://wa.me/96565668003'; // شكاوى واقتراحات
export const STORE_INSTAGRAM = 'https://www.instagram.com/dert.na2026';
export const STORE_LINKEDIN = 'https://www.linkedin.com/in/aldayruh-bak-8a38ab3b0?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app';
export const STORE_FACEBOOK = 'https://www.facebook.com/share/1arCVHQanf/?mibextid=wwXIfr';
export const STORE_TIKTOK = 'https://www.tiktok.com/@ysyl6144d8b?_r=1&_t=ZS-96DTBgFgtIy';

// ── Currency ──────────────────────────────────────────────────────────────
export const CURRENCY = 'KWD';
export const CURRENCY_SYMBOL = 'د.ك';
export const LOCALE = 'ar-KW';

/** Format a KWD amount Arabic-style: e.g. 12.500 → "12.500 د.ك" */
export function formatKwd(amount: number): string {
    return `${amount.toLocaleString(LOCALE, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
    })} ${CURRENCY_SYMBOL}`;
}

// ── Shipping ──────────────────────────────────────────────────────────────
export const FREE_SHIPPING_THRESHOLD_KWD = 10;
export const COD_FEE_KWD = 0.500;
/** Instant delivery is unavailable after this hour (24h format, Kuwait time) */
export const INSTANT_DELIVERY_CUTOFF_HOUR = 22; // 10 PM

// ── Kuwait Governorates ───────────────────────────────────────────────────
export const KUWAIT_GOVERNORATES = [
    { value: 'ASIMAH', nameAr: 'العاصمة', nameEn: 'Asimah (Capital)' },
    { value: 'HAWALLI', nameAr: 'حولي', nameEn: 'Hawalli' },
    { value: 'FARWANIYA', nameAr: 'الفروانية', nameEn: 'Farwaniya' },
    { value: 'JAHRA', nameAr: 'الجهراء', nameEn: 'Jahra' },
    { value: 'MUBARAK_AL_KABEER', nameAr: 'مبارك الكبير', nameEn: 'Mubarak Al-Kabeer' },
    { value: 'AHMADI', nameAr: 'الأحمدي', nameEn: 'Ahmadi' },
] as const;

export type KuwaitGovernorateValue = typeof KUWAIT_GOVERNORATES[number]['value'];

// ── Delivery types ────────────────────────────────────────────────────────
export const DELIVERY_TYPES = [
    { value: 'STANDARD', nameAr: 'توصيل عادي', desc: 'يوم إلى يومين عمل' },
    { value: 'SAME_DAY', nameAr: 'توصيل في نفس اليوم', desc: 'خلال 2–8 ساعات' },
    { value: 'INSTANT', nameAr: 'توصيل فوري', desc: 'خلال 30–150 دقيقة' },
    { value: 'SELF_PICKUP', nameAr: 'استلام من المستودع', desc: 'مجاني — استلم بنفسك' },
] as const;

export type DeliveryTypeValue = typeof DELIVERY_TYPES[number]['value'];

// ── Payment methods ───────────────────────────────────────────────────────
export const PAYMENT_METHODS_KW = [
    {
        id: 'KNET',
        nameAr: 'كي نت',
        desc: 'الدفع عبر بطاقة كي نت الكويتية',
        emoji: '🏦',
    },
    {
        id: 'PAY_DEEMA',
        nameAr: 'Pay Deema',
        desc: 'اشترِ الآن وادفع لاحقاً',
        emoji: '💳',
    },
    {
        id: 'APPLE_PAY',
        nameAr: 'Apple Pay',
        desc: 'ادفع بـ Apple Pay من جهازك',
        emoji: '',
    },
    {
        id: 'VISA_MASTERCARD',
        nameAr: 'فيزا / ماستركارد',
        desc: 'بطاقة ائتمانية أو مدى دولية',
        emoji: '💳',
    },
    {
        id: 'CASH_ON_DELIVERY',
        nameAr: 'الدفع عند الاستلام',
        desc: `دفع نقدي عند التسليم (+${COD_FEE_KWD.toFixed(3)} ${CURRENCY_SYMBOL})`,
        emoji: '💵',
    },
] as const;

export type PaymentMethodKw = typeof PAYMENT_METHODS_KW[number]['id'];

/** Payment method labels for display in footer / order summaries */
export const PAYMENT_METHOD_LABELS = PAYMENT_METHODS_KW.map((m) => m.nameAr);

// ── Navigation links ──────────────────────────────────────────────────────
export const NAV_LINKS = [
    { href: '/', label: 'الرئيسية' },
    { href: '/products', label: 'المنتجات' },
    { href: '/categories', label: 'التصنيفات' },
    { href: '/offers', label: 'العروض' },
    { href: '/contact', label: 'تواصل معنا' },
] as const;

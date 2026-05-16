'use client';

/**
 * Navbar — Anhar Al-Deera Premium Rebuild
 * Sticky frosted glass header with:
 * - Brand gradient logo area
 * - Desktop nav + mega category menu
 * - Language switcher
 * - Dark mode toggle
 * - Animated cart badge
 * - Smooth mobile drawer
 */
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
    ShoppingCart, Menu, X, User, Moon, Sun, Search,
    ChevronDown, Sparkles
} from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { useThemeStore } from '@/components/ui/ThemeProvider';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import SearchBar from './SearchBar';
import { STORE_NAME, NAV_LINKS } from '@/lib/constants';

const NAV_ITEMS = [
    { href: '/', label: 'الرئيسية', exact: true },
    { href: '/products', label: 'المنتجات', exact: false },
    { href: '/categories', label: 'التصنيفات', exact: false },
    { href: '/offers', label: 'العروض', exact: false, highlight: true },
    { href: '/contact', label: 'تواصل معنا', exact: false },
];

export default function Navbar() {
    const pathname = usePathname();
    const { items } = useCartStore();
    const { user } = useAuthStore();
    const { resolvedTheme, setTheme } = useThemeStore();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [cartBouncing, setCartBouncing] = useState(false);
    const prevCount = useState(0);

    const cartCount = items.reduce((acc, i) => acc + i.quantity, 0);

    // Scroll shadow
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Cart bounce animation on add
    useEffect(() => {
        if (cartCount > 0) {
            setCartBouncing(true);
            const t = setTimeout(() => setCartBouncing(false), 400);
            return () => clearTimeout(t);
        }
    }, [cartCount]);

    // Close mobile on route change
    useEffect(() => { setMobileOpen(false); }, [pathname]);

    const isActive = (href: string, exact: boolean) =>
        exact ? pathname === href : pathname.startsWith(href) && href !== '/';

    const toggleTheme = () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');

    return (
        <>
            <header
                className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl shadow-md dark:shadow-zinc-950/40 border-b border-zinc-100 dark:border-zinc-800'
                    : 'bg-white/70 dark:bg-zinc-900/70 backdrop-blur-sm border-b border-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center h-16 gap-3 md:gap-4">

                        {/* ── Logo ── */}
                        <Link href="/" className="flex-shrink-0 group flex items-center gap-2.5">
                            <div className="relative flex items-center justify-center w-11 h-11">
                                <Image
                                    src="/logo-2.webp"
                                    alt="أنهار الديرة"
                                    width={44}
                                    height={44}
                                    className="object-contain drop-shadow-sm"
                                    priority
                                />
                            </div>
                            <div className="hidden sm:block leading-tight">
                                <p className="font-black text-sm gradient-brand-text">{STORE_NAME}</p>
                                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium leading-none mt-0.5">
                                    Anhar Al-Deera
                                </p>
                            </div>
                        </Link>

                        {/* ── Desktop Nav ── */}
                        <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
                            {NAV_ITEMS.map((link) => {
                                const active = isActive(link.href, link.exact ?? false);
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${active
                                            ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50'
                                            : link.highlight
                                                ? 'text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/30'
                                                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                            }`}
                                    >
                                        {link.highlight && <Sparkles className="w-3.5 h-3.5" />}
                                        {link.label}
                                        {active && (
                                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full gradient-brand" />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* ── Actions ── */}
                        <div className="flex items-center gap-1.5 ms-auto">
                            {/* Search - hidden on small mobile */}
                            <div className="hidden sm:block">
                                <SearchBar />
                            </div>

                            {/* Language switcher */}
                            <LanguageSwitcher compact />

                            {/* Dark / Light toggle */}
                            <button
                                onClick={toggleTheme}
                                className="btn-icon w-9 h-9 rounded-xl"
                                aria-label="Toggle theme"
                            >
                                {resolvedTheme === 'dark'
                                    ? <Sun className="w-4 h-4 text-amber-400" />
                                    : <Moon className="w-4 h-4" />
                                }
                            </button>

                            {/* Account */}
                            <Link
                                href={user ? '/account' : '/login'}
                                aria-label="حسابي"
                                className="btn-icon w-9 h-9 rounded-xl hidden sm:flex"
                            >
                                <User className="w-4 h-4" />
                            </Link>

                            {/* Cart */}
                            <Link
                                href="/cart"
                                aria-label="سلة التسوق"
                                className="relative flex items-center justify-center w-9 h-9 rounded-xl gradient-brand text-white shadow-sm hover:shadow-brand transition-all duration-200"
                            >
                                <ShoppingCart className={`w-4 h-4 ${cartBouncing ? 'animate-cart-bounce' : ''}`} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1.5 -end-1.5 min-w-[20px] h-5 px-1 bg-white dark:bg-zinc-950 text-brand-600 dark:text-brand-400 text-[10px] font-black rounded-full flex items-center justify-center border-2 border-brand-500 animate-fade-in shadow-sm">
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* Mobile hamburger */}
                            <button
                                className="md:hidden btn-icon w-9 h-9 rounded-xl"
                                onClick={() => setMobileOpen((v) => !v)}
                                aria-label="فتح القائمة"
                            >
                                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Mobile Drawer ── */}
                {mobileOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40 bg-black/30 dark:bg-black/50 backdrop-blur-sm md:hidden"
                            onClick={() => setMobileOpen(false)}
                        />

                        {/* Panel */}
                        <div className="fixed top-16 start-0 end-0 z-50 md:hidden animate-slide-down">
                            <nav className="mx-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-xl overflow-hidden">
                                {/* Mobile search */}
                                <div className="p-3 border-b border-zinc-100 dark:border-zinc-800">
                                    <SearchBar />
                                </div>

                                <div className="p-2">
                                    {NAV_ITEMS.map((link) => {
                                        const active = isActive(link.href, link.exact ?? false);
                                        return (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${active
                                                    ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400'
                                                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                                    }`}
                                            >
                                                {link.highlight && <Sparkles className="w-4 h-4 text-brand-500" />}
                                                {link.label}
                                            </Link>
                                        );
                                    })}
                                </div>

                                {/* Language + Theme */}
                                <div className="p-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                                    <LanguageSwitcher />
                                    <div className="ms-auto flex gap-2">
                                        <button onClick={toggleTheme} className="btn-icon w-9 h-9">
                                            {resolvedTheme === 'dark'
                                                ? <Sun className="w-4 h-4 text-amber-400" />
                                                : <Moon className="w-4 h-4" />
                                            }
                                        </button>
                                        <Link href={user ? '/account' : '/login'} className="btn-icon w-9 h-9">
                                            <User className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </>
                )}
            </header>
        </>
    );
}
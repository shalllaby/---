'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    Menu,
    X,
    ChevronLeft,
    Store,
    Bell,
    Search,
    LogOut
} from 'lucide-react';
import { clsx } from 'clsx';

const NAV_ITEMS = [
    { href: '/admin', icon: LayoutDashboard, label: 'لوحة التحكم' },
    { href: '/admin/products', icon: Package, label: 'المنتجات' },
    { href: '/admin/orders', icon: ShoppingBag, label: 'الطلبات' },
    { href: '/admin/customers', icon: Users, label: 'العملاء' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 flex" dir="rtl">
            {/* ── Mobile Sidebar Overlay ── */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* ── Sidebar ── */}
            <aside className={clsx(
                "fixed inset-y-0 right-0 z-50 w-72 bg-white border-l border-slate-200 transform transition-transform duration-300 lg:relative lg:transform-none flex flex-col shadow-xl lg:shadow-none",
                isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
            )}>
                {/* Sidebar Header */}
                <div className="h-16 flex items-center px-6 border-b border-slate-100">
                    <Link href="/admin" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-200 group-hover:scale-105 transition-transform">
                            <Store size={22} />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900 leading-tight">أنهار الديرة</h1>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Admin Panel</p>
                        </div>
                    </Link>
                    <button
                        className="lg:hidden mr-auto p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                                    isActive
                                        ? "bg-brand-600 text-white shadow-md shadow-brand-100"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-brand-600"
                                )}
                            >
                                <item.icon size={20} className={clsx(isActive ? "text-white" : "text-slate-400 group-hover:text-brand-600")} />
                                <span>{item.label}</span>
                                {isActive && <div className="mr-auto w-1.5 h-1.5 rounded-full bg-white/60" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-slate-100 space-y-2">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        <ChevronLeft size={18} className="text-slate-400" />
                        <span>العودة للمتجر</span>
                    </Link>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                        <LogOut size={18} />
                        <span>تسجيل الخروج</span>
                    </button>
                </div>
            </aside>

            {/* ── Main Content Area ── */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-slate-500 w-64">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="بحث..."
                                className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-px bg-slate-200 mx-1"></div>
                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-left hidden sm:block">
                                <p className="text-sm font-bold text-slate-900 leading-none">مدير النظام</p>
                                <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">Administrator</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
                                <img src="https://ui-avatars.com/api/?name=Admin&background=0284c7&color=fff" alt="Admin" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-8 flex-1 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}

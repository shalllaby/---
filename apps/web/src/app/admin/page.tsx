'use client';

import React, { useEffect, useState } from 'react';
import {
    TrendingUp,
    ShoppingBag,
    Package,
    ArrowUpRight,
    ArrowDownRight,
    ChevronLeft,
    Clock,
    CheckCircle2,
    AlertCircle,
    Truck
} from 'lucide-react';
import apiClient from '@/lib/api-client';
import { formatKwd } from '@/lib/constants';
import { clsx } from 'clsx';
import Link from 'next/link';

interface Stats {
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    activeProducts: number;
    lowStockCount: number;
}

interface RecentOrder {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    user: { name: string };
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [statsRes, ordersRes] = await Promise.all([
                    apiClient.get('/orders/stats'),
                    apiClient.get('/orders?limit=5')
                ]);
                setStats(statsRes.data);
                setRecentOrders(ordersRes.data.data);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="flex justify-between items-center">
                    <div className="h-8 w-48 bg-slate-200 rounded" />
                    <div className="h-4 w-32 bg-slate-100 rounded" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-32 bg-white rounded-2xl border border-slate-100" />
                    ))}
                </div>
                <div className="h-64 bg-white rounded-2xl border border-slate-100" />
            </div>
        );
    }

    const statCards = [
        {
            label: 'إجمالي الإيرادات',
            value: formatKwd(stats?.totalRevenue ?? 0),
            icon: TrendingUp,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
            trend: { value: '12%', up: true }
        },
        {
            label: 'إجمالي الطلبات',
            value: stats?.totalOrders.toString() ?? '0',
            icon: ShoppingBag,
            color: 'text-brand-600',
            bgColor: 'bg-brand-50',
            trend: { value: '5%', up: true }
        },
        {
            label: 'المنتجات النشطة',
            value: stats?.activeProducts.toString() ?? '0',
            icon: Package,
            color: 'text-amber-600',
            bgColor: 'bg-amber-50',
            trend: { value: '2%', up: false }
        }
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">نظرة عامة على المتجر</h1>
                <p className="text-slate-500 mt-1">مرحباً بك مجدداً، إليك ما يحدث في متجر أنهار الديرة اليوم.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((card, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center", card.bgColor, card.color)}>
                                <card.icon size={24} />
                            </div>
                            <div className={clsx(
                                "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                                card.trend.up ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
                            )}>
                                {card.trend.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {card.trend.value}
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-slate-500 text-sm font-medium">{card.label}</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders Snippet */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-900">أحدث الطلبات</h2>
                    <Link href="/admin/orders" className="text-brand-600 text-sm font-bold flex items-center gap-1 hover:underline">
                        عرض الكل <ChevronLeft size={16} />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
                            <tr>
                                <th className="px-6 py-4 font-semibold">رقم الطلب</th>
                                <th className="px-6 py-4 font-semibold">العميل</th>
                                <th className="px-6 py-4 font-semibold">التاريخ</th>
                                <th className="px-6 py-4 font-semibold">المبلغ</th>
                                <th className="px-6 py-4 font-semibold">الحالة</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {recentOrders.length > 0 ? recentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-sm text-slate-600">#{order.id.slice(0, 8).toUpperCase()}</td>
                                    <td className="px-6 py-4 font-bold text-slate-900">{order.user.name}</td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">{new Date(order.createdAt).toLocaleDateString('ar-KW')}</td>
                                    <td className="px-6 py-4 font-bold text-slate-900">{formatKwd(order.totalAmount)}</td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={order.status} />
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">لا توجد طلبات حديثة</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const configs: Record<string, { label: string; color: string; icon: any }> = {
        PENDING: { label: 'قيد الانتظار', color: 'bg-amber-50 text-amber-700 border-amber-100', icon: Clock },
        PROCESSING: { label: 'قيد المعالجة', color: 'bg-blue-50 text-blue-700 border-blue-100', icon: Clock },
        SHIPPED: { label: 'تم الشحن', color: 'bg-indigo-50 text-indigo-700 border-indigo-100', icon: Truck },
        DELIVERED: { label: 'تم التوصيل', color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: CheckCircle2 },
        CANCELED: { label: 'ملغي', color: 'bg-rose-50 text-rose-700 border-rose-100', icon: AlertCircle },
        PAID: { label: 'مكتمل الدفع', color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: CheckCircle2 },
    };

    const config = configs[status] || { label: status, color: 'bg-slate-50 text-slate-700 border-slate-100', icon: Clock };
    const Icon = config.icon;

    return (
        <span className={clsx(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border",
            config.color
        )}>
            <Icon size={14} />
            {config.label}
        </span>
    );
}

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Tag as TagIcon,
    Loader2,
    Image as ImageIcon
} from 'lucide-react';
import apiClient from '@/lib/api-client';
import toast from 'react-hot-toast';
import CategoryModal from '@/components/admin/CategoryModal';

interface Category {
    id: string;
    nameAr: string;
    nameEn: string;
    slug: string;
    imageUrl?: string;
    _count?: {
        products: number;
    };
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await apiClient.get<Category[]>('/categories/flat');
            setCategories(data);
        } catch (error) {
            toast.error('فشل في تحميل التصنيفات');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedCategory(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string, nameAr: string) => {
        if (!confirm(`هل أنت متأكد من حذف التصنيف "${nameAr}"؟ سيؤدي هذا إلى فك ارتباط المنتجات التابعة له.`)) return;
        setDeletingId(id);
        try {
            await apiClient.delete(`/categories/${id}`);
            setCategories(prev => prev.filter(c => c.id !== id));
            toast.success('تم حذف التصنيف بنجاح');
        } catch (error: any) {
            const message = error.response?.data?.message || 'فشل حذف التصنيف. قد يكون مرتبطاً بمنتجات نشطة.';
            toast.error(message);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">إدارة التصنيفات</h1>
                    <p className="text-slate-500 mt-1">تنظيم منتجات متجر أنهار الديرة في فئات واضحة.</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-brand-200 hover:bg-brand-700 transition-all"
                >
                    <Plus size={20} />
                    <span>إضافة تصنيف جديد</span>
                </button>
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
                            <tr>
                                <th className="px-6 py-4 font-semibold">التصنيف</th>
                                <th className="px-6 py-4 font-semibold text-center">الرابط السريع (Slug)</th>
                                <th className="px-6 py-4 font-semibold text-center">عدد المنتجات</th>
                                <th className="px-6 py-4 font-semibold text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [1, 2, 3, 4].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-10 w-48 bg-slate-100 rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-6 w-32 bg-slate-100 rounded mx-auto" /></td>
                                        <td className="px-6 py-4"><div className="h-6 w-16 bg-slate-100 rounded mx-auto" /></td>
                                        <td className="px-6 py-4"><div className="h-8 w-24 bg-slate-100 rounded mx-auto" /></td>
                                    </tr>
                                ))
                            ) : categories.length > 0 ? (
                                categories.map((category) => (
                                    <tr key={category.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-100 flex items-center justify-center">
                                                    {category.imageUrl ? (
                                                        <img src={category.imageUrl} alt={category.nameAr} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <TagIcon className="w-6 h-6 text-slate-300" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{category.nameAr}</p>
                                                    <p className="text-xs text-slate-400">{category.nameEn}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-xs font-mono bg-slate-50 text-slate-500 px-2 py-1 rounded border border-slate-100">
                                                /{category.slug}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-bold text-slate-900 bg-brand-50 text-brand-600 px-3 py-1 rounded-full text-sm">
                                                {category._count?.products ?? 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id, category.nameAr)}
                                                    disabled={deletingId === category.id}
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                >
                                                    {deletingId === category.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                                        <TagIcon size={48} className="mx-auto mb-4 opacity-20" />
                                        <p>لا توجد تصنيفات حالياً</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Category Modal */}
            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedCategory(null);
                }}
                onSuccess={fetchCategories}
                category={selectedCategory}
            />
        </div>
    );
}

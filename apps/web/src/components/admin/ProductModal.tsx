'use client';

import React, { useEffect, useState } from 'react';
import { X, Upload, Loader2, Package, Save, Image as ImageIcon } from 'lucide-react';
import apiClient from '@/lib/api-client';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

interface Category {
    id: string;
    nameAr: string;
    nameEn: string;
}

interface Product {
    id: string;
    nameAr: string;
    nameEn: string;
    descriptionAr?: string;
    descriptionEn?: string;
    sku: string;
    price: number;
    discountPrice?: number;
    stockQuantity: number;
    categoryId: string;
    images: string[];
}

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    product?: Product | null; // If provided, we are in edit mode
}

export default function ProductModal({ isOpen, onClose, onSuccess, product }: ProductModalProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingCategories, setFetchingCategories] = useState(false);
    const [formData, setFormData] = useState({
        nameAr: '',
        nameEn: '',
        descriptionAr: '',
        descriptionEn: '',
        sku: '',
        price: '',
        discountPrice: '',
        stockQuantity: '',
        categoryId: '',
        images: [''],
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');

    const isEdit = !!product;

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
            if (product) {
                setFormData({
                    nameAr: product.nameAr || '',
                    nameEn: product.nameEn || '',
                    descriptionAr: product.descriptionAr || '',
                    descriptionEn: product.descriptionEn || '',
                    sku: product.sku || '',
                    price: product.price?.toString() || '',
                    discountPrice: product.discountPrice?.toString() || '',
                    stockQuantity: product.stockQuantity?.toString() || '0',
                    categoryId: product.categoryId || '',
                    images: product.images?.length > 0 ? product.images : [''],
                });
                setImagePreview(product.images?.[0] || null);
                setImageFile(null);
            } else {
                // Reset form for fresh add
                setFormData({
                    nameAr: '',
                    nameEn: '',
                    descriptionAr: '',
                    descriptionEn: '',
                    sku: '',
                    price: '',
                    discountPrice: '',
                    stockQuantity: '',
                    categoryId: '',
                    images: [''],
                });
                setImagePreview(null);
                setImageFile(null);
            }
        }
    }, [isOpen, product]);

    async function fetchCategories() {
        setFetchingCategories(true);
        try {
            const res = await apiClient.get('/categories/flat');
            setCategories(res.data);
        } catch (error) {
            toast.error('فشل في تحميل التصنيفات');
        } finally {
            setFetchingCategories(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('nameAr', formData.nameAr);
            formDataToSend.append('nameEn', formData.nameEn);
            formDataToSend.append('sku', formData.sku);
            formDataToSend.append('categoryId', formData.categoryId);
            formDataToSend.append('price', formData.price.toString());
            if (formData.discountPrice) formDataToSend.append('discountPrice', formData.discountPrice.toString());
            formDataToSend.append('stockQuantity', formData.stockQuantity.toString());
            if (formData.descriptionAr) formDataToSend.append('descriptionAr', formData.descriptionAr);
            if (formData.descriptionEn) formDataToSend.append('descriptionEn', formData.descriptionEn);

            if (imageInputMode === 'upload' && imageFile) {
                formDataToSend.append('image', imageFile);
            } else if (imageInputMode === 'url' && formData.images[0]) {
                formDataToSend.append('images', formData.images[0]);
            }

            if (isEdit && product) {
                await apiClient.patch(`/products/${product.id}`, formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('تم تحديث المنتج بنجاح');
            } else {
                await apiClient.post('/products', formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('تم إضافة المنتج بنجاح');
            }

            onSuccess();
            onClose();
        } catch (error: any) {
            const message = error.response?.data?.message || 'فشلت العملية';
            toast.error(Array.isArray(message) ? message[0] : message);
        } finally {
            setLoading(false);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden" dir="rtl">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center">
                            {isEdit ? <Save size={20} /> : <Package size={20} />}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">{isEdit ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
                            <p className="text-sm text-slate-500">{isEdit ? 'قم بتعديل بيانات المنتج أدناه' : 'أدخل تفاصيل المنتج ليتم عرضه في المتجر'}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <form id="product-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name Area */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">اسم المنتج (بالعربية)</label>
                            <input
                                required
                                type="text"
                                value={formData.nameAr}
                                onChange={e => setFormData({ ...formData, nameAr: e.target.value })}
                                placeholder="مثال: مناديل ناعمة"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">اسم المنتج (بالإنجليزية)</label>
                            <input
                                required
                                type="text"
                                value={formData.nameEn}
                                onChange={e => setFormData({ ...formData, nameEn: e.target.value })}
                                placeholder="Example: Soft Tissues"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                                dir="ltr"
                            />
                        </div>

                        {/* SKU and Category */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">رمز المنتج (SKU)</label>
                            <input
                                required
                                type="text"
                                value={formData.sku}
                                onChange={e => setFormData({ ...formData, sku: e.target.value })}
                                placeholder="مثال: TISS-001"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-mono"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">التصنيف</label>
                            <select
                                required
                                value={formData.categoryId}
                                onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all appearance-none bg-no-repeat bg-[left_1rem_center]"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundSize: '1.25rem' }}
                            >
                                <option value="">اختر التصنيف</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.nameAr}</option>
                                ))}
                            </select>
                        </div>

                        {/* Pricing */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">السعر (د.ك)</label>
                            <input
                                required
                                type="number"
                                step="0.001"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                placeholder="0.000"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">سعر العرض (اختياري)</label>
                            <input
                                type="number"
                                step="0.001"
                                value={formData.discountPrice}
                                onChange={e => setFormData({ ...formData, discountPrice: e.target.value })}
                                placeholder="0.000"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                            />
                        </div>

                        {/* Stock */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">الكمية المتوفرة</label>
                            <input
                                required
                                type="number"
                                value={formData.stockQuantity}
                                onChange={e => setFormData({ ...formData, stockQuantity: e.target.value })}
                                placeholder="100"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold text-slate-700">صورة المنتج</label>
                                <div className="flex bg-slate-100 rounded-lg p-1">
                                    <button
                                        type="button"
                                        onClick={() => setImageInputMode('upload')}
                                        className={clsx(
                                            "px-3 py-1 text-xs font-bold rounded-md transition-colors",
                                            imageInputMode === 'upload' ? "bg-white text-brand-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                        )}
                                    >
                                        رفع صورة
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setImageInputMode('url')}
                                        className={clsx(
                                            "px-3 py-1 text-xs font-bold rounded-md transition-colors",
                                            imageInputMode === 'url' ? "bg-white text-brand-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                        )}
                                    >
                                        رابط مباشر
                                    </button>
                                </div>
                            </div>
                            
                            {imageInputMode === 'upload' ? (
                                <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors group h-[120px] overflow-hidden">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setImageFile(file);
                                                setImagePreview(URL.createObjectURL(file));
                                            }
                                        }}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    {imagePreview ? (
                                        <div className="absolute inset-0">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <p className="text-white font-medium flex items-center gap-2"><Upload size={18} /> تغيير الصورة</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <div className="w-10 h-10 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                                <ImageIcon size={20} />
                                            </div>
                                            <p className="text-sm text-slate-600 font-medium">اسحب الصورة أو انقر للاختيار</p>
                                            <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP حتى 5MB</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="relative h-[120px] flex items-end">
                                    <div className="relative w-full">
                                        <input
                                            type="url"
                                            value={formData.images[0]}
                                            onChange={e => {
                                                const newImages = [...formData.images];
                                                newImages[0] = e.target.value;
                                                setFormData({ ...formData, images: newImages });
                                            }}
                                            placeholder="https://example.com/image.jpg"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all pl-10"
                                        />
                                        <Upload size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">الوصف (بالعربية)</label>
                        <textarea
                            rows={3}
                            value={formData.descriptionAr}
                            onChange={e => setFormData({ ...formData, descriptionAr: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all resize-none"
                        />
                    </div>
                </form>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                        إلغاء
                    </button>
                    <button
                        form="product-form"
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-brand-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-200 hover:bg-brand-700 transition-all flex items-center gap-2 disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isEdit ? <Save size={18} /> : <Package size={18} />}
                        {isEdit ? 'تحديث المنتج' : 'إضافة المنتج'}
                    </button>
                </div>
            </div>
        </div>
    );
}

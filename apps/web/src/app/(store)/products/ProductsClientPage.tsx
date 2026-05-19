'use client';

import { useState, useCallback } from 'react';
import ProductCard from '@/components/store/ProductCard';
import { SlidersHorizontal, ChevronDown, Search, Loader2, ChevronUp, LayoutGrid } from 'lucide-react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface Meta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface Props {
    initialProducts: any[];
    initialMeta: Meta;
    categories: any[];
    searchParams: any;
}

const PER_PAGE_OPTIONS = [20, 50, 100];

export default function ProductsClientPage({ initialProducts, initialMeta, categories, searchParams }: Props) {
    const [products, setProducts] = useState<any[]>(initialProducts);
    const [meta, setMeta] = useState<Meta>(initialMeta);
    const [loading, setLoading] = useState(false);
    const [perPage, setPerPage] = useState(initialMeta.limit || 20);
    const [customPerPage, setCustomPerPage] = useState('');
    const [showCustomInput, setShowCustomInput] = useState(false);

    const activeCategory = searchParams?.categoryId
        ? categories.find((c: any) => c.id === searchParams.categoryId)
        : null;

    // Fetch products with given page & limit
    const fetchProducts = useCallback(async (page: number, limit: number, append: boolean) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                ...(searchParams?.categoryId ? { categoryId: searchParams.categoryId } : {}),
                ...(searchParams?.search ? { search: searchParams.search } : {}),
                limit: String(limit),
                page: String(page),
                isActive: 'true',
            });
            const res = await fetch(`${API_BASE}/products?${params.toString()}`);
            if (!res.ok) throw new Error('Failed');
            const json = await res.json();
            const newProducts = json.data ?? [];
            const newMeta = json.meta ?? { total: 0, page, limit, totalPages: 0 };

            if (append) {
                setProducts(prev => [...prev, ...newProducts]);
            } else {
                setProducts(newProducts);
            }
            setMeta(newMeta);
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    }, [searchParams]);

    // Load more handler
    const handleLoadMore = () => {
        const nextPage = meta.page + 1;
        fetchProducts(nextPage, perPage, true);
    };

    // Change per page
    const handlePerPageChange = (newLimit: number) => {
        setPerPage(newLimit);
        setShowCustomInput(false);
        setProducts([]);
        fetchProducts(1, newLimit, false);
    };

    // Custom per page
    const handleCustomPerPage = () => {
        const val = parseInt(customPerPage, 10);
        if (val > 0 && val <= 500) {
            handlePerPageChange(val);
        }
    };

    const hasMore = products.length < meta.total;

    return (
        <main className="min-h-screen bg-white">
            {/* ── HEADER / BANNER ────────────────────────────────────────── */}
            <header className="relative py-16 lg:py-24 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-900/80 via-slate-900 to-accent-900/80 z-10" />
                <div className="absolute top-0 left-0 right-0 bottom-0 opacity-20 pointer-events-none z-0" style={{
                    backgroundImage: 'radial-gradient(circle at 50% 50%, #d4881a 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                }} />

                <div className="relative z-20 max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl lg:text-6xl font-black text-white mb-6">
                        {activeCategory ? activeCategory.nameAr : 'جميع المنتجات'}
                    </h1>
                    <p className="text-brand-100 max-w-2xl mx-auto text-lg font-medium opacity-80">
                        اكتشف تشكيلة واسعة من أفضل المنتجات العالمية المختارة بعناية لأجلك في الكويت
                    </p>
                </div>
            </header>

            {/* ── TOOLBAR / FILTERS ──────────────────────────────────────── */}
            <section className="sticky top-16 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide flex-1">
                        <Link
                            href="/products"
                            className={`text-sm font-bold whitespace-nowrap transition-colors ${!searchParams?.categoryId ? 'text-brand-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            الكل
                        </Link>
                        {categories.map((cat: any) => (
                            <Link
                                key={cat.id}
                                href={`/products?categoryId=${cat.id}`}
                                className={`text-sm font-bold whitespace-nowrap transition-colors ${searchParams?.categoryId === cat.id ? 'text-brand-600' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                {cat.nameAr}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 hover:bg-slate-100 transition-all">
                            <SlidersHorizontal className="w-4 h-4" />
                            تصفية
                        </button>
                    </div>
                </div>
            </section>

            {/* ── PRODUCT GRID ───────────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 py-12 lg:py-20">

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                    <div className="flex flex-col gap-1">
                        <p className="text-xs font-black text-brand-500 uppercase tracking-widest">المجموعة المختارة</p>
                        <h2 className="text-2xl font-black text-gray-900">
                            عرض {products.length} من {meta.total} منتج
                        </h2>
                    </div>

                    {/* ── Per Page Selector ── */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 font-bold">
                            <LayoutGrid className="w-4 h-4" />
                            <span>عرض:</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            {PER_PAGE_OPTIONS.map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => handlePerPageChange(opt)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                                        perPage === opt && !showCustomInput
                                            ? 'bg-brand-600 text-white shadow-md shadow-brand-200'
                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'
                                    }`}
                                >
                                    {opt}
                                </button>
                            ))}
                            <button
                                onClick={() => setShowCustomInput(!showCustomInput)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                                    showCustomInput
                                        ? 'bg-brand-600 text-white shadow-md shadow-brand-200'
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'
                                }`}
                            >
                                تحديد
                            </button>
                        </div>

                        {/* Custom input */}
                        {showCustomInput && (
                            <div className="flex items-center gap-2 animate-fade-in">
                                <input
                                    type="number"
                                    min="1"
                                    max="500"
                                    value={customPerPage}
                                    onChange={(e) => setCustomPerPage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCustomPerPage()}
                                    placeholder="العدد..."
                                    className="w-20 px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-center"
                                />
                                <button
                                    onClick={handleCustomPerPage}
                                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 transition-all shadow-sm"
                                >
                                    تطبيق
                                </button>
                            </div>
                        )}

                        {/* Sort */}
                        <div className="flex items-center gap-2 text-sm text-gray-500 font-bold bg-gray-50 px-4 py-2 rounded-xl ms-2">
                            <span>ترتيب حسب:</span>
                            <button className="flex items-center gap-1 text-gray-900">
                                الأكثر طلباً <ChevronDown className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-10">
                            {products.map((product: any) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* ── Load More Button ── */}
                        {hasMore && (
                            <div className="flex flex-col items-center mt-16 gap-4">
                                <p className="text-sm text-gray-400 font-medium">
                                    تم عرض {products.length} من أصل {meta.total} منتج
                                </p>
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loading}
                                    className="group relative px-10 py-4 bg-brand-600 text-white rounded-2xl font-bold text-base
                                               shadow-lg shadow-brand-200 hover:shadow-xl hover:shadow-brand-300
                                               hover:bg-brand-700 active:scale-[0.97]
                                               transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed
                                               flex items-center gap-3"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            جاري التحميل...
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                                            عرض المزيد ({Math.min(perPage, meta.total - products.length)} منتج)
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* All loaded message */}
                        {!hasMore && products.length > 0 && (
                            <div className="flex flex-col items-center mt-16 gap-2">
                                <div className="w-12 h-1 bg-brand-200 rounded-full" />
                                <p className="text-sm text-gray-400 font-medium mt-3">
                                    تم عرض جميع المنتجات ({meta.total} منتج)
                                </p>
                            </div>
                        )}
                    </>
                ) : loading ? (
                    <div className="py-32 text-center">
                        <Loader2 className="w-12 h-12 text-brand-400 animate-spin mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">جاري تحميل المنتجات...</p>
                    </div>
                ) : (
                    <div className="py-32 text-center animate-fade-in">
                        <div className="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-brand-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">لا توجد منتجات حالياً</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">نحن نعمل على تحديث المخزون، يرجى العودة قريباً أو تصفح الأقسام الأخرى.</p>
                        <Link href="/products" className="mt-8 inline-block btn-primary">عرض جميع المنتجات</Link>
                    </div>
                )}
            </section>

            {/* ── SEO CONTENT SECTION ─────────────────────────────────── */}
            <section className="bg-slate-50 py-20 border-t border-gray-100">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-black text-gray-900 mb-6">تسوق من انهار الديرة في الكويت</h2>
                    <p className="text-gray-600 leading-relaxed font-medium">
                        نحن فخورون بكوننا الوجهة الأولى لمنتجات النظافة والمنزل في الكويت. نوفر لكم تشكيلة واسعة من العلامات التجارية العالمية بأسعار تنافسية. استمتع بتجربة تسوق آمنة مع خيارات دفع متعددة تشمل كي نت، Apple Pay، والدفع عند الاستلام، مع أسرع خدمة توصيل تغطي جميع محافظات الكويت الست.
                    </p>
                </div>
            </section>
        </main>
    );
}

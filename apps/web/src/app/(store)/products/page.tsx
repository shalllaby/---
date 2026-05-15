import { Metadata } from 'next';
import ProductCard from '@/components/store/ProductCard';
import { Filter, SlidersHorizontal, ChevronDown, Search } from 'lucide-react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const metadata: Metadata = {
    title: 'جميع المنتجات',
    description: 'تسوق أفضل منتجات المنزل والنظافة في الكويت من الديرة باك',
};

async function getProducts(searchParams: any) {
    const query = new URLSearchParams(searchParams);
    try {
        const res = await fetch(`${API_BASE}/products?${query.toString()}&isActive=true`, { next: { revalidate: 60 } });
        if (!res.ok) return { data: [], total: 0 };
        const json = await res.json();
        return { data: json.data ?? [], total: json.total ?? 0 };
    } catch { return { data: [], total: 0 }; }
}

async function getCategories() {
    try {
        const res = await fetch(`${API_BASE}/categories`, { next: { revalidate: 300 } });
        if (!res.ok) return [];
        return res.json();
    } catch { return []; }
}

export default async function ProductsPage({ searchParams }: { searchParams: any }) {
    const [{ data: products, total }, categories] = await Promise.all([
        getProducts(searchParams),
        getCategories(),
    ]);

    const activeCategory = searchParams.categoryId
        ? categories.find((c: any) => c.id === searchParams.categoryId)
        : null;

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
                            className={`text-sm font-bold whitespace-nowrap transition-colors ${!searchParams.categoryId ? 'text-brand-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            الكل
                        </Link>
                        {categories.map((cat: any) => (
                            <Link
                                key={cat.id}
                                href={`/products?categoryId=${cat.id}`}
                                className={`text-sm font-bold whitespace-nowrap transition-colors ${searchParams.categoryId === cat.id ? 'text-brand-600' : 'text-gray-400 hover:text-gray-600'}`}
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

                <div className="flex items-center justify-between mb-10">
                    <div className="flex flex-col gap-1">
                        <p className="text-xs font-black text-brand-500 uppercase tracking-widest">المجموعة المختارة</p>
                        <h2 className="text-2xl font-black text-gray-900">
                            عرض {products.length} من {total} منتج
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-bold bg-gray-50 px-4 py-2 rounded-xl">
                        <span>ترتيب حسب:</span>
                        <button className="flex items-center gap-1 text-gray-900">
                            الأكثر طلباً <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-10">
                        {products.map((product: any) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
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

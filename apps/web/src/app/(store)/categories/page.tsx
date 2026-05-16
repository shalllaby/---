import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import path from 'path';
import fs from 'fs';
import { ArrowLeft, LayoutGrid, ChevronRight } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const metadata: Metadata = {
    title: 'تصنيفات المنتجات',
    description: 'تصفح جميع أقسام أنهار الديرة واكتشف ما يناسب احتياجاتك',
};

async function getCategories() {
    try {
        const res = await fetch(`${API_BASE}/categories`, { next: { revalidate: 300 } });
        if (!res.ok) return [];
        return res.json();
    } catch { return []; }
}

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <main className="min-h-screen bg-slate-50 py-12 lg:py-20">
            <div className="max-w-7xl mx-auto px-4">

                {/* ── HEADER ── */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-blue-600 rounded-[20px] flex items-center justify-center text-white shadow-xl shadow-blue-100 rotate-3 group">
                                <LayoutGrid className="w-7 h-7 group-hover:rotate-12 transition-transform" />
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">قائمة التصنيفات</h1>
                        </div>
                        <p className="text-slate-500 font-semibold text-xl leading-relaxed max-w-xl">
                            استكشف مجموعتنا الواسعة من التصنيفات المختارة بعناية لتناسب جميع احتياجات منزلك ونظافتك.
                        </p>
                    </div>
                </div>

                {/* ── CATEGORIES GRID ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {categories.map((cat: any) => {
                        const isDiscount = cat.slug === 'discounts' || cat.nameAr === 'الخصومات';
                        const imageName = `${cat.nameAr}.webp`;
                        const localImagePath = `/صور الاقسام/${imageName}`;

                        let finalSrc = cat.imageUrl || localImagePath;

                        const possiblePublicPaths = [
                            path.join(process.cwd(), 'public'),
                            path.join(process.cwd(), 'apps', 'web', 'public')
                        ];

                        let localExists = false;
                        for (const p of possiblePublicPaths) {
                            if (fs.existsSync(path.join(p, 'صور الاقسام', imageName))) {
                                localExists = true;
                                break;
                            }
                        }

                        if (!localExists && !cat.imageUrl) {
                            finalSrc = null;
                        }

                        return (
                            <Link
                                key={cat.id}
                                href={`/products?categoryId=${cat.id}`}
                                className={`group bg-white rounded-[2.5rem] p-8 border border-slate-100 hover:border-blue-200 hover:shadow-[0_32px_80px_rgba(30,58,138,0.1)] transition-all duration-500 flex flex-col items-center text-center ${isDiscount ? 'cat-card-featured pulse-border' : ''}`}
                            >
                                {isDiscount && <div className="cat-badge" style={{ transform: 'rotate(-2deg)' }}>🔥 عروض كبرى</div>}
                                <div className="w-32 h-32 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-blue-50 transition-all duration-500 overflow-hidden relative border border-slate-50 group-hover:border-blue-100">
                                    {finalSrc ? (
                                        <Image
                                            src={encodeURI(finalSrc)}
                                            alt={cat.nameAr}
                                            fill
                                            className="object-contain p-4"
                                            unoptimized
                                        />
                                    ) : (
                                        <span className="text-5xl">📦</span>
                                    )}
                                </div>

                                <h2 className="text-2xl font-black text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                                    {cat.nameAr}
                                </h2>

                                {cat._count?.products !== undefined && (
                                    <p className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-8">
                                        {cat._count.products} منتج متوفر
                                    </p>
                                )}

                                <div className="mt-auto w-full pt-6 border-t border-slate-50 flex items-center justify-center gap-2 text-blue-600 font-black text-sm group-hover:gap-4 transition-all">
                                    <span>تصفح القسم</span>
                                    <ArrowLeft className="w-4 h-4" />
                                </div>
                            </Link>
                        );
                    })}

                    {/* Empty State */}
                    {categories.length === 0 && (
                        <div className="col-span-full py-20 bg-white rounded-[3rem] text-center border-2 border-dashed border-gray-100">
                            <p className="text-gray-400 font-bold">لا توجد تصنيفات حالياً</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

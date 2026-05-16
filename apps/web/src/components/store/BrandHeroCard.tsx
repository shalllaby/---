'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function BrandHeroCard() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="rounded-[40px] bg-gradient-to-br from-[#5B2D8E] via-[#4A2A8A] to-[#4169E1] p-12 text-center shadow-2xl relative overflow-hidden group">
                {/* Decorative Orbs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">
                    {/* Centered Logo with animation */}
                    <div className="bg-white p-5 rounded-full shadow-xl mb-8 transform transition-transform group-hover:scale-105 duration-500">
                        <Image
                            src="/logo-2.webp"
                            alt="أنهار الديرة"
                            width={110}
                            height={110}
                            className="object-contain"
                            priority
                        />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                        أنهار الديرة
                    </h1>

                    <p className="text-lg md:text-xl text-blue-100/90 mb-10 max-w-xl leading-relaxed font-medium">
                        أكبر تشكيلة من منتجات ومستلزمات المنزل العصري والنظافة — تحت سقف واحد لخدمة أهل الديرة.
                    </p>

                    <Link
                        href="/products"
                        className="bg-white text-[#5B2D8E] font-extrabold px-12 py-4 rounded-2xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-white/20 hover:-translate-y-1 active:translate-y-0.5 text-lg"
                    >
                        تسوق الآن
                    </Link>
                </div>
            </div>
        </div>
    );
}

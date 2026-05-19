import { Metadata } from 'next';
import ProductsClientPage from './ProductsClientPage';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const metadata: Metadata = {
    title: 'جميع المنتجات',
    description: 'تسوق أفضل منتجات المنزل والنظافة في الكويت من الديرة باك',
};

async function getCategories() {
    try {
        const res = await fetch(`${API_BASE}/categories`, { next: { revalidate: 300 } });
        if (!res.ok) return [];
        return res.json();
    } catch { return []; }
}

async function getInitialProducts(searchParams: any) {
    const limit = 20;
    const params = new URLSearchParams({ ...searchParams, limit: String(limit), page: '1', isActive: 'true' });
    try {
        const res = await fetch(`${API_BASE}/products?${params.toString()}`, { next: { revalidate: 60 } });
        if (!res.ok) return { data: [], meta: { total: 0, page: 1, limit, totalPages: 0 } };
        const json = await res.json();
        return {
            data: json.data ?? [],
            meta: json.meta ?? { total: 0, page: 1, limit, totalPages: 0 },
        };
    } catch { return { data: [], meta: { total: 0, page: 1, limit, totalPages: 0 } }; }
}

export default async function ProductsPage({ searchParams }: { searchParams: any }) {
    const [initialProducts, categories] = await Promise.all([
        getInitialProducts(searchParams),
        getCategories(),
    ]);

    return (
        <ProductsClientPage
            initialProducts={initialProducts.data}
            initialMeta={initialProducts.meta}
            categories={categories}
            searchParams={searchParams}
        />
    );
}

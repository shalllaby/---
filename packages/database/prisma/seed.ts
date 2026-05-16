/**
 * Database Seed — الديرة باك (Aldeera Pack)
 * Kuwait Market — General merchandise store.
 * Run: pnpm db:seed
 */

// @ts-nocheck
import { PrismaClient, PaymentMethod, ShippingType, KuwaitGovernorate } from '../generated/client/index.js';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding الديرة باك database...');

    // ── Admin user ──────────────────────────────────────────────────────
    const adminHash = await bcrypt.hash('Admin@2024!', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@aldeerapack.kw' },
        update: {},
        create: {
            name: 'مدير المتجر',
            email: 'admin@aldeerapack.kw',
            passwordHash: adminHash,
            phone: '+96550000001',
            role: 'ADMIN',
        },
    });
    console.log('✅ Admin user created:', admin.email);

    // ── Tags ───────────────────────────────────────────────────────────
    const tags = await Promise.all([
        prisma.tag.upsert({ where: { slug: 'new' }, update: {}, create: { nameAr: 'جديد', nameEn: 'New', slug: 'new' } }),
        prisma.tag.upsert({ where: { slug: 'sale' }, update: {}, create: { nameAr: 'تخفيضات', nameEn: 'Sale', slug: 'sale' } }),
        prisma.tag.upsert({ where: { slug: 'featured' }, update: {}, create: { nameAr: 'مميز', nameEn: 'Featured', slug: 'featured' } }),
        prisma.tag.upsert({ where: { slug: 'imported' }, update: {}, create: { nameAr: 'مستورد', nameEn: 'Imported', slug: 'imported' } }),
    ]);
    console.log(`✅ ${tags.length} tags created`);

    // Clear existing products and categories if needed (Optional depending on if user drops db first)
    try {
        await prisma.product.deleteMany();
        await prisma.category.deleteMany();
    } catch (e) {
        console.log('Skipping cleanup due to foreign keys');
    }

    // ── Categories ─────────────────────────────────────────────────────
    const utensils = await prisma.category.upsert({
        where: { slug: 'utensils' },
        update: { imageUrl: '/صور الاقسام/الأواني.webp' },
        create: { nameAr: 'الأواني', nameEn: 'Utensils', slug: 'utensils', sortOrder: 1, imageUrl: '/صور الاقسام/الأواني.webp' },
    });
    const paperProducts = await prisma.category.upsert({
        where: { slug: 'paper-products' },
        update: { imageUrl: '/صور الاقسام/المنتجات الورقية.webp' },
        create: { nameAr: 'المنتجات الورقية', nameEn: 'Paper Products', slug: 'paper-products', sortOrder: 2, imageUrl: '/صور الاقسام/المنتجات الورقية.webp' },
    });
    const detergents = await prisma.category.upsert({
        where: { slug: 'detergents' },
        update: { imageUrl: '/صور الاقسام/المنظفات والمساحيق.webp' },
        create: { nameAr: 'المنظفات والمساحيق', nameEn: 'Detergents & Powders', slug: 'detergents', sortOrder: 3, imageUrl: '/صور الاقسام/المنظفات والمساحيق.webp' },
    });
    const skinCare = await prisma.category.upsert({
        where: { slug: 'skin-care' },
        update: { imageUrl: '/صور الاقسام/العناية بالبشرة.webp' },
        create: { nameAr: 'العناية بالبشرة', nameEn: 'Skin Care', slug: 'skin-care', sortOrder: 4, imageUrl: '/صور الاقسام/العناية بالبشرة.webp' },
    });
    const deeraClutter = await prisma.category.upsert({
        where: { slug: 'deera-clutter' },
        update: { imageUrl: '/clutter.webp' },
        create: { nameAr: 'كراكيب الديره', nameEn: 'Deera Clutter', slug: 'deera-clutter', sortOrder: 5, imageUrl: '/clutter.webp' },
    });
    const discounts = await prisma.category.upsert({
        where: { slug: 'discounts' },
        update: { imageUrl: '/صور الاقسام/الخصومات.webp' },
        create: { nameAr: 'الخصومات', nameEn: 'Discounts', slug: 'discounts', sortOrder: 0, imageUrl: '/صور الاقسام/الخصومات.webp' },
    });
    const dacProducts = await prisma.category.upsert({
        where: { slug: 'dac-products' },
        update: { imageUrl: '/صور الاقسام/منتجات داك.webp' },
        create: { nameAr: 'منتجات داك', nameEn: 'DAC Products', slug: 'dac-products', sortOrder: 6, imageUrl: '/صور الاقسام/منتجات داك.webp' },
    });

    console.log('✅ Categories created');

    // ── Products ───────────────────────────────────────────────────────
    const products = [
        // 1. الأواني (Utensils)
        {
            categoryId: utensils.id,
            nameAr: 'طقم طناجر سيراميك 10 قطع',
            nameEn: '10-Piece Ceramic Cookware Set',
            sku: 'UTEN-CERAMIC-10',
            price: 45.000,
            discountPrice: 39.900,
            stockQuantity: 20,
            isFeatured: true,
            weightKg: 8.5,
            images: ['https://placehold.co/400x400/fff3e0/E65100?text=Ceramic+Set'],
            attributes: [
                { key: 'Material', keyAr: 'الخامة', value: 'Ceramic', valueAr: 'سيراميك' },
                { key: 'Pieces', keyAr: 'عدد القطع', value: '10', valueAr: '10 قطع' },
            ],
            tagSlugs: ['featured', 'sale'],
        },
        {
            categoryId: utensils.id,
            nameAr: 'طقم كاسات شاي مذهّب',
            nameEn: 'Gold-Rimmed Tea Cups Set',
            sku: 'UTEN-TEA-GOLD',
            price: 8.500,
            stockQuantity: 50,
            isFeatured: false,
            weightKg: 1.2,
            images: ['https://placehold.co/400x400/f8f8f8/333333?text=Tea+Set'],
            attributes: [
                { key: 'Material', keyAr: 'الخامة', value: 'Glass', valueAr: 'زجاج' },
                { key: 'Pieces', keyAr: 'عدد القطع', value: '6', valueAr: '6 كاسات' },
            ],
            tagSlugs: ['new'],
        },
        // 2. المنتجات الورقية (Paper Products)
        {
            categoryId: paperProducts.id,
            nameAr: 'مناديل ورقية ناعمة عبوة عائلية',
            nameEn: 'Soft Facial Tissues Family Pack',
            sku: 'PAPER-TISSUE-FAM',
            price: 2.250,
            stockQuantity: 100,
            isFeatured: true,
            weightKg: 0.8,
            images: ['https://placehold.co/400x400/e3f2fd/1976D2?text=Tissues'],
            attributes: [
                { key: 'Pack Size', keyAr: 'حجم العبوة', value: '5 Pack', valueAr: '5 عبوات' },
                { key: 'Sheets', keyAr: 'عدد المناديل', value: '200 x 2 ply', valueAr: '200 منديل مزدوج' },
            ],
            tagSlugs: ['featured'],
        },
        {
            categoryId: paperProducts.id,
            nameAr: 'رول مناديل مطبخ شديد الامتصاص',
            nameEn: 'Highly Absorbent Kitchen Paper Towels',
            sku: 'PAPER-KITCHEN-ROLL',
            price: 1.750,
            stockQuantity: 80,
            isFeatured: false,
            weightKg: 0.6,
            images: ['https://placehold.co/400x400/e8f5e9/388E3C?text=Kitchen+Rolls'],
            attributes: [
                { key: 'Pack Size', keyAr: 'حجم العبوة', value: '4 Rolls', valueAr: '4 رولات' },
            ],
            tagSlugs: [],
        },
        // 3. المنظفات والمساحيق (Detergents)
        {
            categoryId: detergents.id,
            nameAr: 'مسحوق غسيل أوتوماتيك 5 كجم',
            nameEn: 'Automatic Laundry Powder 5kg',
            sku: 'DET-POWDER-5KG',
            price: 4.500,
            discountPrice: 3.900,
            stockQuantity: 40,
            isFeatured: true,
            weightKg: 5.0,
            images: ['https://placehold.co/400x400/1a1a2e/FFFFFF?text=Laundry+Powder'],
            attributes: [
                { key: 'Weight', keyAr: 'الوزن', value: '5 kg', valueAr: '5 كجم' },
            ],
            tagSlugs: ['sale', 'imported'],
        },
        {
            categoryId: detergents.id,
            nameAr: 'سائل غسيل الصحون برائحة الليمون',
            nameEn: 'Lemon Dishwashing Liquid',
            sku: 'DET-DISH-LEMON',
            price: 1.250,
            stockQuantity: 60,
            isFeatured: false,
            weightKg: 1.0,
            images: ['https://placehold.co/400x400/fff9c4/FBC02D?text=Dish+Liquid'],
            attributes: [
                { key: 'Scent', keyAr: 'الرائحة', value: 'Lemon', valueAr: 'ليمون' },
                { key: 'Volume', keyAr: 'الحجم', value: '1 Liter', valueAr: '1 لتر' },
            ],
            tagSlugs: [],
        },
        // 4. العناية بالبشرة (Skin Care)
        {
            categoryId: skinCare.id,
            nameAr: 'غسول وجه بخلاصة الصبار',
            nameEn: 'Aloe Vera Face Wash',
            sku: 'SKIN-WASH-ALOE',
            price: 3.500,
            stockQuantity: 30,
            isFeatured: true,
            weightKg: 0.25,
            images: ['https://placehold.co/400x400/c8e6c9/2E7D32?text=Face+Wash'],
            attributes: [
                { key: 'Skin Type', keyAr: 'نوع البشرة', value: 'All Skin Types', valueAr: 'جميع انواع البشرة' },
                { key: 'Ingredient', keyAr: 'المكونات', value: 'Aloe Vera', valueAr: 'صبار' },
            ],
            tagSlugs: ['featured', 'new'],
        },
        {
            categoryId: skinCare.id,
            nameAr: 'كريم مرطب ليل ونهار',
            nameEn: 'Day and Night Moisturizer Cream',
            sku: 'SKIN-CREAM-MOIST',
            price: 7.900,
            discountPrice: 6.500,
            stockQuantity: 25,
            isFeatured: false,
            weightKg: 0.15,
            images: ['https://placehold.co/400x400/fce4ec/C2185B?text=Moisturizer'],
            attributes: [
                { key: 'Usage', keyAr: 'الاستخدام', value: 'Day & Night', valueAr: 'ليل ونهار' },
                { key: 'Volume', keyAr: 'الحجم', value: '50ml', valueAr: '50 مل' },
            ],
            tagSlugs: ['sale'],
        },
    ];

    for (const p of products) {
        const { attributes, tagSlugs, ...productData } = p;
        const product = await prisma.product.upsert({
            where: { sku: productData.sku },
            update: {
                ...productData,
            },
            create: {
                ...productData,
                attributes: { create: attributes },
                tags: {
                    create: tagSlugs.map((slug) => ({
                        tag: { connect: { slug } },
                    })),
                },
            },
        });
        console.log(`  ✅ Product: ${product.nameAr} (${product.sku})`);
    }

    // ── Sample address ─────────────────────────────────────────────────
    await prisma.address.create({
        data: {
            userId: admin.id,
            fullName: 'مدير المتجر',
            phone: '+96550000001',
            block: '5',
            street: 'شارع الخليج العربي',
            building: '12',
            area: 'الشويخ',
            governorate: KuwaitGovernorate.ASIMAH,
            isDefault: true,
        },
    });

    console.log('\n✨ Seed complete — الديرة باك is ready!');
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());

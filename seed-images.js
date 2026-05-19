const fs = require('fs');
const path = require('path');

// VPS Database connection
process.env.DATABASE_URL = 'postgres://postgres:XJvrN3F9WVwfPzecdmcEi6xFgEqQvtz2sBc8iP5bJxprpFm5wgPZ8jLZXGeyRjVz@187.127.86.138:5432/postgres';

const { PrismaClient } = require('./apps/api/node_modules/@prisma/client');

const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
});

const sourceDir = path.join('C:', 'Users', 'Mohamed Shalaby', 'Desktop', 'متجر الكويت  - تعديل منه 2', 'صور منتجات انهار الديرة');
const targetDir = path.join(__dirname, 'apps', 'web', 'public', 'product-images');

async function main() {
    console.log('=== بدء رفع صور منتجات أنهار الديرة ===');
    console.log('Connecting to database...');
    
    try {
        await prisma.$connect();
        console.log('✅ Connected to database successfully!');
    } catch (err) {
        console.error('❌ Failed to connect to database:', err.message);
        process.exit(1);
    }

    // Step 1: Find or create general category
    console.log('\n📁 Finding or creating general category...');
    let category = await prisma.category.findFirst({
        where: { slug: 'general-products' }
    });

    if (!category) {
        category = await prisma.category.create({
            data: {
                nameAr: 'قسم عام',
                nameEn: 'General',
                slug: 'general-products',
                isActive: true,
                sortOrder: 999
            }
        });
        console.log('✅ Created general category:', category.id);
    } else {
        console.log('✅ Found existing general category:', category.id);
    }

    // Step 2: Create target directory for images
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
        console.log('✅ Created target directory:', targetDir);
    }

    // Step 3: Read all image files
    console.log('\n📸 Reading source directory...');
    const allFiles = fs.readdirSync(sourceDir);
    const imageFiles = allFiles.filter(f => {
        const ext = f.toLowerCase();
        return ext.endsWith('.jpeg') || ext.endsWith('.jpg') || ext.endsWith('.png') || ext.endsWith('.webp');
    });
    // Filter out the zip file
    console.log(`Found ${imageFiles.length} image files (out of ${allFiles.length} total files)`);

    // Step 4: Process each image
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const sourcePath = path.join(sourceDir, file);

        try {
            // Create a clean filename
            const ext = path.extname(file);
            const cleanName = `anhar_${String(i + 1).padStart(4, '0')}${ext}`;
            const targetPath = path.join(targetDir, cleanName);

            // Copy image to public folder
            fs.copyFileSync(sourcePath, targetPath);

            // Create unique SKU
            const sku = `ANHAR-${String(i + 1).padStart(4, '0')}`;

            // Check if SKU already exists
            const existing = await prisma.product.findUnique({ where: { sku } });
            if (existing) {
                console.log(`⏭️  [${i + 1}/${imageFiles.length}] SKU ${sku} already exists, skipping...`);
                continue;
            }

            // Image URL (relative to public/)
            const imageUrl = `/product-images/${cleanName}`;

            // Insert product into database
            await prisma.product.create({
                data: {
                    categoryId: category.id,
                    nameAr: 'صور انهار الديرة',
                    nameEn: 'Anhar Al-Deera Images',
                    sku: sku,
                    price: 1.000,
                    stockQuantity: 1000,
                    images: [imageUrl],
                    isActive: true,
                    isFeatured: false,
                }
            });

            successCount++;
            if (successCount % 25 === 0) {
                console.log(`✅ [${successCount}/${imageFiles.length}] تم رفع ${successCount} منتج...`);
            }
        } catch (err) {
            errorCount++;
            console.error(`❌ Error processing ${file}:`, err.message);
        }
    }

    console.log('\n========================================');
    console.log(`✅ تم رفع ${successCount} منتج بنجاح`);
    if (errorCount > 0) console.log(`❌ فشل في ${errorCount} منتج`);
    console.log(`📁 التصنيف: قسم عام (${category.id})`);
    console.log(`💰 السعر: 1.000 د.ك`);
    console.log(`📝 الاسم: صور انهار الديرة`);
    console.log('========================================');
}

main()
    .catch(e => {
        console.error('Fatal error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

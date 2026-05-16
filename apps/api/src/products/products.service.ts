import {
    Injectable, NotFoundException, ConflictException, BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsQueryDto } from './dto/products-query.dto';
import { Prisma, OrderStatus, ShippingType, PaymentMethod } from '@prisma/client';
import * as sharp from 'sharp';
import axios from 'axios';
import * as FormData from 'form-data';
@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * List products with filtering, fuzzy search, sorting, and pagination.
     * Ready for analytics — all query params logged for future ML/analytics use.
     */
    async findAll(query: ProductsQueryDto) {
        const {
            search, categoryId, minPrice, maxPrice, sort = 'createdAt',
            order = 'desc', page = 1, limit = 20, featured, isActive,
        } = query;

        const where: Prisma.ProductWhereInput = {
            isActive,
            ...(featured !== undefined && { isFeatured: featured }),
            ...(categoryId && { categoryId }),
            ...(minPrice || maxPrice ? {
                price: {
                    ...(minPrice && { gte: new Prisma.Decimal(minPrice) }),
                    ...(maxPrice && { lte: new Prisma.Decimal(maxPrice) }),
                },
            } : {}),
            ...(search && {
                OR: [
                    { nameAr: { contains: search, mode: 'insensitive' } },
                    { nameEn: { contains: search, mode: 'insensitive' } },
                    { sku: { contains: search, mode: 'insensitive' } },
                    { descriptionAr: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };

        const [data, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                include: { category: { select: { id: true, nameAr: true, nameEn: true, slug: true } } },
                orderBy: { [sort]: order },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.product.count({ where }),
        ]);

        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }

    async findOne(id: string) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { category: true },
        });
        if (!product) throw new NotFoundException('المنتج غير موجود');

        // Increment view count asynchronously (for analytics)
        this.prisma.product.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
        }).catch(() => { }); // fire-and-forget

        return product;
    }

    async findBySku(sku: string) {
        const product = await this.prisma.product.findUnique({ where: { sku } });
        if (!product) throw new NotFoundException(`منتج SKU: ${sku} غير موجود`);
        return product;
    }

    async create(dto: CreateProductDto) {
        // Ensure SKU is unique
        const existing = await this.prisma.product.findUnique({ where: { sku: dto.sku } });
        if (existing) throw new ConflictException(`SKU "${dto.sku}" مستخدم بالفعل`);

        // Validate category
        const category = await this.prisma.category.findUnique({ where: { id: dto.categoryId } });
        if (!category) throw new NotFoundException('التصنيف غير موجود');

        return this.prisma.product.create({ data: dto, include: { category: true } });
    }

    async update(id: string, dto: UpdateProductDto) {
        await this.findOne(id); // ensure exists

        if (dto.sku) {
            const existing = await this.prisma.product.findFirst({
                where: { sku: dto.sku, id: { not: id } },
            });
            if (existing) throw new ConflictException(`SKU "${dto.sku}" مستخدم بمنتج آخر`);
        }

        return this.prisma.product.update({
            where: { id },
            data: dto,
            include: { category: true },
        });
    }

    async toggleActive(id: string) {
        const product = await this.findOne(id);
        return this.prisma.product.update({
            where: { id },
            data: { isActive: !product.isActive },
        });
    }

    async updateStock(id: string, quantity: number) {
        if (quantity < 0) throw new BadRequestException('الكمية لا يمكن أن تكون سالبة');
        await this.findOne(id);
        return this.prisma.product.update({
            where: { id },
            data: { stockQuantity: quantity },
        });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.product.delete({ where: { id } });
    }

    /** Dashboard helper: get products with low stock */
    async getLowStock(threshold = 10) {
        return this.prisma.product.findMany({
            where: { stockQuantity: { lte: threshold }, isActive: true },
            orderBy: { stockQuantity: 'asc' },
            take: 20,
        });
    }

    async uploadImages(id: string, files: Express.Multer.File[]) {
        const product = await this.findOne(id);
        const imageUrls: string[] = [];
        const apiKey = process.env.IMGBB_API_KEY;
        if (!apiKey) throw new BadRequestException('إعدادات IMGBB_API_KEY غير متوفرة');

        for (const file of files) {
            // Compress to WebP
            const webpBuffer = await sharp(file.buffer)
                .resize({ width: 800, height: 800, fit: 'inside', withoutEnlargement: true })
                .webp({ quality: 75 })
                .toBuffer();
            
            // Convert to Base64
            const base64Image = webpBuffer.toString('base64');
            
            // Upload to ImgBB
            const formData = new FormData();
            formData.append('image', base64Image);
            
            try {
                const response = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData, {
                    headers: formData.getHeaders(),
                });
                if (response.data && response.data.data && response.data.data.url) {
                    imageUrls.push(response.data.data.url);
                }
            } catch (error) {
                console.error('ImgBB upload error:', error.message);
                throw new BadRequestException('فشل في رفع الصورة');
            }
        }

        return this.prisma.product.update({
            where: { id },
            data: {
                images: [...(product.images || []), ...imageUrls],
            },
        });
    }
}

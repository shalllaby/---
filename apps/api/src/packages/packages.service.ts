import {
    Injectable, NotFoundException, ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { PackageType, PackageStatus, PaymentMethod, OrderStatus } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Injectable()
export class PackagesService {
    constructor(private readonly prisma: PrismaService) { }

    /** List authenticated user's saved packages with items + live product reference */
    async findMy(userId: string) {
        return this.prisma.package.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: {
                            select: { id: true, nameAr: true, nameEn: true, images: true, isActive: true, stockQuantity: true },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Save a new monthly box.
     * Snapshot data (price, name) is captured at save-time from the live product
     * so display remains accurate even if the product is later updated.
     */
    async create(userId: string, dto: CreatePackageDto) {
        if (!dto.items || dto.items.length === 0) {
            throw new BadRequestException('يجب أن تحتوي الباقة على منتج واحد على الأقل');
        }

        return this.prisma.$transaction(async (tx) => {
            const productIds = dto.items.map((i) => i.productId);
            const products = await tx.product.findMany({
                where: { id: { in: productIds }, isActive: true },
            });

            if (products.length !== productIds.length) {
                throw new NotFoundException('بعض المنتجات غير موجودة أو غير متاحة');
            }

            const productMap = new Map(products.map((p) => [p.id, p]));

            const pkg = await tx.package.create({
                data: {
                    userId,
                    nameAr: dto.nameAr,
                    type: dto.type as PackageType,
                    status: PackageStatus.ACTIVE,
                    items: {
                        create: dto.items.map((item) => {
                            const product = productMap.get(item.productId)!;
                            const priceAtTime = product.discountPrice ?? product.price;
                            return {
                                productId: item.productId,
                                quantity: item.quantity,
                                priceAtTime,
                                productNameArAtTime: product.nameAr,
                                productNameEnAtTime: product.nameEn,
                            };
                        }),
                    },
                },
                include: {
                    items: { include: { product: { select: { id: true, nameAr: true, images: true } } } },
                },
            });

            return pkg;
        });
    }

    /**
     * Update a package (rename, change items, or change status).
     * If items are provided, old items are deleted and new ones are inserted
     * with fresh snapshots.
     */
    async update(userId: string, packageId: string, dto: UpdatePackageDto) {
        await this.verifyOwnership(userId, packageId);

        return this.prisma.$transaction(async (tx) => {
            if (dto.items) {
                const productIds = dto.items.map((i) => i.productId);
                const products = await tx.product.findMany({
                    where: { id: { in: productIds }, isActive: true },
                });

                if (products.length !== productIds.length) {
                    throw new NotFoundException('بعض المنتجات غير موجودة أو غير متاحة');
                }
                const productMap = new Map(products.map((p) => [p.id, p]));

                await tx.packageItem.deleteMany({ where: { packageId } });
                await tx.packageItem.createMany({
                    data: dto.items.map((item) => {
                        const product = productMap.get(item.productId)!;
                        const priceAtTime = product.discountPrice ?? product.price;
                        return {
                            packageId,
                            productId: item.productId,
                            quantity: item.quantity,
                            priceAtTime,
                            productNameArAtTime: product.nameAr,
                            productNameEnAtTime: product.nameEn,
                        };
                    }),
                });
            }

            return tx.package.update({
                where: { id: packageId },
                data: {
                    ...(dto.nameAr && { nameAr: dto.nameAr }),
                    ...(dto.type && { type: dto.type as PackageType }),
                    ...(dto.status && { status: dto.status as PackageStatus }),
                },
                include: {
                    items: { include: { product: { select: { id: true, nameAr: true, images: true } } } },
                },
            });
        });
    }

    /** Delete a saved package */
    async remove(userId: string, packageId: string) {
        await this.verifyOwnership(userId, packageId);
        await this.prisma.package.delete({ where: { id: packageId } });
        return { message: 'تم حذف الباقة بنجاح' };
    }

    /** Toggle package status: ACTIVE → PAUSED and vice versa */
    async toggle(userId: string, packageId: string) {
        const pkg = await this.verifyOwnership(userId, packageId);
        const newStatus = pkg.status === PackageStatus.ACTIVE ? PackageStatus.PAUSED : PackageStatus.ACTIVE;
        return this.prisma.package.update({
            where: { id: packageId },
            data: { status: newStatus },
        });
    }

    /**
     * Reorder: convert the saved package's items into a new Order.
     * Uses the live productId + quantity from the package items.
     * Price is validated fresh by OrdersService (not from snapshot) for correctness.
     */
    async reorder(
        userId: string,
        packageId: string,
        payload: { paymentMethod: PaymentMethod; addressId?: string; shippingFee?: number },
    ) {
        const pkg = await this.prisma.package.findUnique({
            where: { id: packageId },
            include: { items: true },
        });

        if (!pkg) throw new NotFoundException('الباقة غير موجودة');
        if (pkg.userId !== userId) throw new ForbiddenException('غير مصرح');
        if (pkg.status === PackageStatus.PAUSED) {
            throw new BadRequestException('الباقة موقوفة مؤقتاً — يرجى تفعيلها أولاً');
        }

        return this.prisma.$transaction(async (tx) => {
            let subtotal = new Prisma.Decimal(0);
            const items: {
                productId: string; quantity: number;
                priceAtPurchase: Prisma.Decimal;
                productNameAr: string; productNameEn: string; productSku: string;
            }[] = [];

            for (const pi of pkg.items) {
                if (!pi.productId) {
                    throw new BadRequestException(`منتج "${pi.productNameArAtTime}" غير متاح حالياً`);
                }
                const product = await tx.product.findUnique({ where: { id: pi.productId } });
                if (!product || !product.isActive) {
                    throw new BadRequestException(`منتج "${pi.productNameArAtTime}" غير متاح حالياً`);
                }
                if (product.stockQuantity < pi.quantity) {
                    throw new BadRequestException(`الكمية المتاحة من "${product.nameAr}" لا تكفي`);
                }

                const price = product.discountPrice ?? product.price;
                subtotal = subtotal.plus(price.times(pi.quantity));
                items.push({
                    productId: product.id, quantity: pi.quantity,
                    priceAtPurchase: price,
                    productNameAr: product.nameAr, productNameEn: product.nameEn,
                    productSku: product.sku,
                });

                await tx.product.update({
                    where: { id: product.id },
                    data: { stockQuantity: { decrement: pi.quantity } },
                });
            }

            const shippingFee = new Prisma.Decimal(payload.shippingFee ?? 0);
            const total = subtotal.plus(shippingFee);

            const order = await tx.order.create({
                data: {
                    userId,
                    addressId: payload.addressId,
                    status: OrderStatus.PENDING, // بانتظار الدفع
                    paymentMethod: payload.paymentMethod,
                    shippingFee,
                    codFee: new Prisma.Decimal(0),
                    subtotal,
                    discountAmount: new Prisma.Decimal(0),
                    totalAmount: total,
                    notes: `إعادة طلب من الباقة: ${pkg.nameAr}`,
                    items: { createMany: { data: items } },
                },
                include: { items: true, address: true },
            });

            return {
                ...order,
                orderNumber: order.id.slice(-6).toUpperCase(), // Short ID prefix
            };
        });
    }

    private async verifyOwnership(userId: string, packageId: string) {
        const pkg = await this.prisma.package.findUnique({ where: { id: packageId } });
        if (!pkg) throw new NotFoundException('الباقة غير موجودة');
        if (pkg.userId !== userId) throw new ForbiddenException('غير مصرح');
        return pkg;
    }
}

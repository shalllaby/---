import {
    Injectable, NotFoundException, BadRequestException, ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Prisma, OrderStatus, PaymentMethod, ShippingType } from '@prisma/client';
import { ReferralService } from '../referral/referral.service';
import { AddressesService } from '../addresses/addresses.service';

@Injectable()
export class OrdersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly referralService: ReferralService,
        private readonly addressesService: AddressesService,
    ) { }

    /**
     * Create a new order.
     * Validates stock, calculates totals in KWD (3 decimal places), and decrements stock in a transaction.
     */
    async create(userId: string, dto: CreateOrderDto) {
        return this.prisma.$transaction(async (tx: Parameters<Parameters<PrismaService['$transaction']>[0]>[0]) => {
            let subtotal = new Prisma.Decimal(0);

            // Build order-item snapshots
            const itemsData: {
                productId: string;
                quantity: number;
                priceAtPurchase: Prisma.Decimal;
                productNameAr: string;
                productNameEn: string;
                productSku: string;
            }[] = [];

            for (const item of dto.items) {
                const product = await tx.product.findUnique({ where: { id: item.productId } });
                if (!product) throw new NotFoundException(`منتج غير موجود: ${item.productId}`);
                if (!product.isActive) throw new BadRequestException(`المنتج "${product.nameAr}" غير متاح`);
                if (product.stockQuantity < item.quantity) {
                    throw new BadRequestException(
                        `الكمية المطلوبة من "${product.nameAr}" (${item.quantity}) أكثر من المتوفر (${product.stockQuantity})`,
                    );
                }

                const price = product.discountPrice ?? product.price;
                subtotal = subtotal.plus(price.times(item.quantity));

                itemsData.push({
                    productId: product.id,
                    quantity: item.quantity,
                    priceAtPurchase: price,
                    productNameAr: product.nameAr,
                    productNameEn: product.nameEn,
                    productSku: product.sku,
                });

                // Decrement stock
                await tx.product.update({
                    where: { id: product.id },
                    data: { stockQuantity: { decrement: item.quantity } },
                });
            }

            // Calculate discount if a coupon is provided
            let discountAmount = new Prisma.Decimal(0);
            let appliedCouponCode: string | null = null;

            if (dto.couponCode) {
                const coupon = await tx.coupon.findFirst({
                    where: {
                        code: dto.couponCode,
                        userId,
                        isUsed: false,
                        expiresAt: { gt: new Date() }
                    }
                });

                if (!coupon) {
                    throw new BadRequestException('كود الخصم غير صالح أو منتهي الصلاحية');
                }

                // Calculate discount amount
                discountAmount = subtotal.times(coupon.discountPct).dividedBy(100);
                appliedCouponCode = coupon.code;

                // Mark coupon as used
                await tx.coupon.update({
                    where: { id: coupon.id },
                    data: { isUsed: true }
                });
            }

            const shippingFee = new Prisma.Decimal(dto.shippingFee ?? 0);
            const codFee = new Prisma.Decimal(dto.codFee ?? 0);
            const total = subtotal.minus(discountAmount).plus(shippingFee).plus(codFee);

            // Resolve Address ID — with strict ownership check
            let targetAddressId = dto.addressId;
            if (targetAddressId) {
                // Security: verify the address belongs to the authenticated user
                await this.addressesService.verifyOwnership(userId, targetAddressId);
            } else if (dto.address) {
                const newAddress = await tx.address.create({
                    data: {
                        ...dto.address,
                        // DO NOT attach userId to checkout addresses; frontend saves explicitly if checked
                        governorate: dto.address.governorate as any,
                    },
                });
                targetAddressId = newAddress.id;
            }

            const order = await tx.order.create({
                data: {
                    userId,
                    addressId: targetAddressId,
                    paymentMethod: dto.paymentMethod,
                    shippingType: dto.shippingType,
                    shippingFee,
                    codFee,
                    subtotal,
                    couponCode: appliedCouponCode,
                    discountAmount: discountAmount,
                    totalAmount: total,
                    notes: dto.notes,
                    items: { createMany: { data: itemsData } },
                },
                include: {
                    items: { include: { product: { select: { nameAr: true, nameEn: true, images: true } } } },
                    address: true,
                },
            });

            return order;
        });
    }

    /** List orders for the authenticated customer */
    async findMyOrders(userId: string) {
        return this.prisma.order.findMany({
            where: { userId },
            include: { items: true, address: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    /** [Admin] List all orders with pagination and optional status filter */
    async findAll(status?: OrderStatus, page = 1, limit = 20) {
        const where = status ? { status } : {};
        const [data, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                include: {
                    user: { select: { id: true, name: true, email: true, phone: true } },
                    items: { include: { product: { select: { nameAr: true, nameEn: true, images: true } } } },
                    address: true,
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.order.count({ where }),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }

    async findOne(id: string, userId?: string) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, name: true, email: true, phone: true } },
                items: { include: { product: { select: { nameAr: true, nameEn: true, images: true } } } },
                address: true,
            },
        });
        if (!order) throw new NotFoundException('الطلب غير موجود');
        if (userId && order.userId !== userId) throw new ForbiddenException('غير مصرح');
        return order;
    }

    async updateStatus(id: string, dto: UpdateOrderStatusDto) {
        const order = await this.findOne(id);

        const updated = await this.prisma.order.update({
            where: { id },
            data: {
                status: dto.status,
                ...(dto.trackingNumber && { trackingNumber: dto.trackingNumber }),
                ...(dto.shippingType && { shippingType: dto.shippingType }),
                ...(dto.paymentRef && { paymentRef: dto.paymentRef }),
            },
        });

        return updated;
    }

    async update(id: string, userId: string, dto: any) {
        const order = await this.findOne(id, userId);

        // Security check: only allow updating PENDING orders
        if (order.status !== OrderStatus.PENDING) {
            throw new BadRequestException('لا يمكن تغيير بيانات الطلب بعد البدء بمعالجته');
        }

        // Validate address if provided
        if (dto.addressId) {
            await this.addressesService.verifyOwnership(userId, dto.addressId);
        }

        return this.prisma.order.update({
            where: { id },
            data: {
                ...(dto.paymentMethod && { paymentMethod: dto.paymentMethod }),
                ...(dto.addressId && { addressId: dto.addressId }),
                ...(dto.shippingType && { shippingType: dto.shippingType }),
                ...(dto.shippingFee !== undefined && { shippingFee: new Prisma.Decimal(dto.shippingFee) }),
                ...(dto.codFee !== undefined && { codFee: new Prisma.Decimal(dto.codFee) }),
                ...(dto.notes && { notes: dto.notes }),
                ...(dto.totalAmount !== undefined && { totalAmount: new Prisma.Decimal(dto.totalAmount) }),
            },
            include: { items: true, address: true },
        });
    }

    /** Dashboard analytics — summary stats */
    async getDashboardStats() {
        const [totalOrders, totalRevenue, pendingOrders, activeProducts, lowStockCount] =
            await Promise.all([
                this.prisma.order.count({ where: { status: { not: 'CANCELED' } } }),
                this.prisma.order.aggregate({
                    where: { status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] } },
                    _sum: { totalAmount: true },
                }),
                this.prisma.order.count({ where: { status: 'PENDING' } }),
                this.prisma.product.count({ where: { isActive: true } }),
                this.prisma.product.count({ where: { stockQuantity: { lte: 10 }, isActive: true } }),
            ]);

        return {
            totalOrders,
            totalRevenue: totalRevenue._sum.totalAmount ?? 0,
            pendingOrders,
            activeProducts,
            lowStockCount,
        };
    }
}

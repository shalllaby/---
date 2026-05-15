import {
    Injectable, NotFoundException, ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { KuwaitGovernorate } from '@prisma/client';

@Injectable()
export class AddressesService {
    constructor(private readonly prisma: PrismaService) { }

    /** List all addresses for the authenticated user */
    async findAll(userId: string) {
        return this.prisma.address.findMany({
            where: { userId },
            orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        });
    }

    async create(userId: string, dto: CreateAddressDto) {
        const count = await this.prisma.address.count({ where: { userId } });

        if (count >= 4) {
            throw new BadRequestException('Maximum of 4 saved addresses allowed.');
        }

        // Check for exact duplicate
        const existingAddress = await this.prisma.address.findFirst({
            where: {
                userId,
                governorate: dto.governorate as KuwaitGovernorate,
                area: dto.area,
                block: dto.block,
                street: dto.street,
                building: dto.building || null,
                floor: dto.floor || null,
                apartment: dto.apartment || null,
            },
        });

        if (existingAddress) {
            return existingAddress;
        }

        return this.prisma.address.create({
            data: {
                ...dto,
                governorate: dto.governorate as KuwaitGovernorate,
                userId,
                isDefault: dto.isDefault ?? count === 0, // first address is always default
            },
        });
    }

    /** Update an address belonging to the authenticated user */
    async update(userId: string, addressId: string, dto: UpdateAddressDto) {
        await this.verifyOwnership(userId, addressId);

        return this.prisma.address.update({
            where: { id: addressId },
            data: {
                ...dto,
                ...(dto.governorate && { governorate: dto.governorate as KuwaitGovernorate }),
            },
        });
    }

    /** Delete an address belonging to the authenticated user */
    async remove(userId: string, addressId: string) {
        await this.verifyOwnership(userId, addressId);

        await this.prisma.address.delete({ where: { id: addressId } });

        // If the deleted address was default, promote the most recent one
        const remainingDefault = await this.prisma.address.findFirst({
            where: { userId, isDefault: true },
        });
        if (!remainingDefault) {
            const first = await this.prisma.address.findFirst({
                where: { userId },
                orderBy: { createdAt: 'desc' },
            });
            if (first) {
                await this.prisma.address.update({
                    where: { id: first.id },
                    data: { isDefault: true },
                });
            }
        }

        return { message: 'تم حذف العنوان بنجاح' };
    }

    /** Mark one address as default — unsets all others in a transaction */
    async setDefault(userId: string, addressId: string) {
        await this.verifyOwnership(userId, addressId);

        await this.prisma.$transaction([
            this.prisma.address.updateMany({
                where: { userId },
                data: { isDefault: false },
            }),
            this.prisma.address.update({
                where: { id: addressId },
                data: { isDefault: true },
            }),
        ]);

        return { message: 'تم تعيين العنوان كافتراضي' };
    }

    /**
     * Security helper: used by OrdersService to verify that a given addressId
     * belongs to the requesting user before using it in checkout.
     * Throws ForbiddenException if the address belongs to a different user.
     */
    async verifyOwnership(userId: string, addressId: string) {
        const address = await this.prisma.address.findUnique({ where: { id: addressId } });
        if (!address) throw new NotFoundException('العنوان غير موجود');
        if (address.userId !== userId) throw new ForbiddenException('غير مصرح بالوصول إلى هذا العنوان');
        return address;
    }
}

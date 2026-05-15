import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus, ShippingType } from '@prisma/client';

export class UpdateOrderStatusDto {
    @ApiProperty({ enum: OrderStatus })
    @IsEnum(OrderStatus)
    status: OrderStatus;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    trackingNumber?: string;

    @ApiProperty({ enum: ShippingType, required: false })
    @IsOptional()
    @IsEnum(ShippingType)
    shippingType?: ShippingType;

    @ApiProperty({ required: false, description: 'Payment gateway transaction reference' })
    @IsOptional()
    @IsString()
    paymentRef?: string;
}

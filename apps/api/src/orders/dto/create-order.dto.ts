import {
    IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod, ShippingType } from '@prisma/client';

class OrderItemInputDto {
    @IsUUID()
    @IsNotEmpty()
    productId: string;

    @IsNumber()
    @Min(1)
    quantity: number;
}

export class CreateOrderDto {
    @ApiProperty({ type: [OrderItemInputDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemInputDto)
    items: OrderItemInputDto[];

    @ApiProperty({ enum: PaymentMethod })
    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    addressId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @ValidateNested()
    @Type(() => Object) // simplified for the DTO update, mapping to Address properties
    address?: {
        fullName: string;
        phone: string;
        governorate: string; // KuwaitGovernorate
        area: string;
        block: string;
        street: string;
        building?: string;
        floor?: string;
        apartment?: string;
        deliveryNotes?: string;
    };

    @ApiProperty({ enum: ShippingType, required: false })
    @IsOptional()
    @IsEnum(ShippingType)
    shippingType?: ShippingType;

    @ApiProperty({ required: false, default: 0 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    shippingFee?: number;

    @ApiProperty({ required: false, default: 0 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    codFee?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    couponCode?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    deliveryNotes?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    notes?: string;
}

import {
    Controller, Get, Post, Patch, Delete, Body, Param,
    UseGuards, Query, UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsQueryDto } from './dto/products-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

const imageStorage = memoryStorage();

@ApiTags('Products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    // ── Public endpoints ─────────────────────────────────────────
    @Get()
    @ApiOperation({ summary: 'List products with search, filter, sort, pagination' })
    findAll(@Query() query: ProductsQueryDto) {
        return this.productsService.findAll(query);
    }

    @Get('low-stock')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    @ApiOperation({ summary: '[Admin] Get low-stock products' })
    getLowStock(@Query('threshold') threshold?: number) {
        return this.productsService.getLowStock(threshold);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get product by ID (also increments view count)' })
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    // ── Admin-only endpoints ─────────────────────────────────────
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data', 'application/json')
    @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
    @ApiOperation({ summary: '[Admin] Create product with optional image upload' })
    async create(
        @Body() dto: CreateProductDto,
        @UploadedFile() image?: Express.Multer.File,
    ) {
        // Handle boolean parsing for FormData
        if (typeof dto.isActive === 'string') dto.isActive = dto.isActive === 'true';
        if (typeof dto.isFeatured === 'string') dto.isFeatured = dto.isFeatured === 'true';

        const product = await this.productsService.create(dto);
        if (image) {
            await this.productsService.uploadImages(product.id, [image]);
        }
        return this.productsService.findOne(product.id);
    }

    @Post(':id/image')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image', { storage: imageStorage }))
    @ApiOperation({ summary: '[Admin] Upload product image' })
    async uploadImage(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.productsService.uploadImages(id, [file]);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data', 'application/json')
    @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
    @ApiOperation({ summary: '[Admin] Update product with optional image upload' })
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateProductDto,
        @UploadedFile() image?: Express.Multer.File,
    ) {
        // Handle boolean parsing for FormData
        if (typeof dto.isActive === 'string') dto.isActive = dto.isActive === 'true';
        if (typeof dto.isFeatured === 'string') dto.isFeatured = dto.isFeatured === 'true';

        await this.productsService.update(id, dto);
        if (image) {
            await this.productsService.uploadImages(id, [image]);
        }
        return this.productsService.findOne(id);
    }

    @Patch(':id/toggle-active')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    @ApiOperation({ summary: '[Admin] Toggle product visibility' })
    toggleActive(@Param('id') id: string) {
        return this.productsService.toggleActive(id);
    }

    @Patch(':id/stock')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    @ApiOperation({ summary: '[Admin] Update stock quantity' })
    updateStock(@Param('id') id: string, @Body('quantity') quantity: number) {
        return this.productsService.updateStock(id, quantity);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    @ApiOperation({ summary: '[Admin] Delete product' })
    remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }
}

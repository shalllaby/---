import {
    Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { OrderStatus } from '@prisma/client';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    // ── Customer endpoints ────────────────────────────────────────
    @Post()
    @ApiOperation({ summary: 'Place a new order' })
    create(@Request() req: any, @Body() dto: CreateOrderDto) {
        return this.ordersService.create(req.user.userId, dto);
    }

    @Get('my-orders')
    @ApiOperation({ summary: 'Get my order history' })
    findMyOrders(@Request() req: any) {
        return this.ordersService.findMyOrders(req.user.userId);
    }

    @Get('stats')
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @ApiOperation({ summary: '[Admin] Dashboard stats' })
    getDashboardStats() {
        return this.ordersService.getDashboardStats();
    }

    @Get()
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @ApiOperation({ summary: '[Admin] List all orders' })
    findAll(
        @Query('status') status?: OrderStatus,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.ordersService.findAll(status, page, limit);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get order details' })
    findOne(@Param('id') id: string, @Request() req: any) {
        const isAdmin = req.user.role === 'ADMIN';
        return this.ordersService.findOne(id, isAdmin ? undefined : req.user.userId);
    }

    @Patch(':id/status')
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @ApiOperation({ summary: '[Admin] Update order status' })
    updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
        return this.ordersService.updateStatus(id, dto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an existing pending order (e.g. from saved box)' })
    update(@Param('id') id: string, @Request() req: any, @Body() dto: any) {
        return this.ordersService.update(id, req.user.userId, dto);
    }
}

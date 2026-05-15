import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // ── Global prefix ────────────────────────────────
    app.setGlobalPrefix('api/v1');

    // ── CORS (allow Next.js frontend) ────────────────
    app.enableCors({
        origin: [
            'https://deira.store',
            'https://www.deira.store',
            'http://localhost:3000'
        ],
        credentials: true,
    });

    // ── Global validation pipe ────────────────────────
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,      // Strip unknown properties
            forbidNonWhitelisted: true,
            transform: true,      // Auto-transform payloads to DTO classes
            transformOptions: { enableImplicitConversion: true },
        }),
    );

    // ── Swagger API Docs ──────────────────────────────
    const config = new DocumentBuilder()
        .setTitle('Kuwait Store API')
        .setDescription('B2C E-Commerce API — Saudi Market')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = process.env.PORT ?? 3001;
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 API running at http://0.0.0.0:${port}/api/v1`);
    console.log(`📚 Swagger docs at http://localhost:${port}/api/docs`);
}
bootstrap();

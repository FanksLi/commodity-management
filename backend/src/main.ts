import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { AppModule } from './app.module';
import { User } from './modules/user/schemas/user.schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('商品管理系统 API')
    .setDescription('商品管理系统后端API文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const userModel = app.get<Model<User>>(getModelToken(User.name));
  const adminExists = await userModel.findOne({ username: 'admin' });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('123456', 10);
    await userModel.create({
      username: 'admin',
      password: hashedPassword,
      name: '管理员',
      email: 'admin@example.com',
      roles: ['admin'],
      isActive: true,
    });
    console.log('Default admin user created: admin / 123456');
  }

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
}
bootstrap();
import { NestFactory, Reflector, APP_GUARD } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
// import { JwtAuthGuard } from './config/middleware/jwt.auth.guard';
import { JwtAuth } from './config/middleware/jwt.middleware';
import { TimeTrackerInterceptor } from 'timetracker.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const config = new DocumentBuilder()
    .setTitle('PoC API')
    .setDescription('API documentation for PoC')
    .setVersion('1.0')
    .addTag('poc')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token', // name to reference later
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const reflector = app.get(Reflector);
  const jwtService = app.get(JwtService);
  // app.useGlobalInterceptors(new JwtAuthGuard(jwtService, reflector));
  app.useGlobalGuards(new JwtAuth(jwtService, reflector));
  app.useGlobalInterceptors(new TimeTrackerInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

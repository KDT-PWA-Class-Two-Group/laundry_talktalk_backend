import { NestFactory } from "@nestjs/core";
import 'reflect-metadata';
import { AppModule } from "./app.module";
//nest g resource 'orders'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 모든 API에 '/api' prefix 추가
  app.setGlobalPrefix("api");

  // CORS 활성화 (프론트엔드와 통신을 위해 필수)
  app.enableCors();

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();

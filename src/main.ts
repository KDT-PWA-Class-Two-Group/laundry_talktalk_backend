import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
//nest g resource 'orders'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 모든 API에 '/api' prefix 추가
  app.setGlobalPrefix("api");

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();

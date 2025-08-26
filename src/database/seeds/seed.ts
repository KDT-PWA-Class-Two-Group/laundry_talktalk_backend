import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { SeedService } from './seed.service';

async function bootstrap() {
  console.log('🌱 Starting database seeding process...');
  
  const app = await NestFactory.createApplicationContext(SeedModule);
  const seedService = app.get(SeedService);
  
  try {
    await seedService.seed();
    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();

import { DataSourceOptions } from "typeorm";

const config: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_DATABASE || 'laundry_talktalk',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true, // 개발 환경에서만 true
};

export default config;

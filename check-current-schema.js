const { Client } = require('pg');

async function checkSchema() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_DATABASE || 'laundry_talktalk',
  });

  try {
    await client.connect();
    console.log('🔗 데이터베이스 연결 성공');

    // 1. review 테이블 스키마 확인
    console.log('\n📋 Review 테이블 스키마:');
    const reviewSchema = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'review' 
      ORDER BY ordinal_position;
    `);
    console.table(reviewSchema.rows);

    // 2. review_comment 테이블 스키마 확인
    console.log('\n📋 Review Comment 테이블 스키마:');
    const commentSchema = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'review_comment' 
      ORDER BY ordinal_position;
    `);
    console.table(commentSchema.rows);

    // 3. 현재 데이터 확인
    console.log('\n📊 Review 테이블 데이터:');
    const reviewData = await client.query('SELECT * FROM review LIMIT 5');
    console.table(reviewData.rows);

    console.log('\n📊 Review Comment 테이블 데이터:');
    const commentData = await client.query('SELECT * FROM review_comment LIMIT 5');
    console.table(commentData.rows);

  } catch (error) {
    console.error('❌ 에러 발생:', error);
  } finally {
    await client.end();
    console.log('🔚 데이터베이스 연결 종료');
  }
}

// dotenv 사용
require('dotenv').config();
checkSchema();

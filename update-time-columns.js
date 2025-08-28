const { Client } = require('pg');

async function updateTimeColumns() {
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

    // 1. review 테이블의 review_create_time 컬럼 타입 변경
    console.log('📝 review.review_create_time 컬럼을 timestamptz로 변경 중...');
    await client.query(`
      ALTER TABLE review 
      ALTER COLUMN review_create_time TYPE timestamptz 
      USING review_create_time::timestamptz
    `);
    console.log('✅ review.review_create_time 변경 완료');

    // 2. review_comment 테이블의 review_comment_create_time 컬럼 타입 변경
    console.log('📝 review_comment.review_comment_create_time 컬럼을 timestamptz로 변경 중...');
    await client.query(`
      ALTER TABLE review_comment 
      ALTER COLUMN review_comment_create_time TYPE timestamptz 
      USING review_comment_create_time::timestamptz
    `);
    console.log('✅ review_comment.review_comment_create_time 변경 완료');

    // 3. 기본값 설정
    console.log('📝 기본값을 CURRENT_TIMESTAMP로 설정 중...');
    await client.query(`
      ALTER TABLE review 
      ALTER COLUMN review_create_time SET DEFAULT CURRENT_TIMESTAMP
    `);
    
    await client.query(`
      ALTER TABLE review_comment 
      ALTER COLUMN review_comment_create_time SET DEFAULT CURRENT_TIMESTAMP
    `);
    console.log('✅ 기본값 설정 완료');

    console.log('🎉 모든 컬럼 타입 변경이 완료되었습니다!');

  } catch (error) {
    console.error('❌ 에러 발생:', error);
  } finally {
    await client.end();
    console.log('🔚 데이터베이스 연결 종료');
  }
}

updateTimeColumns();

const { Client } = require('pg');

async function checkSchema() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '1234',
    database: 'laundry_talktalk'
  });

  try {
    await client.connect();
    console.log('✅ 데이터베이스 연결 성공');

    // auth 테이블 구조 확인
    console.log('\n=== AUTH 테이블 구조 ===');
    const authResult = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default, character_maximum_length
      FROM information_schema.columns 
      WHERE table_name = 'auth' 
      ORDER BY ordinal_position;
    `);
    
    console.table(authResult.rows);

    // review 테이블 구조 확인
    console.log('\n=== REVIEW 테이블 구조 ===');
    const reviewResult = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default, character_maximum_length
      FROM information_schema.columns 
      WHERE table_name = 'review' 
      ORDER BY ordinal_position;
    `);
    
    console.table(reviewResult.rows);

    // review_comment 테이블 구조 확인
    console.log('\n=== REVIEW_COMMENT 테이블 구조 ===');
    const reviewCommentResult = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default, character_maximum_length
      FROM information_schema.columns 
      WHERE table_name = 'review_comment' 
      ORDER BY ordinal_position;
    `);
    
    console.table(reviewCommentResult.rows);

    // 모든 테이블 목록 확인
    console.log('\n=== 모든 테이블 목록 ===');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.table(tablesResult.rows);

  } catch (error) {
    console.error('❌ 오류:', error.message);
  } finally {
    await client.end();
  }
}

checkSchema();

const { Client } = require('pg');

async function fixSchema() {
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

    // 1. AUTH 테이블에 누락된 컬럼들 추가
    console.log('\n=== AUTH 테이블 수정 ===');
    
    // reset_token 컬럼 추가
    await client.query(`
      ALTER TABLE auth 
      ADD COLUMN IF NOT EXISTS reset_token VARCHAR NULL;
    `);
    console.log('✅ reset_token 컬럼 추가됨');

    // reset_token_expires_at 컬럼 추가
    await client.query(`
      ALTER TABLE auth 
      ADD COLUMN IF NOT EXISTS reset_token_expires_at TIMESTAMPTZ NULL;
    `);
    console.log('✅ reset_token_expires_at 컬럼 추가됨');

    // created_at 컬럼 추가 (기본값 포함)
    await client.query(`
      ALTER TABLE auth 
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
    `);
    console.log('✅ created_at 컬럼 추가됨');

    // updated_at 컬럼 추가 (기본값 포함)s
    await client.query(`
      ALTER TABLE auth 
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
    `);
    console.log('✅ updated_at 컬럼 추가됨');

    // login_id, email을 NOT NULL로 변경 (기존 NULL 데이터가 있으면 기본값 설정)
    await client.query(`
      UPDATE auth SET login_id = 'user_' || user_id WHERE login_id IS NULL;
    `);
    await client.query(`
      UPDATE auth SET email = 'user' || user_id || '@example.com' WHERE email IS NULL;
    `);
    await client.query(`
      ALTER TABLE auth ALTER COLUMN login_id SET NOT NULL;
    `);
    await client.query(`
      ALTER TABLE auth ALTER COLUMN email SET NOT NULL;
    `);
    console.log('✅ login_id, email을 NOT NULL로 변경됨');

    // 2. REVIEW 테이블 수정
    console.log('\n=== REVIEW 테이블 수정 ===');
    
    // NULL 값들을 기본값으로 업데이트
    await client.query(`
      UPDATE review 
      SET review_create_time = NOW()::time 
      WHERE review_create_time IS NULL;
    `);
    console.log('✅ review_create_time NULL 값 수정됨');

    // admin_id 컬럼 추가
    await client.query(`
      ALTER TABLE review 
      ADD COLUMN IF NOT EXISTS admin_id INTEGER NULL;
    `);
    console.log('✅ review 테이블에 admin_id 컬럼 추가됨');

    // machine_id 컬럼 제거 (엔티티에 없음)
    await client.query(`
      ALTER TABLE review 
      DROP COLUMN IF EXISTS machine_id;
    `);
    console.log('✅ review 테이블에서 machine_id 컬럼 제거됨');

    // 3. REVIEW_COMMENT 테이블 수정
    console.log('\n=== REVIEW_COMMENT 테이블 수정 ===');
    
    // NULL 값들을 기본값으로 업데이트
    await client.query(`
      UPDATE review_comment 
      SET review_comment_create_time = NOW()::time 
      WHERE review_comment_create_time IS NULL;
    `);
    console.log('✅ review_comment_create_time NULL 값 수정됨');

    // admin_id 컬럼 추가
    await client.query(`
      ALTER TABLE review_comment 
      ADD COLUMN IF NOT EXISTS admin_id INTEGER NULL;
    `);
    console.log('✅ review_comment 테이블에 admin_id 컬럼 추가됨');

    // machine_id 컬럼 제거 (엔티티에 없음)
    await client.query(`
      ALTER TABLE review_comment 
      DROP COLUMN IF EXISTS machine_id;
    `);
    console.log('✅ review_comment 테이블에서 machine_id 컬럼 제거됨');

    console.log('\n🎉 모든 스키마 수정 완료!');

  } catch (error) {
    console.error('❌ 오류:', error.message);
  } finally {
    await client.end();
  }
}

fixSchema();

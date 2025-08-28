const { Client } = require('pg');

async function removeAdminIdColumns() {
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

    // REVIEW 테이블에서 admin_id 컬럼 제거
    console.log('\n=== REVIEW 테이블에서 admin_id 제거 ===');
    await client.query(`
      ALTER TABLE review 
      DROP COLUMN IF EXISTS admin_id;
    `);
    console.log('✅ review 테이블에서 admin_id 컬럼 제거됨');

    // REVIEW_COMMENT 테이블에서 admin_id 컬럼 제거
    console.log('\n=== REVIEW_COMMENT 테이블에서 admin_id 제거 ===');
    await client.query(`
      ALTER TABLE review_comment 
      DROP COLUMN IF EXISTS admin_id;
    `);
    console.log('✅ review_comment 테이블에서 admin_id 컬럼 제거됨');

    // FK 제약조건 확인 및 생성
    console.log('\n=== FK 제약조건 확인 ===');
    
    // 기존 FK 제약조건 확인
    const existingFK = await client.query(`
      SELECT constraint_name 
      FROM information_schema.table_constraints 
      WHERE table_name = 'review_comment' 
      AND constraint_type = 'FOREIGN KEY';
    `);
    
    if (existingFK.rows.length === 0) {
      // FK 제약조건 생성
      await client.query(`
        ALTER TABLE review_comment 
        ADD CONSTRAINT fk_review_comment_review_id 
        FOREIGN KEY (review_id) REFERENCES review(review_id) 
        ON DELETE CASCADE;
      `);
      console.log('✅ review_comment -> review FK 제약조건 생성됨');
    } else {
      console.log('✅ FK 제약조건이 이미 존재합니다');
    }

    console.log('\n🎉 admin_id 컬럼 제거 및 FK 설정 완료!');

  } catch (error) {
    console.error('❌ 오류:', error.message);
  } finally {
    await client.end();
  }
}

removeAdminIdColumns();

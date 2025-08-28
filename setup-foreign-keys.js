const { Client } = require('pg');

async function setupForeignKeys() {
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

    // 1. REVIEW 테이블에 machine_id 컬럼 추가
    console.log('\n=== REVIEW 테이블에 machine_id 추가 ===');
    await client.query(`
      ALTER TABLE review 
      ADD COLUMN IF NOT EXISTS machine_id INTEGER NOT NULL DEFAULT 1;
    `);
    console.log('✅ review 테이블에 machine_id 컬럼 추가됨');

    // 2. REVIEW_COMMENT 테이블에 machine_id 컬럼 추가
    console.log('\n=== REVIEW_COMMENT 테이블에 machine_id 추가 ===');
    await client.query(`
      ALTER TABLE review_comment 
      ADD COLUMN IF NOT EXISTS machine_id INTEGER NOT NULL DEFAULT 1;
    `);
    console.log('✅ review_comment 테이블에 machine_id 컬럼 추가됨');

    // 3. 기존 FK 제약조건 확인 및 삭제
    console.log('\n=== 기존 FK 제약조건 정리 ===');
    
    // 기존 FK 제약조건들 확인
    const existingConstraints = await client.query(`
      SELECT constraint_name, table_name
      FROM information_schema.table_constraints 
      WHERE (table_name = 'review' OR table_name = 'review_comment')
      AND constraint_type = 'FOREIGN KEY';
    `);
    
    // 기존 제약조건 삭제
    for (const constraint of existingConstraints.rows) {
      await client.query(`
        ALTER TABLE ${constraint.table_name} 
        DROP CONSTRAINT IF EXISTS ${constraint.constraint_name};
      `);
      console.log(`✅ 기존 제약조건 ${constraint.constraint_name} 삭제됨`);
    }

    // 4. REVIEW 테이블 FK 제약조건 생성
    console.log('\n=== REVIEW 테이블 FK 제약조건 생성 ===');
    
    const reviewFKs = [
      { column: 'reservation_id', refTable: 'reservation', refColumn: 'reservation_id' },
      { column: 'store_id', refTable: 'store', refColumn: 'store_id' },
      { column: 'user_id', refTable: 'auth', refColumn: 'user_id' },
      { column: 'machine_id', refTable: 'machine', refColumn: 'machine_id' }
    ];

    for (const fk of reviewFKs) {
      try {
        await client.query(`
          ALTER TABLE review 
          ADD CONSTRAINT fk_review_${fk.column}
          FOREIGN KEY (${fk.column}) REFERENCES ${fk.refTable}(${fk.refColumn})
          ON DELETE CASCADE;
        `);
        console.log(`✅ review.${fk.column} -> ${fk.refTable}.${fk.refColumn} FK 생성됨`);
      } catch (error) {
        console.log(`⚠️  review.${fk.column} FK 생성 실패 (테이블이 없을 수 있음): ${error.message}`);
      }
    }

    // 5. REVIEW_COMMENT 테이블 FK 제약조건 생성
    console.log('\n=== REVIEW_COMMENT 테이블 FK 제약조건 생성 ===');
    
    const reviewCommentFKs = [
      { column: 'review_id', refTable: 'review', refColumn: 'review_id' },
      { column: 'reservation_id', refTable: 'reservation', refColumn: 'reservation_id' },
      { column: 'store_id', refTable: 'store', refColumn: 'store_id' },
      { column: 'user_id', refTable: 'auth', refColumn: 'user_id' },
      { column: 'machine_id', refTable: 'machine', refColumn: 'machine_id' }
    ];

    for (const fk of reviewCommentFKs) {
      try {
        await client.query(`
          ALTER TABLE review_comment 
          ADD CONSTRAINT fk_review_comment_${fk.column}
          FOREIGN KEY (${fk.column}) REFERENCES ${fk.refTable}(${fk.refColumn})
          ON DELETE CASCADE;
        `);
        console.log(`✅ review_comment.${fk.column} -> ${fk.refTable}.${fk.refColumn} FK 생성됨`);
      } catch (error) {
        console.log(`⚠️  review_comment.${fk.column} FK 생성 실패 (테이블이 없을 수 있음): ${error.message}`);
      }
    }

    // 6. 생성된 FK 제약조건 확인
    console.log('\n=== 생성된 FK 제약조건 확인 ===');
    const finalConstraints = await client.query(`
      SELECT 
        tc.constraint_name,
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND (tc.table_name = 'review' OR tc.table_name = 'review_comment')
      ORDER BY tc.table_name, tc.constraint_name;
    `);
    
    console.table(finalConstraints.rows);

    console.log('\n🎉 모든 외래키 설정 완료!');

  } catch (error) {
    console.error('❌ 오류:', error.message);
  } finally {
    await client.end();
  }
}

setupForeignKeys();

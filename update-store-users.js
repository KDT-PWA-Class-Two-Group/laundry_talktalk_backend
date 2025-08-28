// Store 테이블에 기본 user_id 설정하는 스크립트
const { DataSource } = require('typeorm');

async function updateStoreUsers() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_DATABASE || 'laundry_talktalk',
  });

  try {
    await dataSource.initialize();
    console.log('데이터베이스 연결 성공');

    // 1. 첫 번째 사용자 ID 가져오기
    const firstUserResult = await dataSource.query(`
      SELECT user_id FROM auth ORDER BY user_id LIMIT 1
    `);

    if (firstUserResult.length === 0) {
      console.log('사용자가 없습니다. 기본 사용자를 생성합니다.');
      
      // 기본 사용자 생성
      await dataSource.query(`
        INSERT INTO auth (user_type, user_login_id, user_password, user_name, user_email, user_phone_number, user_location) 
        VALUES ('customer', 'admin', '$2b$10$defaulthash', '관리자', 'admin@laundry.com', '010-0000-0000', '서울특별시')
      `);
      
      const newUserResult = await dataSource.query(`
        SELECT user_id FROM auth WHERE user_login_id = 'admin'
      `);
      
      defaultUserId = newUserResult[0].user_id;
    } else {
      defaultUserId = firstUserResult[0].user_id;
    }

    console.log(`기본 사용자 ID: ${defaultUserId}`);

    // 2. user_id가 null인 Store 레코드 업데이트
    const updateResult = await dataSource.query(`
      UPDATE store SET user_id = $1 WHERE user_id IS NULL
    `, [defaultUserId]);

    console.log(`업데이트된 Store 레코드 수: ${updateResult.affectedRows || 'unknown'}`);

    // 3. 업데이트 결과 확인
    const storeCount = await dataSource.query(`
      SELECT COUNT(*) as count FROM store WHERE user_id IS NOT NULL
    `);

    console.log(`user_id가 설정된 Store 개수: ${storeCount[0].count}`);

  } catch (error) {
    console.error('오류 발생:', error);
  } finally {
    await dataSource.destroy();
  }
}

updateStoreUsers();
